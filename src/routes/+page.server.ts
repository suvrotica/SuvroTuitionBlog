// src/routes/+page.server.ts
import { POSTS_PER_PAGE } from '$lib/config';
import { getPosts } from '$lib/server/posts';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	try {
		const page = parseInt(url.searchParams.get('page') || '1');

		// Get all posts. The result from getPosts() is already sorted.
		const { posts: allPosts } = await getPosts(); [cite_start]// [cite: 3302]

		// Paginate the full list of posts
		const total = allPosts.length;
		const posts = allPosts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

		return {
			posts,
			total,
			page,
			postsPerPage: POSTS_PER_PAGE
		};
	} catch (e) {
		console.error('Failed to load page:', e);
		error(500, 'Could not load posts. Please check the server logs.'); [cite_start]// [cite: 3307]
	}
};
