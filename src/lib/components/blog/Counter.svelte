<script lang="ts">
	// Using Svelte 5 runes for reactivity
	let count = $state(0);

	function increment() {
		count += 1;
	}
</script>

<div class="interactive-component-wrapper">
	<p>
		I'm an interactive Svelte component! Current count: <span class="font-bold">{count}</span>
	</p>
	<button
        
		onclick={increment}
	>
		Click me!
	</button>
</div>
