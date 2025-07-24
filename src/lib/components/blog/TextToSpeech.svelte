<script lang="ts">
	import { onMount } from 'svelte';

	// PROPS (No changes needed here)
	export let contentSelector: string = '';
	export let textToRead: string = '';

	// STATE & LOGIC (No changes needed here)
	let text: string = '';
	let isSupported = false;
	let isSpeaking = false;
	let isPaused = false;
	let speed = 1;
	let currentCharacter = 0;
	let speedInput: HTMLInputElement;
	let utterance: SpeechSynthesisUtterance;

	onMount(() => {
		if ('speechSynthesis' in window) {
			isSupported = true;
			utterance = new SpeechSynthesisUtterance();
			utterance.onend = () => {
				isSpeaking = false;
				isPaused = false;
				currentCharacter = 0;
			};
			utterance.onboundary = (event) => {
				currentCharacter = event.charIndex;
			};
		}

		if (textToRead) {
			text = textToRead;
		} else if (contentSelector) {
			const element = document.querySelector(contentSelector);
			if (element) {
				text = (element as HTMLElement).innerText;
			}
		}

		return () => {
			if (isSupported) {
				window.speechSynthesis.cancel();
			}
		};
	});

	function playText() {
		if (!isSupported || !text) return;
		if (speechSynthesis.paused && speechSynthesis.speaking) {
			isPaused = false;
			return speechSynthesis.resume();
		}
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
		speechSynthesis.resume();
		speechSynthesis.cancel();
		isSpeaking = false;
		isPaused = false;
		currentCharacter = 0;
	}

	function handleSpeedChange() {
		if (speechSynthesis.speaking) {
			stopText();
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
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				<label for="speed" class="text-sm text-neutral-600 dark:text-neutral-400">Speed</label>
				<input
					type="range"
					id="speed"
					name="speed"
					min="0.5"
					max="2"
					step="0.1"
					class="tts-speed-input"
					bind:value={speed}
					oninput={handleSpeedChange}
					bind:this={speedInput}
				/>
				<span class="text-sm font-mono text-neutral-600 dark:text-neutral-400 w-10 text-center"
					>{speed.toFixed(1)}x</span
				>
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
	/* Styles for number input arrows can be removed as they are no longer used. */
	/* The .tts-speed-input class from app.css will style the range slider. */
</style>