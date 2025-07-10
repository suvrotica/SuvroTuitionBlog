<!-- src/lib/components/blog/TextToSpeech.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';

	// Props
	let { contentSelector = '' }: { contentSelector?: string } = $props();

	// State management with Svelte 5 Runes
	let isSupported = $state(false);
	let isSpeaking = $state(false); // True if utterance is in flight (speaking or paused)
	let isPaused = $state(false); // True if user explicitly paused
	let textToRead = $state('');

	// State for rate control
	let rate = $state(1);
	const supportedRates = [0.75, 1, 1.25, 1.5, 2];
	let rateChangedDuringPause = $state(false);
	let lastBoundaryCharIndex = $state(0); // Tracks progress within the text

	// Effect to extract text content when the component mounts and is visible
	$effect(() => {
		if (typeof window !== 'undefined' && contentSelector) {
			const element = document.querySelector(contentSelector);
			if (element) {
				textToRead = (element as HTMLElement).innerText;
			}
		}
	});

	onMount(() => {
		if ('speechSynthesis' in window) {
			isSupported = true;
		}

		// Cleanup function to stop speech when navigating away
		return () => {
			if (isSupported) {
				window.speechSynthesis.cancel();
			}
		};
	});

	function speak(text: string, options: { rate: number; startFrom: number }) {
		if (!isSupported) return;

		window.speechSynthesis.cancel(); // Clear queue

		const utterance = new SpeechSynthesisUtterance(text.substring(options.startFrom));
		utterance.rate = options.rate;

		utterance.onstart = () => {
			isSpeaking = true;
			isPaused = false;
		};

		utterance.onboundary = (event) => {
			// event.charIndex is relative to the text of the *current* utterance
			lastBoundaryCharIndex = options.startFrom + event.charIndex;
		};

		utterance.onend = () => {
			isSpeaking = false;
			isPaused = false;
			lastBoundaryCharIndex = 0; // Reset progress
		};

		utterance.onerror = (event) => {
			console.error('SpeechSynthesisUtterance.onerror', event);
			isSpeaking = false;
			isPaused = false;
			lastBoundaryCharIndex = 0;
		};

		window.speechSynthesis.speak(utterance);
	}

	function handlePlayPause() {
		if (!isSupported || !textToRead) return;

		// If it's currently speaking and not paused, we want to pause it.
		if (isSpeaking && !isPaused) {
			window.speechSynthesis.pause();
			isPaused = true;
		} else {
			// If paused, and the rate hasn't changed, just resume.
			if (isPaused && !rateChangedDuringPause) {
				window.speechSynthesis.resume();
				isPaused = false;
			} else {
				// Otherwise (if idle, or if paused and rate changed), start speaking.
				speak(textToRead, { rate, startFrom: lastBoundaryCharIndex });
				rateChangedDuringPause = false; // Reset flag
			}
		}
	}

	function handleStop() {
		if (!isSupported) return;
		window.speechSynthesis.cancel();
		isSpeaking = false;
		isPaused = false;
		lastBoundaryCharIndex = 0; // Reset progress on stop
	}

	function changeRate(direction: 'up' | 'down') {
		const currentIndex = supportedRates.indexOf(rate);
		const nextIndex = currentIndex + (direction === 'up' ? 1 : -1);

		if (nextIndex >= 0 && nextIndex < supportedRates.length) {
			const newRate = supportedRates[nextIndex];
			if (rate === newRate) return;

			rate = newRate;
			if (isPaused) {
				rateChangedDuringPause = true;
			}

			// If speaking (and not paused), restart speech to apply the new rate
			if (isSpeaking && !isPaused) {
				speak(textToRead, { rate, startFrom: lastBoundaryCharIndex });
			}
		}
	}
</script>

{#if isSupported}
	<div class="interactive-component-wrapper not-prose">
		<p class="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Listen to this post:</p>
		<div class="flex items-center gap-2">
			<!-- Play/Pause Button -->
			<button
				onclick={handlePlayPause}
				disabled={!textToRead}
				aria-label={isSpeaking && !isPaused ? 'Pause' : 'Play/Resume'}
			>
				{#if isSpeaking && !isPaused}
					<!-- Pause Icon -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><rect x="6" y="4" width="4" height="16"></rect><rect
							x="14"
							y="4"
							width="4"
							height="16"
						></rect></svg
					>
				{:else}
					<!-- Play Icon -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><polygon points="5 3 19 12 5 21 5 3"></polygon></svg
					>
				{/if}
			</button>
			<!-- Stop Button -->
			<button onclick={handleStop} disabled={!isSpeaking} aria-label="Stop">
				<!-- Stop Icon -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg
				>
			</button>

			<!-- Rate Controls -->
			<div class="flex items-center gap-1 ml-4">
				<button
					onclick={() => changeRate('down')}
					disabled={rate === supportedRates[0]}
					aria-label="Decrease speed"
					class="p-1"
				>
					<!-- Rewind Icon -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><polygon points="11 19 2 12 11 5 11 19"></polygon><polygon
							points="22 19 13 12 22 5 22 19"
						></polygon></svg
					>
				</button>
				<span class="text-sm font-mono w-12 text-center text-neutral-600 dark:text-neutral-400"
					>{rate.toFixed(2)}x</span
				>
				<button
					onclick={() => changeRate('up')}
					disabled={rate === supportedRates[supportedRates.length - 1]}
					aria-label="Increase speed"
					class="p-1"
				>
					<!-- Fast Forward Icon -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><polygon points="13 19 22 12 13 5 13 19"></polygon><polygon
							points="2 19 11 12 2 5 2 19"
						></polygon></svg
					>
				</button>
			</div>
		</div>
	</div>
{:else}
	<div class="interactive-component-wrapper not-prose">
		<p class="text-sm text-red-600 dark:text-red-400">
			Text-to-speech is not supported by your browser.
		</p>
	</div>
{/if}

<style>
	/* Add some specific styles for the rate control buttons to make them smaller */
	.p-1 {
		padding: 0.25rem;
	}
</style>
