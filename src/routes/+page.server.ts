// src/routes/+page.server.ts

import { POSTS_PER_PAGE } from '$lib/config';
// 1. Fixed the import path for getPosts
import { getPosts } from '$lib/server/posts'; 
import { error } from '@sveltejs/kit';
import { statSync } from 'fs';
import path from 'path';

export const load = async ({ url }) => {
    try {
        const page = parseInt(url.searchParams.get('page') || '1');
        const { posts, total } = await getPosts(page, POSTS_PER_PAGE);

        const featuredPostSlug = 'AmABengaliMan';
        // The dynamic import path needs the subdirectory as well
        const featuredPostModule = await import(`../lib/posts/life/${featuredPostSlug}.md`);
        const featuredPostMetadata = featuredPostModule.metadata;

        // 2. Corrected the path to include the 'life' subdirectory
        const postPath = path.resolve('src/lib/posts/life', `${featuredPostSlug}.md`);
        
        const stats = statSync(postPath);
        const lastModified = stats.mtime.toISOString();

        const featuredPost = {
            slug: featuredPostSlug,
            ...featuredPostMetadata,
            lastModified,
            // Manually add the category since it's in a subdirectory
            category: 'life',
        };

        return {
            posts,
            total,
            page,
            postsPerPage: POSTS_PER_PAGE,
            featuredPost
        };
    } catch (e) {
        console.error("Failed to load page:", e);
        error(500, 'Could not load the featured post. Please check the server logs.');
    }
};