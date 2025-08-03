<script lang="ts">
	import { onMount } from 'svelte';
	import mermaid from 'mermaid';

	let { code }: { code: string } = $props();

	const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;

	let isDarkMode = $state(false);
	let el: HTMLDivElement | undefined = $state();

	const lightTheme = {
		background: '#f5f5f5',
		primaryColor: '#e5e5e5',
		primaryTextColor: '#171717',
		lineColor: '#525252',
		textColor: '#262626'
	};

	const darkTheme = {
		background: '#262626',
		primaryColor: '#404040',
		primaryTextColor: '#f5f5f5',
		lineColor: '#a3a3a3',
		textColor: '#d4d4d4'
	};

	async function renderDiagram() {
		if (!el || !code) return;
		const currentThemeVars = isDarkMode ? darkTheme : lightTheme;
		mermaid.initialize({
			startOnLoad: false,
			theme: 'base',
			themeVariables: {
				...currentThemeVars,
				'--mermaid-font-family': '"Fira Code", monospace'
			}
		});

		try {
			const { svg } = await mermaid.render(`${id}-svg`, code);
			el.innerHTML = svg;
		} catch (e) {
			console.error('Mermaid rendering failed:', e);
			el.innerHTML = 'Error rendering diagram.';
		}
	}

	onMount(() => {
		isDarkMode = document.documentElement.classList.contains('dark');
		renderDiagram();

		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.attributeName === 'class') {
					const newIsDarkMode = document.documentElement.classList.contains('dark');
					if (newIsDarkMode !== isDarkMode) {
						isDarkMode = newIsDarkMode;
						renderDiagram();
					}
				}
			}
		});

		observer.observe(document.documentElement, { attributes: true });

		return () => {
			observer.disconnect();
		};
	});
</script>

{#key `${code}-${isDarkMode}`}
	<div
		bind:this={el}
		{id}
		class="mermaid-diagram p-4 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700"
	>
		<pre><code>{code}</code></pre>
	</div>
{/key}

<style>
	/* 2. The `@apply` directive has been completely removed */
	.mermaid-diagram {
		display: flex;
		justify-content: center;
		margin: 2em 0;
		line-height: 1;
		width: 100%;
	}

	.mermaid-diagram :global(svg) {
		max-width: 100%;
		height: auto;
		color: var(--mermaid-textColor, #262626);
	}
	:global(html.dark) .mermaid-diagram :global(svg) {
		color: var(--mermaid-textColor, #d4d4d4);
	}

	.mermaid-diagram pre {
		display: none;
	}
</style>