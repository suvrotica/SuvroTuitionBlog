// src/routes/blog/[category]/[slug]/+page.server.ts

import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Component } from 'svelte';

type PostMetadata = {
	title: string;
	description: string;
	date?: string;
	thumbnail?: string;
	published?: boolean;
	keywords?: string[];
	[key: string]: unknown;
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

export const load: PageServerLoad = async ({ params, url }) => {
	try {
		const postPath = `/src/lib/posts/${params.slug}.md`;

		const postModules = import.meta.glob('/src/lib/posts/*.md', { import: 'metadata' });
		const metadataLoader = postModules[postPath];
		if (!metadataLoader) {
			error(404, { message: `Could not find metadata for post: ${params.slug}` });
		}
		const post = (await metadataLoader()) as PostMetadata;

		if (post.published === false) {
			error(404, { message: 'This post is not available' });
		}

		const postsRaw = import.meta.glob('/src/lib/posts/*.md', {
			query: '?raw',
			import: 'default'
		});

		const rawContentLoader = postsRaw[postPath];
		// --- FIX: Explicitly cast the dynamically imported raw content to a string ---
		const rawContent = (await rawContentLoader()) as string;

		const headings: Heading[] = [];
		const headingRegex = /^(##|###)\s+(.*)/gm;
		let match;
		while ((match = headingRegex.exec(rawContent)) !== null) {
			const text = match[2].trim();
			headings.push({ level: match[1].length, id: slugify(text), text: text });
		}

		const canonicalUrl = `${url.origin}/blog/${params.category}/${params.slug}`;

		const seo = {
			title: `${post.title} | SuvroGhosh.Blog`,
			description: post.description,
			canonicalUrl: canonicalUrl,
			ogImageUrl: post.thumbnail
				? `${url.origin}${post.thumbnail}`
				: `${url.origin}/images/placeholders/default.png`,
			ogImageAlt: post.title,
			keywords: post.keywords
		};

		const datePublished = post.date ? new Date(post.date).toISOString() : new Date().toISOString();
		const dateModified = post.date ? new Date(post.date).toISOString() : new Date().toISOString();

		const schema = {
			'@context': 'https://schema.org',
			'@type': 'Article',
			headline: post.title,
			image: seo.ogImageUrl,
			datePublished,
			dateModified,
			author: {
				'@type': 'Person',
				name: 'Suvro Ghosh',
				url: `${url.origin}/about`
			},
			publisher: {
				'@type': 'Organization',
				name: 'SuvroGhosh.Blog',
				logo: {
					'@type': 'ImageObject',
					url: `${url.origin}/favicon.png`
				}
			},
			description: post.description,
			mainEntityOfPage: {
				'@type': 'WebPage',
				'@id': canonicalUrl
			}
		};

		return {
			metadata: post,
			headings,
			seo,
			schema
		};
	} catch (e) {
		console.error(e);
		error(404, { message: `Could not find post: ${params.slug}` });
	}
};