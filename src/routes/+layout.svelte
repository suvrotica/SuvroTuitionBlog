<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Aside from '$lib/components/layout/Aside.svelte';
	import ObsidianDrillDown from '$lib/components/layout/DrillDown.svelte';

	let { children } = $props();
	let isMenuOpen = $state(false);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	// Lock body scroll when mobile menu is open
	$effect(() => {
		if (isMenuOpen) {
			document.body.classList.add('body-scroll-lock');
		} else {
			document.body.classList.remove('body-scroll-lock');
		}
	});
</script>

{#if isMenuOpen}
	<div
		class="mobile-nav-overlay lg:hidden"
		onclick={toggleMenu}
		role="button"
		tabindex="0"
		onkeydown={(e) => e.key === 'Escape' && toggleMenu()}
	></div>
	<div class="mobile-nav-drawer lg:hidden" class:open={isMenuOpen} class:closed={!isMenuOpen}>
		<Aside />
	</div>
{/if}

<div class="main-layout">
	<div class="hidden lg:block">
		<Aside />
	</div>

	<div class="main-content">
		<Header {isMenuOpen} {toggleMenu} />
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