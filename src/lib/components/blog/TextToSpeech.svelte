<script lang="ts">
	import { onMount, tick } from 'svelte';

	// PROPS
	let { contentSelector = '' }: { contentSelector?: string } = $props();

	// STATE
	let isSupported = $state(false);
	let textToRead = $state('');
	// Let Svelte's reactivity handle re-renders when the synthesis state changes.
	let forceUpdate = $state(0);

	// DERIVED STATE from the browser's own speech synthesis API
	let isSpeaking = $derived(window.speechSynthesis?.speaking ?? false);
	let isPaused = $derived(window.speechSynthesis?.paused ?? false);

	// RATE CONTROL
	let rate = $state(1);
	const supportedRates = [0.75, 1, 1.25, 1.5, 2];

	// --- Core Speech Functions ---
	function speak() {
		if (!isSupported || !textToRead) return;

		// If it's paused, just resume.
		if (isPaused) {
			window.speechSynthesis.resume();
			return;
		}

		// If it's already speaking, cancel previous to start fresh with new settings.
		if (isSpeaking) {
			window.speechSynthesis.cancel();
		}

		const utterance = new SpeechSynthesisUtterance(textToRead);
		utterance.rate = rate;

		// Add event listeners to react to state changes.
		utterance.onend = () => {
			forceUpdate++; // Trigger reactivity
		};
		utterance.onpause = () => {
			forceUpdate++;
		};
		utterance.onresume = () => {
			forceUpdate++;
		};
		utterance.onerror = (event) => {
			console.error('An error occurred during speech synthesis:', event);
			forceUpdate++;
		};

		window.speechSynthesis.speak(utterance);
	}

	// --- Control Handlers ---
	function handlePlayPause() {
		forceUpdate++;
		if (isSpeaking) {
			if (isPaused) {
				window.speechSynthesis.resume();
			} else {
				window.speechSynthesis.pause();
			}
		} else {
			speak();
		}
	}

	function handleStop() {
		window.speechSynthesis.cancel();
		forceUpdate++;
	}

	async function changeRate(newRate: number) {
		rate = newRate;
		// If speaking, we need to restart to apply the new rate.
		if (isSpeaking) {
			// Cancel and then speak again in the next tick to ensure state is updated.
			window.speechSynthesis.cancel();
			await tick();
			speak();
		}
	}

	// Setup and teardown
	onMount(() => {
		// Use a reactive effect to extract text content when the selector is available.
		$effect(() => {
			if (contentSelector && typeof window !== 'undefined') {
				const element = document.querySelector(contentSelector);
				if (element) {
					textToRead = (element as HTMLElement).innerText;
				}
			}
		});

		if ('speechSynthesis' in window) {
			isSupported = true;
			// Ensure any speech from a previous page is stopped on mount.
			if (window.speechSynthesis.speaking) {
				window.speechSynthesis.cancel();
			}
		}

		// Cleanup function to run when the component is destroyed.
		return () => {
			if (isSupported && window.speechSynthesis.speaking) {
				window.speechSynthesis.cancel();
			}
		};
	});
</script>

{#if isSupported}
	<div class="interactive-component-wrapper not-prose" data-testid="tts-container">
		{forceUpdate}

		<p class="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Listen to this post:</p>
		<div class="flex items-center gap-2">
			<button onclick={handlePlayPause} disabled={!textToRead} aria-label={isSpeaking && !isPaused ? 'Pause' : 'Play'}>
				{#if isSpeaking && !isPaused}
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
				{/if}
			</button>

			<button onclick={handleStop} disabled={!isSpeaking} aria-label="Stop">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
			</button>

			<div class="flex items-center gap-1 ml-4">
				<button
					onclick={() => changeRate(supportedRates[supportedRates.indexOf(rate) - 1])}
					disabled={rate === supportedRates[0]}
					aria-label="Decrease speed"
					class="p-1"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 19 2 12 11 5 11 19"></polygon><polygon points="22 19 13 12 22 5 22 19"></polygon></svg>
				</button>
				<span class="text-sm font-mono w-12 text-center text-neutral-600 dark:text-neutral-400">{rate.toFixed(2)}x</span>
				<button
					onclick={() => changeRate(supportedRates[supportedRates.indexOf(rate) + 1])}
					disabled={rate === supportedRates[supportedRates.length - 1]}
					aria-label="Increase speed"
					class="p-1"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 19 22 12 13 5 13 19"></polygon><polygon points="2 19 11 12 2 5 2 19"></polygon></svg>
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
	.p-1 {
		padding: 0.25rem;
	}
</style>