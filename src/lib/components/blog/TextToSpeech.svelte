<script lang="ts">
	import { onMount, tick } from 'svelte';

	// PROPS: This component will get its text from the page element matching the selector.
	export let contentSelector: string;

	// --- State Variables (Svelte 4 Style) ---
	let speed = 1;
	let text = '';
	let currentCharacter = 0;
	let utterance: SpeechSynthesisUtterance;
	
	// A reactive variable to track the synthesizer's status
	let status: 'idle' | 'playing' | 'paused' = 'idle';

	// This function will be called when the component is mounted
	onMount(() => {
		// Guard for SSR
		if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
		
		// Set up the single utterance instance
		utterance = new SpeechSynthesisUtterance();

		// Add event listeners to keep our UI state in sync with the browser's speech engine
		utterance.addEventListener('start', () => status = 'playing');
		utterance.addEventListener('pause', () => status = 'paused');
		utterance.addEventListener('resume', () => status = 'playing');
		utterance.addEventListener('end', () => {
			currentCharacter = 0;
			status = 'idle';
		});
		utterance.addEventListener('boundary', e => {
			// In the original example, utterance.text was changing. Here it won't, so we add the offset.
			const offset = text.length - utterance.text.length;
			currentCharacter = offset + e.charIndex;
		});

		// Cleanup function
		return () => {
			if (speechSynthesis.speaking) {
				speechSynthesis.cancel();
			}
		};
	});

	// --- Reactive statement to get content from the page ---
	$: if (contentSelector && typeof document !== 'undefined') {
		const element = document.querySelector(contentSelector);
		if (element) {
			text = (element as HTMLElement).innerText;
		}
	}

	// --- Control Functions (from your working example) ---
	function playText(textToSpeak: string) {
		if (speechSynthesis.paused && speechSynthesis.speaking) {
			return speechSynthesis.resume();
		}
		if (speechSynthesis.speaking) return;

		utterance.text = textToSpeak;
		utterance.rate = speed || 1;
		speechSynthesis.speak(utterance);
	}

	function pause() {
		if (speechSynthesis.speaking) speechSynthesis.pause();
	}

	function stop() {
		if (speechSynthesis.speaking) {
			// The resume() before cancel() is a known trick to fix issues on some browsers.
			speechSynthesis.resume(); 
			speechSynthesis.cancel();
		}
	}

	function changeSpeed() {
		// Stop the current speech, then synchronously restart with the remaining text.
		// This preserves the user gesture chain, which is critical for mobile.
		const wasSpeaking = speechSynthesis.speaking && !speechSynthesis.paused;
		const remainingText = utterance.text.substring(currentCharacter);

		stop();

		if (wasSpeaking) {
			playText(remainingText);
		}
	}
</script>

<div class="tts-container not-prose">
	<div class="tts-controls">
		<div class="tts-actions">
			{#if status === 'idle'}
				<button on:click={() => playText(text)} disabled={!text}>Play</button>
			{:else if status === 'paused'}
				<button on:click={() => playText(text)}>Resume</button>
			{:else}
				<button on:click={pause}>Pause</button>
			{/if}
			
			<button on:click={stop} disabled={status === 'idle'}>Stop</button>
			
			<label class="tts-speed-label">
				Speed
				<input
					type="range"
					class="tts-speed-input"
					min="0.5"
					max="2"
					step="0.1"
					bind:value={speed}
					on:input={changeSpeed}
					disabled={status === 'idle'}
				/>
				<span class="font-mono text-xs">{speed.toFixed(1)}x</span>
			</label>
		</div>
	</div>
</div>