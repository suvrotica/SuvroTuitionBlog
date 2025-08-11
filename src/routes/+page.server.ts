import { POSTS_PER_PAGE } from '$lib/config';
import { getPosts } from '$lib/server/posts';
import { error } from '@sveltejs/kit';

export const load = async ({ url }) => {
	try {
		const page = parseInt(url.searchParams.get('page') || '1');
		const featuredPostSlug = 'AmABengaliMan';

		// 1. Get the posts array by destructuring the result from getPosts()
		const { posts: allPosts } = await getPosts();

		// 2. Find the featured post from the list. This will now work correctly.
		const featuredPost = allPosts.find((p) => p.slug === featuredPostSlug);

		// 3. Create a paginated list that doesn't include the featured post.
		const postsForList = allPosts.filter((p) => p.slug !== featuredPostSlug);
		const total = postsForList.length;
		const posts = postsForList.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

		return {
			posts,
			total,
			page,
			postsPerPage: POSTS_PER_PAGE,
			featuredPost
		};
	} catch (e) {
		console.error('Failed to load page:', e);
		error(500, 'Could not load posts. Please check the server logs.');
	}
};