<script lang="ts">
	import { toTitleCase } from '$lib/utils';
	import type { PageData } from './$types';
	// 1. Import the type for a single post
	import type { PostSummary } from '$lib/posts';

	let { data } = $props<{ data: PageData }>();

	const posts = $derived(
		// 2. Add the PostSummary type to the 'post' parameter
		data.posts.map((post: PostSummary) => ({
			...post,
			formattedTitle: toTitleCase(post.title)
		}))
	);
</script>

<svelte:head>
	<title>Suvro Ghosh | Engineering & Personal Blog</title>
	<meta name="description" content="The personal and engineering blog of Suvro Ghosh." />
</svelte:head>

<div class="container my-8 ">
	<h1 class="text-center">Latest Posts</h1>

	<ul class="list-none p-0 ">
		{#each posts as post (post.slug)}
			<li class="card mb-6">
				<h2>
					<a class="post-link" href={`/blog/${post.category}/${post.slug}`}>
						{post.formattedTitle}
					</a>
				</h2>

				<p class="text-secondary">{post.description}</p>
				
				<p class="text-sm text-tertiary text-right">
					Last updated: {new Date(post.lastModified).toLocaleDateString('en-GB', {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
				</p>
			</li>
		{/each}
	</ul>
</div>