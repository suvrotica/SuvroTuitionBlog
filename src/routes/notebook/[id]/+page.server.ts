// src/routes/notebook/[id]/+page.server.ts
import { error } from '@sveltejs/kit';
import { getNotebook } from '$lib/server/storage/kv';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const notebook = await getNotebook(params.id);
		if (!notebook) {
			throw error(404, 'Notebook not found');
		}
		return {
			notebook
		};
	} catch (err: any) {
		console.error(`Error loading notebook ${params.id} for page:`, err);
		if (err.status === 404) throw err;
		throw error(500, 'Failed to load notebook');
	}
};