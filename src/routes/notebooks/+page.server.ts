// src/routes/notebooks/+page.server.ts
import { error } from '@sveltejs/kit';
import { getAllNotebooks } from '$lib/server/storage/kv';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const notebooks = await getAllNotebooks();
		return {
			notebooks // This will be Array<{id, title, createdAt}>
		};
	} catch (err: any) {
		console.error(`Error loading notebook list for page:`, err);
		throw error(500, 'Failed to load notebooks');
	}
};