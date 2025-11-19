<script lang="ts">
	// State is now passed down from the root layout
	let {
		isMenuOpen = false,
		toggleMenu = () => {}
	}: {
		isMenuOpen: boolean;
		toggleMenu: () => void;
	} = $props();
</script>

<header>
	<div class="container">
		<nav>
			<a href="/" class="site-title"> SuvroGhosh.Blog </a>
			<div class="hidden md:flex items-center space-x-4">
				<a href="/blog" class="sidebar-link">Blog</a>
				<a href="/notebooks" class="sidebar-link">Notebooks</a>
			</div>
			<button
				class="hamburger lg:hidden"
				onclick={toggleMenu}
				aria-label={isMenuOpen ? 'Close main menu' : 'Open main menu'}
			>
				{#if isMenuOpen}
					<svg
						class="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						></path></svg
					>
				{:else}
					<svg
						class="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						></path></svg
					>
				{/if}
			</button>
		</nav>
	</div>
</header>