<script lang="ts">
	let {
		src,
		alt,
		caption = ''
	}: {
		src: string;
		alt: string;
		caption?: string;
	} = $props();
</script>

<figure class="post-image">
	<img {src} {alt} loading="lazy" decoding="async" />
	{#if caption}
		<figcaption>{caption}</figcaption>
	{/if}
</figure>

<style>
	/* Scoped styles from your app.css will apply if configured */
	.post-image {
    margin: 2rem 0 0.5rem;
    text-align: center;
}
	img {
		max-width: 100%;
		height: auto;
		border-radius: 0.5rem;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
	}
	figcaption {
		margin-top: 0.75rem;
		font-size: 0.9rem;
		color: var(--color-text-secondary); /* Example CSS variable */
		font-style: italic;
	}
</style>