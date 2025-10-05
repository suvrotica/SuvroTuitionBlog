<script lang="ts">
	import { fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';

	type Props = {
		images: string[];
		holdDuration?: number;
		transitionDuration?: number;
	};

	let {
		images = [],
		holdDuration = 9000,
		transitionDuration = 1000 // Increased for a smoother fade
	}: Props = $props();

	/**
	 * Shuffles an array in place using the Fisher-Yates algorithm.
	 * @param array The array to shuffle.
	 * @returns The shuffled array.
	 */
	function shuffle(array: string[]): string[] {
		let newArray = [...array];
		for (let i = newArray.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[newArray[i], newArray[j]] = [newArray[j], newArray[i]];
		}
		return newArray;
	}

	// State for the shuffled image list and the current index
	let shuffledImages = $state<string[]>([]);
	let currentIndex = $state(0);

	// Derived state for the currently visible image
	let currentImage = $derived(shuffledImages[currentIndex]);

	// Effect to create the initial shuffled list whenever the `images` prop changes.
	$effect(() => {
		if (images.length > 0) {
			shuffledImages = shuffle(images);
			currentIndex = 0; // Reset index on new image set
		} else {
			shuffledImages = [];
		}
	});

	// Effect to manage the slideshow interval
	$effect(() => {
		if (shuffledImages.length <= 1) return;

		const interval = setInterval(() => {
			const lastImage = currentImage;

			// If we're at the end of the shuffled list, create a new one.
			if (currentIndex === shuffledImages.length - 1) {
				let newShuffledList = shuffle(images);

				// Crucially, ensure the new list doesn't start with the same image we just showed.
				while (images.length > 1 && newShuffledList[0] === lastImage) {
					newShuffledList = shuffle(images);
				}

				shuffledImages = newShuffledList;
				currentIndex = 0;
			} else {
				// Otherwise, just move to the next image in the shuffled list.
				currentIndex += 1;
			}
		}, holdDuration + transitionDuration);

		return () => clearInterval(interval);
	});
</script>

{#if currentImage}
	<div class="slideshow-container">
		{#key currentImage}
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
