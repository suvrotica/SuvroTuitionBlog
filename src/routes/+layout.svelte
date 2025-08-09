<script lang="ts">
	// Existing imports
	import '../app.css';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Aside from '$lib/components/layout/Aside.svelte';
	import ObsidianDrillDown from '$lib/components/layout/DrillDown.svelte';
	import SEO from '$lib/components/seo/SEO.svelte';
	import { page } from '$app/state';

	// START: NEWLY ADDED FOR MERMAID
	import mermaid from 'mermaid';
	import { browser } from '$app/environment';

	// This runs the Mermaid configuration once when the app loads in the browser.
	if (browser) {
		mermaid.initialize({
			startOnLoad: false,
			// The 'base' theme is required for classDef styling to work.
			theme: 'base',
			themeVariables: {
				primaryColor: '#fff',
				primaryTextColor: '#111',
				lineColor: '#112233',
				fontFamily: 'inherit'
			}
		});
	}
	// END: NEWLY ADDED FOR MERMAID

	let { children } = $props();
	let isMenuOpen = $state(false);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	$effect(() => {
		if (isMenuOpen) {
			document.body.classList.add('body-scroll-lock');
		} else {
			document.body.classList.remove('body-scroll-lock');
		}
	});

	let seo = $derived(page.data.seo);
	let schema = $derived(page.data.schema);
</script>

{#if seo}
	<SEO
		title={seo.title}
		description={seo.description}
		canonicalUrl={seo.canonicalUrl}
		ogImageUrl={seo.openGraph?.images[0]?.url}
		ogImageAlt={seo.openGraph?.images[0]?.alt}
		{schema}
	/>
{/if}

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
	<div class="sidebar-container hidden lg:block">
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