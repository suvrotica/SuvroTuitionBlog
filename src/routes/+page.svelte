<script lang="ts">
	import { toTitleCase } from '$lib/utils';
	import type { PageData } from './$types';
	// This type is actually defined in app.d.ts, but for clarity let's assume PostSummary is what we want.
	type PostSummary = App.Post;

	let { data } = $props<{ data: PageData }>();

	const posts = $derived(
		data.posts.map((post: PostSummary) => ({
			...post,
			// The title formatting is a nice touch, let's keep it.
			formattedTitle: toTitleCase(post.meta.title) 
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
					<a class="post-link" href={`/blog/${post.meta.category}/${post.slug}`}>
						{post.formattedTitle}
					</a>
				</h2>

				<p class="text-secondary">{post.meta.description}</p>
				
				<p class="text-sm text-tertiary text-right">
					Last updated: {new Date(post.meta.lastModified).toLocaleDateString('en-GB', {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
				</p>
			</li>
		{/each}
	</ul>
</div>