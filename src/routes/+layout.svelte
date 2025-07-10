<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Aside from '$lib/components/layout/Aside.svelte';
	import ObsidianDrillDown from '$lib/components/layout/DrillDown.svelte';

	let { data, children } = $props();
</script>

<div class="main-layout">
	<Aside topics={data.topics} />

	<div class="main-content">
		<Header />

		<main class="scrollable-main">
			<!-- 
        This new grid layout accommodates the main content and the new drill-down sidebar.
        The grid layout is responsive, stacking on smaller screens.
      -->
			<div class="container grid lg:grid-cols-[minmax(0,1fr)_auto] gap-8 py-8">
				<div>
					{@render children()}
				</div>
				<ObsidianDrillDown topics={data.topics} />
			</div>
		</main>

		<Footer />
	</div>
</div>
