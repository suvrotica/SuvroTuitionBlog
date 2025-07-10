<script lang="ts">
	type Post = {
		slug: string;
		title: string;
		thumbnail?: string;
	};

	let { posts = [] }: { posts: Post[] } = $props();
</script>

<div class="post-gallery-grid">
	{#each posts as post (post.slug)}
		{@const href = `/blog/${post.slug}`}
		<a {href} class="gallery-pin">
			<div class="image-wrapper">
				<img src={post.thumbnail} alt={post.title} class="gallery-image" />
			</div>
			<h3 class="gallery-title">{post.title}</h3>
		</a>
	{/each}
</div>