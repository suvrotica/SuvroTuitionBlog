// src/routes/blog/+page.server.ts
import { error } from '@sveltejs/kit';

interface Post {
	slug: string;
	title: string;
	date: string;
	description: string;
	thumbnail?: string;
	category: string;
	published?: boolean;
}

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const postFiles = import.meta.glob('/src/lib/posts/*.md', { eager: true });
	try {
		const posts = Object.entries(postFiles)
			.map(([path, file]): Post | null => {
				const slug = path.split('/').pop()?.replace('.md', '');

				if (file && typeof file === 'object' && 'metadata' in file && slug) {
					const metadata = file.metadata as Omit<Post, 'slug'>;
					const post: Post = {
						...metadata,
						slug,
						thumbnail: metadata.thumbnail || '/images/placeholders/default.png',
						category: metadata.category || 'uncategorized'
					};
					return post;
				}
				return null;
			})
			.filter((post): post is Post => {
				if (!post) return false;
				// Reverted: Always filter unpublished posts
				return post.published !== false;
			});

		// Sort posts by date, oldest first
        posts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

		return { posts };
	} catch (e) {
		console.error(e);
		error(500, 'Could not load posts.');
	}
}