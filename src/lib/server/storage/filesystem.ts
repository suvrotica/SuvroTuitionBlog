// src/lib/server/storage/filesystem.ts
import fs from 'fs/promises';
import path from 'path';
import type { Notebook, Section } from '$lib/types/notebook';
import { generateUUID } from '$lib/utils/uuid';

// Vercel's serverless functions have a read-only filesystem, *except* for the /tmp directory.
// We check for the VERCEL environment variable (which is '1' on Vercel)
// to decide which directory to use.
const sessionsDir =
	process.env.VERCEL === '1'
		? path.join('/tmp', 'sessions')
		: path.join(process.cwd(), 'data', 'sessions');

/**
 * Ensures that the sessions directory exists.
 */
async function ensureDir() {
	try {
		await fs.access(sessionsDir);
	} catch {
		await fs.mkdir(sessionsDir, { recursive: true });
	}
}

/**
 * Writes a notebook object to a JSON file.
 * @param notebook The notebook object to save.
 */
async function saveNotebook(notebook: Notebook): Promise<void> {
	await ensureDir();
	const filePath = path.join(sessionsDir, `${notebook.id}.json`);
	try {
		await fs.writeFile(filePath, JSON.stringify(notebook, null, 2));
		console.log(`[FS Adapter] Saved notebook: ${notebook.id} to ${sessionsDir}`);
	} catch (error) {
		console.error(`[FS Adapter] Error saving notebook ${notebook.id}:`, error);
		throw error;
	}
}

/**
 * Creates a new, empty notebook and saves it.
 * @param title The title for the new notebook.
 * @returns The newly created notebook object.
 */
export async function createNotebook(title: string = 'Untitled Notebook'): Promise<Notebook> {
	const newNotebook: Notebook = {
		id: generateUUID(),
		title: title,
		createdAt: new Date().toISOString(),
		publishedAt: null,
		sections: [],
		meta: { tool: 'whiteboard-v1-dev' }
	};
	await saveNotebook(newNotebook);
	console.log(`[FS Adapter] Created notebook: ${newNotebook.id}`);
	return newNotebook;
}

/**
 * Retrieves a notebook by its ID.
 * @param id The UUID of the notebook.
 * @returns The notebook object or null if not found.
 */
export async function getNotebook(id: string): Promise<Notebook | null> {
	await ensureDir();
	const filePath = path.join(sessionsDir, `${id}.json`);
	try {
		const data = await fs.readFile(filePath, 'utf-8');
		console.log(`[FS Adapter] Read notebook: ${id}`);
		return JSON.parse(data) as Notebook;
	} catch (error: any) {
		if (error.code === 'ENOENT') {
			console.log(`[FS Adapter] Notebook not found: ${id}`);
			return null;
		}
		console.error(`[FS Adapter] Error reading notebook ${id}:`, error);
		throw error; // Other errors
	}
}

/**
 * Updates the title and sections of an existing notebook.
 * @param id The ID of the notebook to update.
 * @param title The new title.
 * @param sections The new array of sections.
 * @returns The updated notebook object or null if not found.
 */
export async function updateNotebook(
	id: string,
	title: string,
	sections: Section[]
): Promise<Notebook | null> {
	const notebook = await getNotebook(id);
	if (!notebook) {
		console.log(`[FS Adapter] Update failed: Notebook not found: ${id}`);
		return null;
	}

	// Update properties
	notebook.title = title;
	notebook.sections = sections;

	// Save the entire notebook
	await saveNotebook(notebook);
	console.log(`[FS Adapter] Updated notebook (title & sections): ${id}`);
	return notebook;
}

/**
 * Retrieves a summary list of all notebooks.
 * @returns An array of notebook summaries.
 */
export async function getAllNotebooks(): Promise<Array<Pick<Notebook, 'id' | 'title' | 'createdAt'>>> {
	await ensureDir();
	try {
		const files = await fs.readdir(sessionsDir);
		const notebookPromises = files
			.filter((file) => file.endsWith('.json'))
			.map(async (file) => {
				const filePath = path.join(sessionsDir, file);
				try {
					const data = await fs.readFile(filePath, 'utf-8');
					const notebook = JSON.parse(data) as Notebook;
					return {
						id: notebook.id,
						title: notebook.title,
						createdAt: notebook.createdAt
					};
				} catch (readErr) {
					console.error(`[FS Adapter] Failed to read or parse notebook file: ${file}`, readErr);
					return null;
				}
			});

		const notebooks = (await Promise.all(notebookPromises))
			.filter((nb): nb is Pick<Notebook, 'id' | 'title' | 'createdAt'> => nb !== null)
			.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

		console.log(`[FS Adapter] Fetched ${notebooks.length} notebook summaries.`);
		return notebooks;
	} catch (error: any) {
		console.error(`[FS Adapter] Error reading sessions directory:`, error);
		throw new Error('Failed to fetch notebook list');
	}
}