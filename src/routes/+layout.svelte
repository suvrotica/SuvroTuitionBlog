<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Aside from '$lib/components/layout/Aside.svelte';
	import ObsidianDrillDown from '$lib/components/layout/DrillDown.svelte';

	// We no longer need to access `data` here, simplifying the component.
	let { children } = $props();
</script>

<div class="main-layout">
	<Aside />

	<div class="main-content">
		<Header />

		<main class="scrollable-main">
			<div class="container grid lg:grid-cols-[minmax(0,1fr)_auto] gap-8 py-8">
				<div>
					{@render children()}
				</div>
				<ObsidianDrillDown />
			</div>
		</main>

		<Footer />
	</div>
</div>