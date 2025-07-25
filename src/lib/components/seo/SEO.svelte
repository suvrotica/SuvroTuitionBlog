<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	type Props = {
		title: string;
		description: string;
		canonicalUrl?: string;
		ogImageUrl?: string;
		ogImageAlt?: string;
		schema?: Record<string, any> | Array<Record<string, any>>;
	};

	let {
		title,
		description,
		canonicalUrl,
		ogImageUrl,
		ogImageAlt,
		schema = undefined
	}: Props = $props();
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />

	{#if canonicalUrl}
		<link rel="canonical" href={canonicalUrl} />
	{/if}

	<meta property="og:type" content="website" />
	{#if canonicalUrl}
		<meta property="og:url" content={canonicalUrl} />
	{/if}
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	{#if ogImageUrl}
		<meta property="og:image" content={ogImageUrl} />
	{/if}
	{#if ogImageAlt}
		<meta property="og:image:alt" content={ogImageAlt} />
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	{#if canonicalUrl}
		<meta property="twitter:url" content={canonicalUrl} />
	{/if}
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{#if ogImageUrl}
		<meta name="twitter:image" content={ogImageUrl} />
	{/if}

	{#if schema}
		{@html `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`}
	{/if}
</svelte:head>