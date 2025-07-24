<script lang="ts">
	import PostGallery from '$lib/components/blog/PostGallery.svelte';
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.category} - SuvroGhosh.Blog</title>
	<meta name="description" content="Articles in the {data.category} category." />
</svelte:head>

<section>
	<h1 class="capitalize">Category: {data.category}</h1>
	<PostGallery posts={data.posts} />
</section>