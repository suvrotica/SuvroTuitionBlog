// src/routes/blog/[category]/[slug]/+page.ts

import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Component } from 'svelte';

export const load: PageLoad = async ({ params, data }) => {
	try {
		const postModule = await import(`../../../../lib/posts/${params.slug}.md`);
		const content = postModule.default as Component;

		return {
			content,
			...data // Pass through all data from the server load function
		};
	} catch (e) {
		console.error(e);
		error(404, { message: `Could not find post: ${params.slug}` });
	}
};