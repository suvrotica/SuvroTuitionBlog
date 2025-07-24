<!-- src/routes/blog/[slug]/+layout.svelte -->
<!-- 
  This layout is now simplified. 
  The complex grid and the OnThisPage component have been removed,
  as the root layout now handles the right-hand sidebar globally.
-->
<script lang="ts">
	let { children } = $props();
</script>

{@render children()}
