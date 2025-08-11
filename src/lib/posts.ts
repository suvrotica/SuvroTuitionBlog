import { dev } from '$app/environment';
import { statSync } from 'fs';
import { glob } from 'glob';

type GlobResolver = Record<string, () => Promise<Post>>;

type PostMetadata = {
	title: string;
	description: string;
	date: string;
	published: boolean;
	category: string;
};

type Post = {
	metadata: PostMetadata;
};

export type PostSummary = PostMetadata & {
	slug: string;
	lastModified: string;
};

async function getPostSummaries() {
	const paths = import.meta.glob('/src/lib/posts/*.md', { eager: false });

	const posts = await Promise.all(
		Object.entries(paths).map(async ([path, resolver]) => {
			const { metadata } = (await resolver()) as Post;
			const slug = path.split('/').pop()?.slice(0, -3) ?? '';

			// Get last modified time
			const stats = statSync(`src/lib/posts/${slug}.md`);
			const lastModified = stats.mtime.toISOString();

			return { slug, ...metadata, lastModified };
		})
	);

	let sortedPosts = posts.sort(
		(a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf()
	);

	if (!dev) {
		sortedPosts = sortedPosts.filter((post) => post.published);
	}

	return sortedPosts;
}

export async function getPosts(page = 1, limit = -1) {
	const posts = await getPostSummaries();

	if (limit > 0) {
		const start = (page - 1) * limit;
		const end = start + limit;
		return {
			posts: posts.slice(start, end),
			total: posts.length
		};
	}

	return {
		posts,
		total: posts.length
	};
}

export async function getPostsByCategory(category: string) {
	const posts = await getPostSummaries();
	const filteredPosts = posts.filter((post) => post.category.toLowerCase() === category.toLowerCase());
	return {
		posts: filteredPosts,
		total: filteredPosts.length
	};
}