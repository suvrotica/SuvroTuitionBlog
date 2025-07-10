import type { LayoutServerLoad } from './$types';

// Define clear "shapes" for our data
interface Post {
    slug: string;
    title: string;
    topic: string;
}

export interface Topic {
    topic: string;
    articles: Omit<Post, 'topic'>[];
}

export const load: LayoutServerLoad = async () => {
    const postFiles = import.meta.glob('/src/lib/posts/*.md', { eager: true });

    const posts = Object.entries(postFiles)
        .map(([path, file]): Post | null => {
            const slug = path.split('/').pop()?.replace('.md', '');
            if (file && typeof file === 'object' && 'metadata' in file && slug) {
                const metadata = file.metadata as Omit<Post, 'slug'>;
                return { ...metadata, slug };
            }
            return null;
        })
        .filter((post): post is Post => post !== null);

    // Group posts by topic
    const topics = posts.reduce<Topic[]>((acc, post) => {
        let topic = acc.find(t => t.topic === post.topic);
        if (!topic) {
            topic = { topic: post.topic, articles: [] };
            acc.push(topic);
        }
        topic.articles.push({ slug: post.slug, title: post.title });
        return acc;
    }, []);

    return { topics };
};