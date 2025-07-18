// src/routes/+layout.server.ts
import fs from 'fs/promises';
import path from 'path';
import { error } from '@sveltejs/kit';

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

/**
 * A simple regex-based frontmatter parser.
 * This is a workaround for a bug in how `import.meta.glob`
 * interacts with mdsvex's preprocessor.
 */
function parseFrontmatter(content: string): Omit<Post, 'slug'> {
	const match = content.match(/^---\s*([\s\S]*?)\s*---/);
	if (!match) {
		return { title: 'Untitled', topic: 'Uncategorized' };
	}

	const frontmatter = match[1];
	const metadata: { [key: string]: string } = {};
	frontmatter.split('\n').forEach((line) => {
		const parts = line.split(':');
		if (parts.length > 1) {
			const key = parts[0].trim();
			const value = parts.slice(1).join(':').trim().replace(/['"]/g, '');
			metadata[key] = value;
		}
	});

	return {
		title: metadata.title || 'Untitled',
		topic: metadata.topic || 'Uncategorized'
	};
}

export const load = async () => {
	try {
		const postsDir = path.resolve(process.cwd(), 'src/lib/posts');
		const postFiles = await fs.readdir(postsDir);

		const posts: Post[] = await Promise.all(
			postFiles
				.filter((file) => file.endsWith('.md'))
				.map(async (file) => {
					const slug = file.replace('.md', '');
					const content = await fs.readFile(path.join(postsDir, file), 'utf-8');
					const metadata = parseFrontmatter(content);
					return { ...metadata, slug };
				})
		);

		// Group posts by topic
		const topics = posts.reduce<Topic[]>((acc, post) => {
			let topic = acc.find((t) => t.topic === post.topic);
			if (!topic) {
				topic = { topic: post.topic, articles: [] };
				acc.push(topic);
			}
			topic.articles.push({ slug: post.slug, title: post.title });
			// Sort articles within the topic alphabetically by title
			topic.articles.sort((a, b) => a.title.localeCompare(b.title));
			return acc;
		}, []);

		// Sort topics alphabetically
		topics.sort((a, b) => a.topic.localeCompare(b.topic));

		return { topics };
	} catch (e) {
		console.error(e);
		error(500, 'Could not load posts for layout.');
	}
};