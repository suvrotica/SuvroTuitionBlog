// src/lib/server/storage/filesystem.ts
import fs from 'fs/promises';
import path from 'path';
import type { Notebook, Section } from '$lib/types/notebook';
import { generateUUID } from '$lib/utils/uuid';

const sessionsDir = path.join(process.cwd(), 'data', 'sessions');

// (This function is unchanged)
async function ensureDir() {
	try {
		await fs.access(sessionsDir);
	} catch {
		await fs.mkdir(sessionsDir, { recursive: true });
	}
}

// (This function is unchanged)
export async function createNotebook(title: string = 'Untitled Notebook'): Promise<Notebook> {
	await ensureDir();
	const newNotebook: Notebook = {
		id: generateUUID(),
		title: title,
		createdAt: new Date().toISOString(),
		publishedAt: null,
		sections: [],
		meta: { tool: 'whiteboard-v1-dev' }
	};
	const filePath = path.join(sessionsDir, `${newNotebook.id}.json`);
	await fs.writeFile(filePath, JSON.stringify(newNotebook, null, 2));
	console.log(`[FS Adapter] Created notebook: ${newNotebook.id}`);
	return newNotebook;
}

// (This function is unchanged)
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
			return null; // Not found
		}
		console.error(`[FS Adapter] Error reading notebook ${id}:`, error);
		throw error; // Other errors
	}
}

// (This function is unchanged)
export async function saveNotebook(notebook: Notebook): Promise<void> {
	await ensureDir();
	const filePath = path.join(sessionsDir, `${notebook.id}.json`);
	try {
		await fs.writeFile(filePath, JSON.stringify(notebook, null, 2));
		console.log(`[FS Adapter] Saved notebook: ${notebook.id}`);
	} catch (error) {
		console.error(`[FS Adapter] Error saving notebook ${notebook.id}:`, error);
		throw error;
	}
}

// --- NEW FUNCTION ---
// Updates title AND sections. This replaces updateNotebookSections
export async function updateNotebook(
	id: string,
	title: string,
	sections: Section[]
): Promise<Notebook | null> {
	const notebook = await getNotebook(id);
	if (!notebook) {
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

// --- DEPRECATED (but keep for now if other things use it) ---
// We should eventually remove this and only use updateNotebook
export async function updateNotebookSections(id: string, sections: Section[]): Promise<Notebook | null> {
	const notebook = await getNotebook(id);
	if (!notebook) {
		return null;
	}
	notebook.sections = sections;
	await saveNotebook(notebook);
	console.log(`[FS Adapter] Updated sections for notebook: ${id}`);
	return notebook;
}

// (This function is unchanged)
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