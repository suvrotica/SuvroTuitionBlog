<script lang="ts">
	type Post = {
		slug: string;
		title: string;
		thumbnail?: string;
		category: string; // <-- ADD CATEGORY
	};
	let { posts = [] }: { posts: Post[] } = $props();
</script>

<div class="post-gallery-grid">
	{#each posts as post (post.slug)}
		{@const href = `/blog/${post.category}/${post.slug}`}
		<a {href} class="gallery-pin group"> <div class="image-wrapper">
				<img src={post.thumbnail} alt={post.title} class="gallery-image" />
			</div>
			<h3 class="gallery-title">{post.title}</h3>
		</a>
	{/each}
</div>