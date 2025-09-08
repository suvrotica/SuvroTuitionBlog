<script lang="ts">
	import mermaid from 'mermaid';

	let { code }: { code: string } = $props();
	let el = $state<HTMLDivElement>();
	let id = `mermaid-${crypto.randomUUID()}`;

	// Initialize Mermaid with custom theme
	mermaid.initialize({
		startOnLoad: false,
		theme: "base",
		themeVariables: {
			primaryColor: "#bbf",
			primaryTextColor: "#111",   // dark text inside nodes
			secondaryColor: "#fbb",
			secondaryTextColor: "#111", // dark text for "bad" nodes
			lineColor: "#ccc",          // lighter connector lines
			tertiaryColor: "#fff",
			tertiaryTextColor: "#111"
		}
	});

	$effect(() => {
		if (el && code) {
			mermaid.render(id, code).then(({ svg }) => {
				el!.innerHTML = svg;
			});
		}
	});
</script>

<div bind:this={el} class="mermaid-container"></div>

<style>
	.mermaid-container {
		text-align: center;
		margin-block: 2rem;
	}
</style>
