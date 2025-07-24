// src/routes/blog/[category]/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

interface Post {
	slug: string;
	title: string;
	date: string;
	description: string;
	thumbnail?: string;
	category: string;
	published?: boolean;
}

export const load: PageServerLoad = async ({ params }) => {
	const { category } = params;
	const postFiles = import.meta.glob('/src/lib/posts/*.md', { eager: true });

	try {
		const posts = Object.entries(postFiles)
			.map(([path, file]): Post | null => {
				const slug = path.split('/').pop()?.replace('.md', '');

				if (file && typeof file === 'object' && 'metadata' in file && slug) {
					const metadata = file.metadata as Omit<Post, 'slug'>;
					const postCategory = metadata.category || 'uncategorized';

					if (postCategory === category) {
						// Reverted: Always filter unpublished posts
						if (metadata.published === false) {
							return null;
						}
						return {
							...metadata,
							slug,
							thumbnail: metadata.thumbnail || '/images/placeholders/default.png',
							category: postCategory
						};
					}
				}
				return null;
			})
			.filter((post): post is Post => post !== null);

		if (posts.length === 0) {
			error(404, 'No posts found in this category');
		}

		posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

		return {
			posts,
			category
		};
	} catch (e) {
		console.error(e);
		error(500, 'Could not load posts.');
	}
};