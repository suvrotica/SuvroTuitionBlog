<script lang="ts">
	import Notebook from '$lib/components/notebook/Notebook.svelte';
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.notebook.title} - Notebook</title>
</svelte:head>

<Notebook notebookData={data.notebook} />