<script lang="ts">
	let { data } = $props();

	// FIX: Use the $derived rune to make `Content` reactive.
	// This ensures that when `data.content` changes on navigation,
	// the `Content` variable is updated with the new component.
	let Content = $derived(data.content);
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content={data.description} />
</svelte:head>

{#if Content}
	<Content />
{/if}