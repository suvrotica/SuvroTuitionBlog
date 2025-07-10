<!-- File: src/lib/components/layout/Header.svelte -->
<script lang="ts">
	// Hamburger menu state and logic will be added later.
	let isMenuOpen = $state(false);
</script>

<header>
	<div class="container">
		<nav>
			<a href="/" class="site-title">
                SuvroGhosh.Blog
            </a>
			<!-- Placeholder for desktop nav items -->
			<div class="hidden md:flex items-center space-x-4">
				<a href="/blog" class="sidebar-link">Blog</a>
				<a href="/about" class="sidebar-link">About</a>
				<a href="/contact" class="sidebar-link">Contact</a>
			</div>
			<!-- Hamburger Button -->
			<button class="hamburger md:hidden" onclick={() => isMenuOpen = !isMenuOpen}>
				<span class="sr-only">Open main menu</span>
				<!-- SVG icon for hamburger -->
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
			</button>
		</nav>
	</div>
	<!-- Mobile Menu (logic to show/hide will be implemented) -->
	{#if isMenuOpen}
		<div class="md:hidden">
			<!-- mobile nav links here -->
		</div>
	{/if}
</header>
