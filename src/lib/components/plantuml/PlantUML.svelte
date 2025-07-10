<script lang="ts">
	import { encodePlantUML } from './plantuml';

	// Props using Svelte 5 syntax
	let {
		source,
		alt = 'PlantUML Diagram'
	}: {
		source: string;
		alt?: string;
	} = $props();

	// Reactive state for the image URL
	let imageUrl = $state('');

	// Effect to update the image URL whenever the source prop changes
	$effect(() => {
		if (source) {
			const encoded = encodePlantUML(source);
			// FIX: Prepend '~1' to the encoded data to conform to the updated PlantUML server API for DEFLATE compression.
			imageUrl = `https://www.plantuml.com/plantuml/svg/~1${encoded}`;
		}
	});
</script>

<div
	class="plantuml-container my-6 flex items-center justify-center rounded-lg border border-neutral-300 bg-neutral-100 p-4 dark:border-neutral-700 dark:bg-neutral-800/50"
>
	{#if imageUrl}
		<img src={imageUrl} {alt} class="h-auto max-w-full" />
	{:else}
		<p class="text-neutral-500 dark:text-neutral-400">Generating diagram...</p>
	{/if}
</div>