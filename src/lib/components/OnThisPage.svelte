<!-- File: src/lib/components/OnThisPage.svelte -->
<script lang="ts">
	type Heading = { level: number; id: string; text: string };
	let { headings = [] }: { headings: Heading[] } = $props();
</script>

{#if headings.length > 0}
	<aside class="on-this-page-container">
		<h3 class="on-this-page-title">On this page</h3>
		<nav>
			<ul>
				{#each headings as heading (heading.id)}
					<li class:on-this-page-h3={heading.level === 3}>
						<a href="#{heading.id}" class="on-this-page-link">
							{heading.text}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</aside>
{/if}
