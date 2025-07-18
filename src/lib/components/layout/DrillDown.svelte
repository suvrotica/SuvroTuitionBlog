<script lang="ts">
	import { page } from '$app/state';
	// The unused `topics` prop is removed. The component now only focuses on headings.
	type Heading = { level: number; id: string; text: string };

	// This component correctly derives its data from the global page state.
	let headings = $derived((page.data.headings as Heading[]) || []);
	const isBlogPost = $derived(page.url.pathname.startsWith('/blog/'));
	let openTopics = $state<Record<string, boolean>>({});

	function toggleTopic(topicName: string) {
		openTopics[topicName] = !openTopics[topicName];
	}

	// This effect logic remains relevant for its conditional rendering
	$effect(() => {
		if (headings.length > 0) return;
		// This logic was already commented out as it belongs in the Aside.
		// It's safe to keep as is, or remove for cleanliness.
	});
</script>

{#if isBlogPost && headings.length > 0}
	<aside class="w-64 flex-shrink-0 lg:block hidden sticky top-8 self-start">
		<h3
			class="mb-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider"
		>
			On This Page
		</h3>
		<nav>
			<ul>
				{#each headings as heading (heading.id)}
					<li class:pl-4={heading.level === 3}>
						<a
							href="#{heading.id}"
							class="block py-1 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
						>
							{heading.text}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</aside>
{/if}