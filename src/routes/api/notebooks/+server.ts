// src/routes/api/notebooks/+server.ts
import { json } from '@sveltejs/kit';
import { createNotebook } from '$lib/server/storage/filesystem';
import { getEditToken } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		// Optional: Get title from request body later
		const notebook = await createNotebook('Untitled Notebook');
		const editToken = getEditToken(); // For skeleton, just sends the secret

		if (!editToken) {
			return json({ error: 'Server configuration error (missing secret)' }, { status: 500 });
		}

		return json({ id: notebook.id, editToken: editToken, notebook }, { status: 201 });
	} catch (error) {
		console.error('Error creating notebook:', error);
		return json({ error: 'Failed to create notebook' }, { status: 500 });
	}
};