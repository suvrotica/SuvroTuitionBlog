<script lang="ts">
	import { fade } from 'svelte/transition';

	// PROPS
	type Props = {
		images: string[];
		slideDuration?: number;
		transitionDuration?: number;
	};

	let {
		images = [],
		slideDuration = 4000, // Time each slide is visible in ms
		transitionDuration = 1000 // Duration of the fade effect in ms
	}: Props = $props();

	// STATE
	let currentIndex = $state(0);

	// EFFECT for cycling through images
	$effect(() => {
		if (images.length <= 1) return;

		const interval = setInterval(() => {
			currentIndex = (currentIndex + 1) % images.length;
		}, slideDuration);

		// Cleanup function to clear the interval when the component is unmounted
		return () => {
			clearInterval(interval);
		};
	});
</script>

{#if images.length > 0}
	<div class="slideshow-container">
		{#key currentIndex}
			<img
				src={images[currentIndex]}
				alt="Slideshow image {currentIndex + 1}"
				class="slideshow-image"
				in:fade={{ duration: transitionDuration }}
				out:fade={{ duration: transitionDuration }}
			/>
		{/key}
	</div>
{:else}
	<div class="slideshow-container slideshow-placeholder">
		<p>No images to display.</p>
	</div>
{/if}
