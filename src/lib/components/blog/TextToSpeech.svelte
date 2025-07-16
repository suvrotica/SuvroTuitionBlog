<script lang="ts">
	import { onMount } from 'svelte';

	// PROPS
	let { contentSelector = '' }: { contentSelector: string } = $props();

	// STATE
	let textToRead = $state('');
	let speed = $state(1);
	let currentCharacter = $state(0);
	
	// A signal to force UI updates when the external synth state changes
	let synthUIState = $state(0); 

	// DERIVED STATE - Reflects the browser's real API state
	let isSpeaking = $derived(window.speechSynthesis?.speaking ?? false);
	let isPaused = $derived(window.speechSynthesis?.paused ?? false);

	// --- Core Speech Functions ---

	// This function handles the logic for playing, pausing, and resuming.
	function handlePlayPause() {
		// If speech is happening and is paused, resume it.
		if (isSpeaking && isPaused) {
			window.speechSynthesis.resume();
		} 
		// If speech is happening but not paused, pause it.
		else if (isSpeaking && !isPaused) {
			window.speechSynthesis.pause();
		} 
		// Otherwise, start a new speech.
		else {
			const utterance = new SpeechSynthesisUtterance(textToRead.substring(currentCharacter));
			
			// Add listeners to the new utterance to update our state
			utterance.addEventListener('boundary', e => {
				currentCharacter = (textToRead.length - utterance.text.length) + e.charIndex;
			});
			utterance.addEventListener('end', () => {
				currentCharacter = 0;
				synthUIState++; // Force UI update
			});

			utterance.rate = speed;
			window.speechSynthesis.speak(utterance);
		}
		
		// We always update the UI state after an action
		synthUIState++;
	}

	function handleStop() {
		if (isSpeaking) {
			window.speechSynthesis.cancel();
		}
	}

	// This logic is now fully synchronous to work on mobile
	function handleSpeedChange() {
		// Store the current position before stopping
		const lastPosition = currentCharacter;
		const wasSpeaking = isSpeaking && !isPaused;

		handleStop();

		// If it was playing, immediately restart from the last position
		// This happens in the same event loop, preserving the user gesture
		if (wasSpeaking) {
			// Update the current character immediately for the new playback
			currentCharacter = lastPosition;
			handlePlayPause();
		}
	}

	// --- Component Lifecycle & Setup ---

	onMount(() => {
		// This effect will run once the component is mounted and grab the blog post text
		$effect(() => {
			if (contentSelector && typeof window !== 'undefined') {
				const element = document.querySelector(contentSelector);
				if (element) {
					handleStop();
					textToRead = (element as HTMLElement).innerText;
				}
			}
		});

		// Add a global listener to keep our UI in sync with the actual API state
		// This handles cases where speech ends naturally or is paused by other means
		const syncState = () => synthUIState++;
		window.speechSynthesis.addEventListener('voiceschanged', syncState);

		// Cleanup function
		return () => {
			handleStop();
			window.speechSynthesis.removeEventListener('voiceschanged', syncState);
		};
	});
</script>

<div class="tts-container not-prose">
	<span class="hidden">{synthUIState}</span>

	<p class="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Listen to this post:</p>
	<div class="flex items-center flex-wrap gap-x-4 gap-y-2">
		<div class="tts-actions">
			<button onclick={handlePlayPause} disabled={!textToRead}>
				{#if isSpeaking && !isPaused}
					Pause
				{:else if isSpeaking && isPaused}
					Resume
				{:else}
					Play
				{/if}
			</button>
			
			<button onclick={handleStop} disabled={!isSpeaking}>Stop</button>
		</div>
		
		<label class="tts-speed-label">
			Speed
			<input
				type="range"
				class="tts-speed-input"
				min="0.5"
				max="2"
				step="0.1"
				bind:value={speed}
				oninput={handleSpeedChange}
			/>
			<span class="font-mono text-xs">{speed.toFixed(1)}x</span>
		</label>
	</div>
</div>