import { error } from '@sveltejs/kit';

interface Post {
	slug: string;
	title: string;
	date: string;
	description: string;
	thumbnail?: string; // Add the optional thumbnail property
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
					// Provide a default thumbnail if one isn't specified
					const post: Post = {
						...metadata,
						slug,
						thumbnail: metadata.thumbnail || '/images/placeholders/default.png'
					};
					return post;
				}
				return null;
			})
			.filter((post): post is Post => post !== null);

		posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

		return { posts };
	} catch (e) {
		console.error(e);
		error(500, 'Could not load posts.');
	}
}