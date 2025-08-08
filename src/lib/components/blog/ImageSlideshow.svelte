<script lang="ts">
	import { fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';

	// FIX: The component now expects a simple array of URL strings.
	type Props = {
		images: string[];
		holdDuration?: number;
		transitionDuration?: number;
	};

	let {
		images = [],
		holdDuration = 4000,
		transitionDuration = 1000
	}: Props = $props();

	let currentIndex = $state(0);
	
	// FIX: currentImage is now just a URL string.
	let currentImage = $derived(images[currentIndex]);
	
	// REMOVED: The dynamic aspect-ratio logic is removed.
	
	$effect(() => {
		if (images.length <= 1) return;

		const interval = setInterval(() => {
			currentIndex = (currentIndex + 1) % images.length;
		}, holdDuration + transitionDuration);

		return () => clearInterval(interval);
	});
</script>

{#if currentImage}
	<div class="slideshow-container">
		{#key currentIndex}
			<img
				src={currentImage}
				alt="Slideshow image {currentIndex + 1}"
				class="slideshow-image"
				in:fade={{ duration: transitionDuration, easing: cubicInOut }}
				out:fade={{ duration: transitionDuration, easing: cubicInOut }}
			/>
		{/key}
	</div>
{:else}
	<div class="slideshow-container slideshow-placeholder">
		<p>No images to display.</p>
	</div>
{/if}
