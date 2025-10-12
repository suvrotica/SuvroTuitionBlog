import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// Define the shape of your post metadata
interface Post {
    slug: string;
    title: string;
    date: string;
    description: string;
    thumbnail?: string;
    category: string;
    published?: boolean;
}

export const load: PageServerLoad = async () => {
    const postFiles = import.meta.glob('/src/lib/posts/*.md', { eager: true });
    try {
        const posts = Object.entries(postFiles)
            .map(([path, file]): Post | null => {
                const slug = path.split('/').pop()?.replace('.md', '');

                if (file && typeof file === 'object' && 'metadata' in file && slug) {
                    const metadata = file.metadata as Omit<Post, 'slug'>;
                    // Only include published posts
                    if (metadata.published === false) {
                        return null;
                    }
                    return {
                        ...metadata,
                        slug,
                        thumbnail: metadata.thumbnail || '/images/placeholders/default.png',
                        category: metadata.category || 'uncategorized'
                    };
                }
                return null;
            })
            .filter((post): post is Post => post !== null);

        // Sort posts by date, oldest first
        posts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return { posts };
    } catch (e) {
        console.error(e);
        error(500, 'Could not load posts.');
    }
};