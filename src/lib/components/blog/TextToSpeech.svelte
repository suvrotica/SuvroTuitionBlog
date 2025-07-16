<script lang="ts">
	import { onMount } from 'svelte';

	// PROPS
	let {
		contentSelector = '',
		initialText = 'Many people say they have no choice but to embrace the changes, even as they come to terms with the loss of freedom and spontaneity.'
	}: {
		contentSelector?: string;
		initialText?: string;
	} = $props();

	// STATE
	let textToRead = $state(initialText);
	let speed = $state(1);
	let lang = $state(true);
	let currentCharacter = $state(0);
	
	// A signal to force UI updates when the external synth state changes
	let synthUIState = $state(0);

	// DERIVED STATE - Reflects the browser's real API state
	let isSpeaking = $derived(window.speechSynthesis?.speaking ?? false);
	let isPaused = $derived(window.speechSynthesis?.paused ?? false);
	
	// DERIVED UI LABELS
	let labels = $derived(lang ? {
		speed: 'Speed', play: 'Play', pause: 'Pause', stop: 'Stop', resume: 'Resume'
	} : {
		speed: '速度', play: '播放', pause: '暫停', stop: '停止', resume: '恢復'
	});

	// We use one utterance object and update its properties, like the playground example.
	const utterance = new SpeechSynthesisUtterance();
	
	// This runs only on the client
	if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
		utterance.addEventListener('end', () => {
			currentCharacter = 0;
			synthUIState++; // Force UI update
		});
		utterance.addEventListener('boundary', e => {
			// This tracks the position in the *current* utterance text.
			currentCharacter = e.charIndex;
		});
	}
	
	function playText(text: string) {
		if (typeof window === 'undefined' || !window.speechSynthesis) return;

		// If paused, just resume. This is a direct, synchronous call.
		if (speechSynthesis.paused && speechSynthesis.speaking) {
			return speechSynthesis.resume();
		}

		if (speechSynthesis.speaking) return;

		utterance.text = text;
		utterance.rate = speed;
		speechSynthesis.speak(utterance);
		synthUIState++;
	}

	function pause() {
		if (speechSynthesis.speaking) {
			speechSynthesis.pause();
			synthUIState++;
		}
	}

	function stop() {
		// The resume() before cancel() is a known trick to fix issues on some browsers.
		speechSynthesis.resume();
		speechSynthesis.cancel();
		synthUIState++;
	}

	function changeSpeed() {
		// The key fix: This entire operation is now synchronous.
		handleStop(); // Renamed for clarity
		// We use the full text, but the `play` function will use the utterance's internal state
		// which was just speaking from a substring. We need to grab that remaining text.
		const remainingText = utterance.text.substring(currentCharacter);
		playText(remainingText);
	}

	// Wrapper for stop that also resets our local character count
	function handleStop() {
		stop();
		currentCharacter = 0;
	}

	onMount(() => {
		$effect(() => {
			if (contentSelector && typeof window !== 'undefined') {
				const element = document.querySelector(contentSelector);
				if (element) {
					handleStop();
					textToRead = (element as HTMLElement).innerText;
				}
			}
		});

		return () => handleStop();
	});
</script>

<div class="tts-container not-prose">
	<span class="hidden">{synthUIState}</span>

	<textarea class="tts-text" bind:value={textToRead} disabled={isSpeaking}></textarea>
	
	<div class="tts-controls">
		<div class="tts-actions">
			<button onclick={() => playText(textToRead)} disabled={isSpeaking && !isPaused}>
				{isPaused ? labels.resume : labels.play}
			</button>
			<button onclick={pause} disabled={!isSpeaking || isPaused}>{labels.pause}</button>
			<button onclick={handleStop} disabled={!isSpeaking}>{labels.stop}</button>
			
			<label class="tts-speed-label">
				{labels.speed}
				<input
					type="range"
					class="tts-speed-input"
					min="0.5"
					max="2"
					step="0.1"
					bind:value={speed}
					oninput={changeSpeed}
					disabled={!isSpeaking}
				/>
				<span class="font-mono text-xs">{speed.toFixed(1)}x</span>
			</label>
		</div>
		
		<button
			class="tts-lang-toggle"
			onclick={() => lang = !lang}
			title="Switch Labels Language"
			aria-label="Switch Labels Language"
		>
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<circle cx="12" cy="12" r="10" />
				<line x1="2" y1="12" x2="22" y2="12" />
				<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
			</svg>
		</button>
	</div>
</div>