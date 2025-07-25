// src/routes/+layout.server.ts

import type { ServerLoad } from '@sveltejs/kit';
import { siteSEO, websiteSchema } from '$lib/components/seo/SEO'; 

// Types from the previous setup
export type Article = {
	title: string;
	slug: string;
	category: string;
	published?: boolean;
};
export type Category = {
	name: string;
	articles: Article[];
};

export const load: ServerLoad = async () => {
	const modules = import.meta.glob('/src/lib/posts/*.md', { eager: true });
	const posts: Article[] = [];
	for (const path in modules) {
		const file = modules[path];
		const slug = path.split('/').pop()?.slice(0, -3);
		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Article, 'slug'>;
			if (metadata && metadata.title) {
				if (metadata.published === false) {
					continue;
				}
				posts.push({
					...metadata,
					slug,
					category: metadata.category || 'uncategorized'
				});
			}
		}
	}

	const categoriesMap: Map<string, Article[]> = new Map();
	posts.forEach((post) => {
		const category = post.category;
		if (!categoriesMap.has(category)) {
			categoriesMap.set(category, []);
		}
		categoriesMap.get(category)?.push(post);
	});
	
    const categories: Category[] = Array.from(categoriesMap.entries()).map(([name, articles]) => ({
		name,
		articles: articles.sort((a, b) => a.title.localeCompare(b.title))
	}));

	categories.sort((a, b) => a.name.localeCompare(b.name));

	return {
		categories,
		seo: siteSEO,       // <-- ADD site SEO to the return object
		schema: websiteSchema // <-- ADD site schema to the return object
	};
};