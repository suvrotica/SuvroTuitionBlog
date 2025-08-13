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

    import ImageSlideshow from '$lib/components/blog/ImageSlideshow.svelte';

    const imageModulesSquare: Record<string, string> = import.meta.glob(
        '$lib/assets/slideshow-images/square/*.{jpg,jpeg,png,webp}',
        {
            eager: true,
            query: '?url',
            import: 'default'
        }
    );
    
    const imageModulesLandscape: Record<string, string> = import.meta.glob(
        '$lib/assets/slideshow-images/landscape/*.{jpg,jpeg,png,webp}',
        {
            eager: true,
            query: '?url',
            import: 'default'
        }
    );

    const imageModulesPortrait: Record<string, string> = import.meta.glob(
        '$lib/assets/slideshow-images/portrait/*.{jpg,jpeg,png,webp}',
        {
            eager: true,
            query: '?url',
            import: 'default'
        }
    );

    // Extract the URLs into simple arrays to pass to the component
    const imageUrlsLandscape = Object.values(imageModulesLandscape);
    const imageUrlsPortrait = Object.values(imageModulesPortrait);
    const imageUrlsSquare = Object.values(imageModulesSquare);
</script>

<div class="my-8">
    <ImageSlideshow images={imageUrlsPortrait} />
</div>

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
