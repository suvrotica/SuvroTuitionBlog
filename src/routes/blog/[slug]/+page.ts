// File: src/routes/blog/[slug]/+page.ts
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

type Heading = {
	level: number;
	id: string;
	text: string;
};

// Helper function to generate GitHub-compatible slugs for headings
function slugify(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[\s_]+/g, '-') // Replace spaces and underscores with -
		.replace(/[^\w-]+/g, '') // Remove all non-word chars except -
		.replace(/--+/g, '-') // Replace multiple - with single -
		.replace(/^-+/, '') // Trim - from start of text
		.replace(/-+$/, ''); // Trim - from end of text
}

export const load: PageLoad = async ({ params }) => {
	try {
		// Use Vite's features to dynamically import the component and the raw markdown
		const postPromise = import(`../../../lib/posts/${params.slug}.md`);
		const postsRaw = import.meta.glob('/src/lib/posts/*.md', { query: '?raw', eager: true, import: 'default' });
		const postPath = `/src/lib/posts/${params.slug}.md`;
		const rawContent = postsRaw[postPath];

		// FIX: Add an explicit type check to ensure rawContent is a string.
		// This acts as a type guard and satisfies TypeScript.
		if (typeof rawContent !== 'string') {
			error(404, { message: `Could not find markdown content for: ${params.slug}` });
		}

		const headings: Heading[] = [];
		// Regex to find h2 and h3 markdown headings
		const headingRegex = /^(##|###)\s+(.*)/gm;
		let match;

		while ((match = headingRegex.exec(rawContent)) !== null) {
			const text = match[2].trim();
			headings.push({
				level: match[1].length,
				id: slugify(text),
				text: text
			});
		}

		// Await the component import
		const post = await postPromise;

		return {
			...post.metadata,
			slug: params.slug,
			content: post.default,
			// Add the extracted headings to the page data
			headings
		};
	} catch (e) {
		console.error(e);
		error(404, { message: `Could not find post: ${params.slug}` });
	}
};
