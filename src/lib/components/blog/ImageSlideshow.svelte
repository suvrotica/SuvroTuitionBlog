<script lang="ts">
	import { fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';

	// PROPS: Now expects image objects with dimensions
	type Image = {
		src: string;
		width: number;
		height: number;
	};
	type Props = {
		images: Image[];
		holdDuration?: number;
		transitionDuration?: number;
	};

	let {
		images = [],
		holdDuration = 2000,
		transitionDuration = 1000
	}: Props = $props();

	// STATE
	let currentIndex = $state(0);
	
	// DERIVED STATE: Automatically calculate aspect ratio for the current image
	let currentImage = $derived(images[currentIndex]);
	let aspectRatio = $derived(currentImage ? currentImage.width / currentImage.height : 16 / 9);

	// EFFECT for cycling through images
	$effect(() => {
		if (images.length <= 1) return;

		const interval = setInterval(() => {
			currentIndex = (currentIndex + 1) % images.length;
		}, holdDuration + transitionDuration);

		return () => clearInterval(interval);
	});
</script>

{#if currentImage}
	<div class="slideshow-container" style:aspect-ratio={aspectRatio}>
		{#key currentIndex}
			<img
				src={currentImage.src}
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
