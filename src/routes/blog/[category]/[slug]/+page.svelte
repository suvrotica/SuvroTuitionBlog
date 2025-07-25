<script lang="ts">
	import SEO from '$lib/components/seo/SEO.svelte';
	let { data }: { data: import('./$types').PageData } = $props();

	let Content = $derived(data.content);
</script>

<SEO {...data.seo} schema={data.schema} />

{#if Content}
	<Content />
{/if}
