// src/routes/api/notebooks/[id]/+server.ts
import { json, error as svelteKitError } from '@sveltejs/kit';
// --- IMPORT THE NEW FUNCTION ---
import { getNotebook, updateNotebook } from '$lib/server/storage/filesystem';
import { checkEditorSecret } from '$lib/server/auth';
import type { RequestHandler } from './$types';
import type { Section } from '$lib/types/notebook';

// (GET handler is unchanged)
export const GET: RequestHandler = async ({ params }) => {
	try {
		const notebook = await getNotebook(params.id);
		if (!notebook) {
			throw svelteKitError(404, 'Notebook not found');
		}
		return json(notebook);
	} catch (err: any) {
		console.error(`Error fetching notebook ${params.id}:`, err);
		if (err.status === 404) throw err;
		throw svelteKitError(500, 'Failed to fetch notebook');
	}
};

export const PATCH: RequestHandler = async ({ params, request }) => {
	// (Auth check is unchanged)
	const authHeader = request.headers.get('Authorization');
	const token = authHeader?.split(' ')[1];
	const providedSecret = (token || request.headers.get('X-Editor-Secret')) ?? undefined;

	if (!checkEditorSecret(providedSecret)) {
		throw svelteKitError(403, 'Forbidden: Invalid or missing secret');
	}
	// --- End Auth Check ---

	try {
		const payload = await request.json();

		// --- UPDATE VALIDATION ---
		if (!payload || !Array.isArray(payload.sections) || typeof payload.title !== 'string') {
			throw svelteKitError(400, 'Invalid payload: title (string) and sections (array) are required');
		}

		const sections = payload.sections as Section[];
		const title = payload.title as string;

		// --- USE THE NEW FUNCTION ---
		const updatedNotebook = await updateNotebook(params.id, title, sections);

		if (!updatedNotebook) {
			throw svelteKitError(404, 'Notebook not found');
		}

		return json(updatedNotebook, { status: 200 });
	} catch (err: any) {
		console.error(`Error updating notebook ${params.id}:`, err);
		if (err.status) throw err; // Re-throw SvelteKit errors
		throw svelteKitError(500, 'Failed to update notebook');
	}
};