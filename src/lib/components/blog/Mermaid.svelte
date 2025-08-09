<script lang="ts">
	import mermaid from 'mermaid';

	let { code }: { code: string } = $props();
	let el = $state<HTMLDivElement>();
	let id = `mermaid-${crypto.randomUUID()}`;

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