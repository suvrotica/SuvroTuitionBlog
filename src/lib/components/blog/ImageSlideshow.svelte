<script lang="ts">
	import { fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing'; // Import an easing function

	// PROPS
	type Props = {
		images: string[];
		holdDuration?: number;
		transitionDuration?: number;
	};

	let {
		images = [],
		holdDuration = 2000, // Time each slide is fully visible (2 seconds)
		transitionDuration = 1000 // Duration of the fade in/out animation (1 second)
	}: Props = $props();

	// STATE
	let currentIndex = $state(0);

	// EFFECT for cycling through images
	$effect(() => {
		if (images.length <= 1) return;

		// The interval delay is the sum of the hold time and the transition time.
		// This ensures the image stays fully visible for the entire holdDuration.
		const interval = setInterval(() => {
			currentIndex = (currentIndex + 1) % images.length;
		}, holdDuration + transitionDuration);

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
				in:fade={{ duration: transitionDuration, easing: cubicInOut }}
				out:fade={{ duration: transitionDuration, easing: cubicInOut }}
			/>
		{/key}
	</div>
{:else}
	<div class="slideshow-container slideshow-placeholder">
		<p>No images to display.</p>
	</div>
{/if}		{#key currentIndex}
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
