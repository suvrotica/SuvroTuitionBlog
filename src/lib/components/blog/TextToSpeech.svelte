<script lang="ts">
	import { onMount } from 'svelte';

	// PROPS
	let { contentSelector = '' }: { contentSelector?: string } = $props();

	// CORE STATE
	let isSupported = $state(false);
	let isSpeaking = $state(false); // True if speech is in-flight (speaking or paused)
	let isPaused = $state(false); // True only if user explicitly paused
	let textToRead = $state('');

	// RATE CONTROL
	let rate = $state(1);
	const supportedRates = [0.75, 1, 1.25, 1.5, 2];

	// WAKE LOCK - for mobile reliability
	let wakeLock = $state<WakeLockSentinel | null>(null);

	// Extract text content from the DOM
	$effect(() => {
		if (typeof window !== 'undefined' && contentSelector) {
			const element = document.querySelector(contentSelector);
			if (element) {
				textToRead = (element as HTMLElement).innerText;
			}
		}
	});

	// --- Wake Lock Management ---
	async function acquireWakeLock() {
		if ('wakeLock' in navigator && !wakeLock) {
			try {
				wakeLock = await navigator.wakeLock.request('screen');
				// Listen for release events, e.g., if the user manually locks the screen
				wakeLock.addEventListener('release', () => {
					wakeLock = null;
				});
			} catch (err) {
				// FIX: Check if err is an instance of Error before accessing properties
				if (err instanceof Error) {
					console.error(`Wake Lock request failed: ${err.name}, ${err.message}`);
				} else {
					console.error('An unknown error occurred during wake lock request.');
				}
			}
		}
	}

	async function releaseWakeLock() {
		if (wakeLock) {
			await wakeLock.release();
			wakeLock = null;
		}
	}

	// --- Core Speech Functions ---
	function cleanupSpeech() {
		if (isSupported && window.speechSynthesis.speaking) {
			window.speechSynthesis.cancel();
		}
		// Reset state fully
		isSpeaking = false;
		isPaused = false;
		releaseWakeLock();
	}

	function speak() {
		if (!isSupported || !textToRead) return;

		cleanupSpeech(); // Clean up any previous state before starting

		const utterance = new SpeechSynthesisUtterance(textToRead);
		utterance.rate = rate;

		// State management driven by utterance events for reliability
		utterance.onstart = () => {
			acquireWakeLock();
			isSpeaking = true;
			isPaused = false;
		};

		utterance.onpause = () => {
			// This event syncs state if paused by external factors (e.g. tab switch)
			releaseWakeLock();
			isPaused = true;
		};

		utterance.onresume = () => {
			acquireWakeLock();
			isPaused = false;
		};

		utterance.onend = () => {
			// onend fires after cancel() or natural completion
			cleanupSpeech();
		};


		utterance.onerror = (event) => {
			console.error('An error occurred during speech synthesis:', event);
			cleanupSpeech();
		};

		window.speechSynthesis.speak(utterance);
	}

	// --- Control Handlers ---
	function handlePlayPause() {
		if (window.speechSynthesis.paused) {
			// If paused by any means, resume
			window.speechSynthesis.resume();
		} else if (window.speechSynthesis.speaking) {
			// If speaking, pause
			window.speechSynthesis.pause();
		} else {
			// Otherwise, start from the beginning
			speak();
		}
	}

	function handleStop() {
		cleanupSpeech();
	}

	function changeRate(direction: 'up' | 'down') {
		const currentIndex = supportedRates.indexOf(rate);
		const nextIndex = currentIndex + (direction === 'up' ? 1 : -1);

		if (nextIndex >= 0 && nextIndex < supportedRates.length) {
			rate = supportedRates[nextIndex];

			// If already speaking, restart with the new rate for an immediate effect
			if (isSpeaking) {
				speak();
			}
		}
	}

	onMount(() => {
		if ('speechSynthesis' in window) {
			isSupported = true;
		}
		
		// When navigating to a page, ensure any speech from a previous page is stopped.
		window.speechSynthesis.cancel();

		// Pause speech if the tab becomes hidden to prevent background audio issues
		const handleVisibilityChange = () => {
			if (document.visibilityState === 'hidden' && isSpeaking && !isPaused) {
				window.speechSynthesis.pause();
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);

		// Cleanup function to run when the component is destroyed
		return () => {
			cleanupSpeech();
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	});
</script>

{#if isSupported}
	<div class="interactive-component-wrapper not-prose">
		<p class="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Listen to this post:</p>
		<div class="flex items-center gap-2">
			<button
				onclick={handlePlayPause}
				disabled={!textToRead}
				aria-label={isSpeaking && !isPaused ? 'Pause' : 'Play'}
			>
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
					onclick={() => changeRate('down')}
					disabled={rate === supportedRates[0]}
					aria-label="Decrease speed"
					class="p-1"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 19 2 12 11 5 11 19"></polygon><polygon points="22 19 13 12 22 5 22 19"></polygon></svg>
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
	/* Add some specific styles for the rate control buttons to make them smaller */
	.p-1 {
		padding: 0.25rem;
	}
</style>