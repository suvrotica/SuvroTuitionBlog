// src/lib/server/storage/kv.ts
import { Redis } from '@upstash/redis';
import { KV_REST_API_URL, KV_REST_API_TOKEN } from '$env/static/private';
import type { Notebook, Section } from '$lib/types/notebook';
import { generateUUID } from '$lib/utils/uuid';

// Initialize Redis client as shown in the Vercel guide
// We use your static env variables
const kv = new Redis({
	url: KV_REST_API_URL,
	token: KV_REST_API_TOKEN
});

// This is the key we'll use to store the list of all notebooks
const ALL_NOTEBOOKS_KEY = 'notebooks:all';

/**
 * Retrieves a notebook by its ID from Upstash Redis.
 * @param id The UUID of the notebook.
 * @returns The notebook object or null if not found.
 */
export async function getNotebook(id: string): Promise<Notebook | null> {
	try {
		// Upstash/Redis stores objects as JSON strings
		const notebook = await kv.get<Notebook>(`notebook:${id}`);
		if (!notebook) {
			console.log(`[KV Adapter] Notebook not found: ${id}`);
			return null;
		}
		console.log(`[KV Adapter] Read notebook: ${id}`);
		return notebook;
	} catch (error) {
		console.error(`[KV Adapter] Error reading notebook ${id}:`, error);
		throw error;
	}
}

/**
 * Creates a new, empty notebook and saves it to Upstash Redis.
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

	try {
		// Save the full notebook. It's stored as a JSON string.
		await kv.set(`notebook:${newNotebook.id}`, newNotebook);

		// Also save a summary for the list page.
		// hset stores it in a "hash" (like a big object) for fast lookups.
		await kv.hset(ALL_NOTEBOOKS_KEY, {
			[newNotebook.id]: {
				id: newNotebook.id,
				title: newNotebook.title,
				createdAt: newNotebook.createdAt
			}
		});

		console.log(`[KV Adapter] Created notebook: ${newNotebook.id}`);
		return newNotebook;
	} catch (error) {
		console.error(`[KV Adapter] Error creating notebook ${newNotebook.id}:`, error);
		throw error;
	}
}

/**
 * Updates the title and sections of an existing notebook in Upstash Redis.
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
		console.log(`[KV Adapter] Update failed: Notebook not found: ${id}`);
		return null;
	}

	// Update properties
	notebook.title = title;
	notebook.sections = sections;

	try {
		// Save the full updated notebook
		await kv.set(`notebook:${id}`, notebook);

		// Also update the summary for the list page
		await kv.hset(ALL_NOTEBOOKS_KEY, {
			[id]: {
				id: notebook.id,
				title: notebook.title,
				createdAt: notebook.createdAt
			}
		});

		console.log(`[KV Adapter] Updated notebook: ${id}`);
		return notebook;
	} catch (error) {
		console.error(`[KV Adapter] Error updating notebook ${id}:`, error);
		throw error;
	}
}

/**
 * Retrieves a summary list of all notebooks from Upstash Redis.
 * @returns An array of notebook summaries.
 */
export async function getAllNotebooks(): Promise<Array<Pick<Notebook, 'id' | 'title' | 'createdAt'>>> {
	try {
		const summaries = await kv.hgetall(ALL_NOTEBOOKS_KEY);
		if (!summaries) {
			return [];
		}

		// hgetall returns an object, so we get its values and sort
		const notebookList = Object.values(summaries) as Array<
			Pick<Notebook, 'id' | 'title' | 'createdAt'>
		>;

		notebookList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

		console.log(`[KV Adapter] Fetched ${notebookList.length} notebook summaries.`);
		return notebookList;
	} catch (error: any) {
		console.error(`[KV Adapter] Error fetching notebook list:`, error);
		throw new Error('Failed to fetch notebook list');
	}
}