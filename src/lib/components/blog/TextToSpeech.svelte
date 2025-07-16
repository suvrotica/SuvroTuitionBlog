<script lang="ts">
	import { onMount } from 'svelte';

	// PROPS
	/**
	 * A CSS selector for the element containing the text to be read.
	 * e.g., "#post-content"
	 */
	export let contentSelector: string = '';

	// STATE
	let text: string = 'Many people say they have no choice but to embrace the changes, even as they come to terms with the loss of freedom and spontaneity.'; // Default text
	let isSupported = false;
	let isSpeaking = false;
	let isPaused = false;
	let speed = 1;
	let currentCharacter = 0;

	// DOM-element bindings
	let speedInput: HTMLInputElement;

	// We create a single utterance instance and reuse it.
	let utterance: SpeechSynthesisUtterance;

	onMount(() => {
		if ('speechSynthesis' in window) {
			isSupported = true;
			utterance = new SpeechSynthesisUtterance();

			// When speech ends, reset the state.
			utterance.onend = () => {
				isSpeaking = false;
				isPaused = false;
				currentCharacter = 0;
			};

			// Track progress to allow for resuming or changing speed mid-speech.
			utterance.onboundary = (event) => {
				currentCharacter = event.charIndex;
			};
		}

		// If a content selector is provided, extract the text from the DOM.
		if (contentSelector) {
			const element = document.querySelector(contentSelector);
			if (element) {
				text = (element as HTMLElement).innerText;
			}
		}

		// Cleanup: Ensure speech is stopped when the component is unmounted.
		return () => {
			if (isSupported) {
				window.speechSynthesis.cancel();
			}
		};
	});

	function playText() {
		if (!isSupported || !text) return;

		// If we are paused, just resume.
		if (speechSynthesis.paused && speechSynthesis.speaking) {
			isPaused = false;
			return speechSynthesis.resume();
		}

		// If we are already speaking, do nothing.
		if (speechSynthesis.speaking) return;

		utterance.text = text;
		utterance.rate = speed || 1;
		speechSynthesis.speak(utterance);
		isSpeaking = true;
		isPaused = false;
	}

	function pauseText() {
		if (speechSynthesis.speaking) {
			speechSynthesis.pause();
			isPaused = true;
		}
	}

	function stopText() {
		speechSynthesis.resume(); // Ensure it's not paused before cancelling.
		speechSynthesis.cancel();
		isSpeaking = false;
		isPaused = false;
		currentCharacter = 0;
	}

	function handleSpeedChange() {
		// If speaking, stop and restart from the current position to apply the new speed.
		if (speechSynthesis.speaking) {
			stopText();
			// A brief delay to allow the cancel command to process fully.
			setTimeout(() => {
				const remainingText = text.substring(currentCharacter);
				if (remainingText) {
					utterance.text = remainingText;
					utterance.rate = speed || 1;
					speechSynthesis.speak(utterance);
					isSpeaking = true;
				}
			}, 50);
		}
	}
</script>

<div class="interactive-component-wrapper not-prose">
	{#if isSupported}
		<textarea
			class="w-full h-48 p-3 rounded-md bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-gold dark:focus:ring-gold transition-all"
			bind:value={text}
			placeholder="Enter text to speak..."
		></textarea>
		<div class="flex items-center justify-between mt-4">
			<div class="flex items-center gap-2">
				<label for="speed" class="text-sm text-neutral-600 dark:text-neutral-400">Speed</label>
				<input
					type="number"
					id="speed"
					name="speed"
					min="0.5"
					max="2"
					step="0.1"
					class="w-20 rounded-md border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-center"
					bind:value={speed}
					onchange={handleSpeedChange}
					bind:this={speedInput}
				/>
			</div>

			<div class="flex items-center gap-2">
				{#if isSpeaking && !isPaused}
					<button onclick={pauseText} aria-label="Pause">
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
							class="w-5 h-5"
						>
							<rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
						</svg>
					</button>
				{:else}
					<button onclick={playText} aria-label="Play" disabled={!text}>
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
							class="w-5 h-5"
						>
							<polygon points="5 3 19 12 5 21 5 3" />
						</svg>
					</button>
				{/if}

				<button onclick={stopText} disabled={!isSpeaking} aria-label="Stop">
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
						class="w-5 h-5"
					>
						<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
					</svg>
				</button>
			</div>
		</div>
	{:else}
		<p class="text-sm text-red-600 dark:text-red-400">
			We're sorry, but Text-to-Speech is not supported by your browser.
		</p>
	{/if}
</div>

<style>
	/* Targeting the number input arrows for better dark mode visibility */
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		filter: invert(0.8);
	}

	:global(html.light) input[type='number']::-webkit-inner-spin-button,
	:global(html.light) input[type='number']::-webkit-outer-spin-button {
		filter: none;
	}
</style>