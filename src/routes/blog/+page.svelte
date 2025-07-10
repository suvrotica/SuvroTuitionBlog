<script lang="ts">
	import PostGallery from '$lib/components/blog/PostGallery.svelte';
	let { data } = $props();
</script>

<svelte:head>
	<title>Blog - SuvroGhosh.Blog</title>
	<meta name="description" content="A collection of articles on web engineering." />
</svelte:head>

<section>
	<h1>All Posts</h1>
	<PostGallery posts={data.posts} />
</section>