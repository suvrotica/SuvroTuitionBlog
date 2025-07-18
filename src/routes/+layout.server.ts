// src/routes/+layout.server.ts

import type { ServerLoad } from '@sveltejs/kit';

// Define a type for the post metadata for better type safety.
type Post = {
	title: string;
	date: string;
	slug: string;
	[key: string]: any; // Allows for other optional metadata properties
};

export const load: ServerLoad = async () => {
	// Use Vite's glob import to get all markdown files at build time.
	const modules = import.meta.glob('/src/lib/posts/*.md', { eager: true });

	const posts: Post[] = [];
	for (const path in modules) {
		const file = modules[path];
		const slug = path.split('/').pop()?.slice(0, -3);

		// Ensure all parts are valid before proceeding
		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			// Type cast metadata to allow for checking optional properties
			const metadata = file.metadata as Partial<Post>;

			// Check for the required properties before creating the post object.
			// This prevents errors if a markdown file has missing frontmatter.
			if (metadata && metadata.title && metadata.date) {
				posts.push({
					title: metadata.title,
					date: metadata.date,
					slug: slug,
					...metadata // Add any other optional metadata properties
				});
			}
		}
	}

	// Sort posts by date, newest first.
	const sortedPosts = posts.sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	);

	return {
		posts: sortedPosts
	};
};