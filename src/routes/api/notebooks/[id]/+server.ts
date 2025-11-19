// src/routes/api/notebooks/[id]/+server.ts
import { json, error as svelteKitError } from '@sveltejs/kit';
import { getNotebook, updateNotebook } from '$lib/server/storage/kv';
import { checkEditorSecret } from '$lib/server/auth';
import type { RequestHandler } from './$types';
import type { Section } from '$lib/types/notebook';

export const config = {
	bodySizeLimit: '4.5mb'
};

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
	const authHeader = request.headers.get('Authorization');
	const token = authHeader?.split(' ')[1];
	const providedSecret = (token || request.headers.get('X-Editor-Secret')) ?? undefined;

	if (!checkEditorSecret(providedSecret)) {
		throw svelteKitError(403, 'Forbidden: Invalid or missing secret');
	}

	try {
		const payload = await request.json();

		if (!payload || !Array.isArray(payload.sections) || typeof payload.title !== 'string') {
			throw svelteKitError(400, 'Invalid payload: title (string) and sections (array) are required');
		}

		const sections = payload.sections as Section[];
		const title = payload.title as string;

		const updatedNotebook = await updateNotebook(params.id, title, sections);

		if (!updatedNotebook) {
			throw svelteKitError(404, 'Notebook not found');
		}

		return json(updatedNotebook, { status: 200 });
	} catch (err: any) {
		console.error(`Error updating notebook ${params.id}:`, err);
		if (err.status) throw err;
		throw svelteKitError(500, 'Failed to update notebook');
	}
};