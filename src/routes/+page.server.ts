import { POSTS_PER_PAGE } from '$lib/config';
import { getPosts } from '$lib/posts';
import { error } from '@sveltejs/kit';
import { statSync } from 'fs';
import path from 'path'; // <-- Import the path module

export const load = async ({ url }) => {
	try {
		const page = parseInt(url.searchParams.get('page') || '1');
		const { posts, total } = await getPosts(page, POSTS_PER_PAGE);

		// Manually add the 'AmABengaliMan' post to be featured
		const featuredPostSlug = 'AmABengaliMan';
		const featuredPostModule = await import(`../lib/posts/${featuredPostSlug}.md`);
		const featuredPostMetadata = featuredPostModule.metadata;

		// Create a robust, absolute path to the file
		const postPath = path.resolve('src/lib/posts', `${featuredPostSlug}.md`);
		
		// Get last modified time using the correct path
		const stats = statSync(postPath);
		const lastModified = stats.mtime.toISOString();

		const featuredPost = {
			slug: featuredPostSlug,
			...featuredPostMetadata,
			lastModified
		};

		return {
			posts,
			total,
			page,
			postsPerPage: POSTS_PER_PAGE,
			featuredPost
		};
	} catch (e) {
		console.error(e);
		// This will now give a more meaningful error if something is wrong
		error(500, 'Could not load the featured post. Please check the server logs.');
	}
};