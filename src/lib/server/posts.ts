import { dev } from '$app/environment';
import grayMatter from 'gray-matter';
import { execSync } from 'child_process';
import { calculateReadingTime } from '$lib/utils/readingTime';

// Find all markdown posts using Vite's glob import
const modules = import.meta.glob('/src/lib/posts/**/*.md', { query: '?raw', import: 'default', eager: true });

/**
 * Gets the last Git commit date for a given file and returns it as an ISO string.
 * This is our new automatic way to get the 'lastModified' date.
 * @param {string} filepath - The file path provided by import.meta.glob.
 */
function getGitLastModified(filepath: string) {
	try {
		// The filepath from glob is like '/src/lib/posts/file.md'. We need to remove the leading '/'.
		const command = `git log -1 --pretty="format:%cI" -- "${filepath.substring(1)}"`;
		const date = execSync(command).toString().trim();
		// Return the date or a new date if the file is not yet in git
		return date || new Date().toISOString();
	} catch (error) {
		// Fallback for any other errors
		console.error(`Failed to get last modified date for ${filepath}:`, error);
		return new Date().toISOString();
	}
}

export async function getPosts() {
	const posts = Object.entries(modules).map(([filepath, rawContent]) => {
		const { data: meta, content } = grayMatter(rawContent as string);
		const slug = filepath.split('/').pop()?.slice(0, -3);

		return {
			slug,
			meta: {
				...meta,
				// Automatically add the last modified date from Git!
				lastModified: getGitLastModified(filepath),
				readingTime: calculateReadingTime(content)
			},
			content
		} as App.Post;
	});

	// Filter out unpublished posts in production
	const publishedPosts = dev ? posts : posts.filter((post) => post.meta.published);

	// Sort posts by original date, most recent first
	const sortedPosts = publishedPosts.sort(
		(a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
	);

	return {
		posts: sortedPosts,
		total: sortedPosts.length
	};
}