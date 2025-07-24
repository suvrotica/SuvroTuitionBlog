<script lang="ts">
	import { onMount } from 'svelte';

	// PROPS
	export let contentSelector: string = '';
	export let lang: string = 'en-US';

	// STATE
	let text: string = 'Many people say they have no choice but to embrace the changes, even as they come to terms with the loss of freedom and spontaneity.';
	let isSupported = false;
	let isSpeaking = false;
	let isPaused = false;
	let speed = 1;
	let currentCharacter = 0;

	let utterance: SpeechSynthesisUtterance;

	onMount(() => {
		if ('speechSynthesis' in window) {
			isSupported = true;
			utterance = new SpeechSynthesisUtterance();
			utterance.lang = lang;

			utterance.onend = () => {
				isSpeaking = false;
				isPaused = false;
				currentCharacter = 0;
			};

			utterance.onboundary = (event) => {
				currentCharacter = event.charIndex;
			};
		}

		if (contentSelector) {
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
		utterance.lang = lang;
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
		// No need to update the `speed` variable here, as `bind:value` on the input handles it.
		// Just re-apply the new speed if speech is active.
		if (speechSynthesis.speaking) {
			const wasPaused = isPaused;
			stopText();
			setTimeout(() => {
				const remainingText = text.substring(currentCharacter);
				if (remainingText) {
					utterance.text = remainingText;
					utterance.rate = speed || 1;
					utterance.lang = lang;
					speechSynthesis.speak(utterance);
					isSpeaking = true;
					if (wasPaused) {
						pauseText();
					}
				}
			}, 50);
		}
	}
</script>

{#if isSupported}
	{#if !contentSelector}
		<div class="tts-container not-prose">
			<textarea
				class="tts-text"
				bind:value={text}
				disabled={isSpeaking}
				placeholder="Enter text to speak..."
			></textarea>
			<div class="tts-controls">
				<label class="tts-speed-label">
					<span>Speed</span>
					<input
						type="range"
						min="0.5"
						max="2"
						step="0.1"
						class="tts-speed-input"
						bind:value={speed}
						on:input={handleSpeedChange}
					/>
					<span class="w-8 text-center font-mono">{speed.toFixed(1)}x</span>
				</label>
				<div class="tts-actions">
					{#if isSpeaking && !isPaused}
						<button on:click={pauseText} aria-label="Pause">
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
						</button>
					{:else}
						<button on:click={playText} aria-label="Play" disabled={!text}>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><polygon points="5 3 19 12 5 21 5 3" /></svg>
						</button>
					{/if}
					<button on:click={stopText} disabled={!isSpeaking} aria-label="Stop">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /></svg>
					</button>
				</div>
			</div>
		</div>
	{:else}
		<div class="tts-container not-prose">
			<div class="tts-controls">
				<label class="tts-speed-label">
					<span>Speed</span>
					<input
						type="range"
						min="0.5"
						max="2"
						step="0.1"
						class="tts-speed-input"
						bind:value={speed}
						on:input={handleSpeedChange}
					/>
					<span class="w-8 text-center font-mono">{speed.toFixed(1)}x</span>
				</label>
				<div class="tts-actions">
					{#if isSpeaking && !isPaused}
						<button on:click={pauseText} aria-label="Pause">
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
						</button>
					{:else}
						<button on:click={playText} aria-label="Play" disabled={!text}>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><polygon points="5 3 19 12 5 21 5 3" /></svg>
						</button>
					{/if}
					<button on:click={stopText} disabled={!isSpeaking} aria-label="Stop">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /></svg>
					</button>
				</div>
			</div>
		</div>
	{/if}
{:else}
	<div class="tts-container not-prose">
		<p class="text-sm text-red-600 dark:text-red-400">
			We're sorry, but Text-to-Speech is not supported by your browser.
		</p>
	</div>
{/if}

<style>
	/* Targeting the number input arrows for better dark mode visibility */
	/* No changes to styles are needed */
</style>