<script lang="ts">
	import { onMount } from 'svelte';

	// PROPS
	export let contentSelector: string = '';
	export let lang: string = 'en-US';

	// STATE
	let text: string = '';
	let isSupported = false;
	let isSpeaking = false;
	let isPaused = false;
	let speed = 1;
	let currentCharacter = 0;
	let utterance: SpeechSynthesisUtterance;
	
	// NEW: State for available voices and check for the specific voice
	let voices: SpeechSynthesisVoice[] = [];
	let isVoiceAvailable = false;

	// NEW: Function to populate and check for voices
	function populateVoiceList() {
		if (!isSupported) return;
		voices = window.speechSynthesis.getVoices();
		isVoiceAvailable = voices.some(v => v.lang === lang);
	}

	onMount(() => {
		if ('speechSynthesis' in window) {
			isSupported = true;
			
			// Initial population of voices
			populateVoiceList();

			// Voices are loaded asynchronously, so we listen for the `voiceschanged` event
			window.speechSynthesis.onvoiceschanged = populateVoiceList;

			utterance = new SpeechSynthesisUtterance();
			
			utterance.onend = () => {
				isSpeaking = false;
				isPaused = false;
				currentCharacter = 0;
			};

			utterance.onboundary = (event) => {
				currentCharacter = event.charIndex;
			};

			if (contentSelector) {
				const element = document.querySelector(contentSelector);
				if (element) {
					text = (element as HTMLElement).innerText;
				}
			}
		}

		return () => {
			if (isSupported) {
				window.speechSynthesis.onvoiceschanged = null;
				window.speechSynthesis.cancel();
			}
		};
	});

	function playText() {
		if (!isSupported || !text || !isVoiceAvailable) return;
		
		if (speechSynthesis.paused && speechSynthesis.speaking) {
			isPaused = false;
			return speechSynthesis.resume();
		}
		
		if (speechSynthesis.speaking) return;

		// Find and assign the specific voice for better reliability
		const voice = voices.find(v => v.lang === lang);
		if (voice) {
			utterance.voice = voice;
		}
		
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
		if(speechSynthesis.speaking) {
			speechSynthesis.resume(); // Ensure it's not paused before cancelling
		}
		speechSynthesis.cancel();
		isSpeaking = false;
		isPaused = false;
		currentCharacter = 0;
	}

	function handleSpeedChange() {
		if (speechSynthesis.speaking) {
			const wasPaused = isPaused;
			const currentText = utterance.text; // Grab text before stopping
			stopText();

			// A small delay allows the synthesis engine to reset properly
			setTimeout(() => {
				const remainingText = currentText.substring(currentCharacter);
				if (remainingText) {
					playText(); // playText will now correctly find and set the voice
					if (wasPaused) {
						// A small delay here too ensures the speech has started before pausing
						setTimeout(pauseText, 50);
					}
				}
			}, 50);
		}
	}
</script>

{#if isSupported}
	<div class="tts-container not-prose">
		{#if !isVoiceAvailable}
			<p class="text-sm text-amber-600 dark:text-amber-400">
				A Text-to-Speech voice for this language ('{lang}') is not available in your browser.
			</p>
		{:else if !contentSelector}
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
						<button on:click={playText} aria-label="Play" disabled={!text || !isVoiceAvailable}>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><polygon points="5 3 19 12 5 21 5 3" /></svg>
						</button>
					{/if}
					<button on:click={stopText} disabled={!isSpeaking} aria-label="Stop">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /></svg>
					</button>
				</div>
			</div>
		{:else}
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
						<button on:click={playText} aria-label="Play" disabled={!text || !isVoiceAvailable}>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><polygon points="5 3 19 12 5 21 5 3" /></svg>
						</button>
					{/if}
					<button on:click={stopText} disabled={!isSpeaking} aria-label="Stop">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /></svg>
					</button>
				</div>
			</div>
		{/if}
	</div>
{:else}
	<div class="tts-container not-prose">
		<p class="text-sm text-red-600 dark:text-red-400">
			We're sorry, but Text-to-Speech is not supported by your browser.
		</p>
	</div>
{/if}