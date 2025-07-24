// src/routes/blog/[category]/[slug]/+page.ts
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { SvelteComponent } from 'svelte';

type PostModule = {
	default: SvelteComponent;
	metadata: {
		published?: boolean;
		[key: string]: unknown;
	};
};

type Heading = { level: number; id: string; text: string };

function slugify(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[\s_]+/g, '-')
		.replace(/[^\w-]+/g, '')
		.replace(/--+/g, '-')
		.replace(/^-+/, '')
		.replace(/-+$/, '');
}

export const load: PageLoad = async ({ params }) => {
	try {
		const postModules = import.meta.glob('/src/lib/posts/*.md');
		const postPath = `/src/lib/posts/${params.slug}.md`;
		const postModuleLoader = postModules[postPath];

		if (!postModuleLoader) {
			error(404, { message: `Post module not found for slug: ${params.slug}` });
		}

		const postPromise = postModuleLoader();

		const postsRaw = import.meta.glob('/src/lib/posts/*.md', {
			query: '?raw',
			eager: true,
			import: 'default'
		});
		const rawContent = postsRaw[postPath];

		if (typeof rawContent !== 'string') {
			error(404, { message: `Could not find markdown content for: ${params.slug}` });
		}

		const headings: Heading[] = [];
		const headingRegex = /^(##|###)\s+(.*)/gm;
		let match;
		while ((match = headingRegex.exec(rawContent)) !== null) {
			const text = match[2].trim();
			headings.push({ level: match[1].length, id: slugify(text), text: text });
		}

		const post = (await postPromise) as PostModule;

		// Reverted: Always prevent access to unpublished posts
		if (post.metadata.published === false) {
			error(404, { message: 'This post is not available' });
		}

		return {
			...post.metadata,
			slug: params.slug,
			content: post.default,
			headings
		};
	} catch (e) {
		console.error(e);
		error(404, { message: `Could not find post: ${params.slug}` });
	}
};