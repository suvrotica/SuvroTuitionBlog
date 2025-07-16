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
	let status = $state<'idle' | 'playing' | 'paused'>('idle');
	let currentCharacter = $state(0);
	
	// DERIVED STATE for UI labels
	let labels = $derived(lang ? {
		speed: 'Speed', play: 'Play', pause: 'Pause', stop: 'Stop', resume: 'Resume'
	} : {
		speed: '速度', play: '播放', pause: '暫停', stop: '停止', resume: '恢復'
	});

	// --- Synchronous Speech Functions ---

	function play(offset: number) {
		if (typeof window === 'undefined' || !window.speechSynthesis || speechSynthesis.speaking) return;

		const utterance = new SpeechSynthesisUtterance(textToRead.substring(offset));
		
		utterance.onstart = () => status = 'playing';
		utterance.onpause = () => status = 'paused';
		utterance.onresume = () => status = 'playing';
		utterance.onend = () => {
			currentCharacter = 0;
			status = 'idle';
		};
		utterance.onboundary = (e) => {
			currentCharacter = offset + e.charIndex;
		};
		utterance.onerror = (e) => {
			console.error("Speech Synthesis Error", e);
			status = 'idle';
		};

		utterance.rate = speed;
		speechSynthesis.speak(utterance);
	}

	function handlePlayPause() {
		if (status === 'paused') {
			speechSynthesis.resume();
		} else if (status === 'playing') {
			speechSynthesis.pause();
		} else {
			play(currentCharacter);
		}
	}

	function handleStop() {
		if (typeof window !== 'undefined' && window.speechSynthesis && speechSynthesis.speaking) {
			speechSynthesis.cancel(); // onend listener will reset state
		}
	}
	
	function handleSpeedChange() {
		const wasPlaying = status === 'playing';
		const lastPosition = currentCharacter;

		handleStop();
		
		// This now happens synchronously
		if (wasPlaying) {
			play(lastPosition);
		}
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

		// Cleanup on component unmount
		return () => handleStop();
	});
</script>

<div class="tts-container not-prose">
	<textarea class="tts-text" bind:value={textToRead} disabled={status !== 'idle'}></textarea>
	
	<div class="tts-controls">
		<div class="tts-actions">
			<button onclick={handlePlayPause} disabled={!textToRead}>
				{#if status === 'playing'}
					{labels.pause}
				{:else if status === 'paused'}
					{labels.resume}
				{:else}
					{labels.play}
				{/if}
			</button>
			
			<button onclick={handleStop} disabled={status === 'idle'}>{labels.stop}</button>
			
			<label class="tts-speed-label">
				{labels.speed}
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