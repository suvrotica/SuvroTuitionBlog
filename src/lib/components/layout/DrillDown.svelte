<!-- src/lib/components/layout/ObsidianDrillDown.svelte -->
<script lang="ts">
	import { page } from '$app/state';
	import type { Topic } from '../../../routes/+layout.server';

	// Define the props for the component using Svelte 5 syntax
	let { topics = [] }: { topics: Topic[] } = $props();
	type Heading = { level: number; id: string; text: string };

	// Derive headings from the global page store.
	// This makes the component context-aware.
	let headings = $derived((page.data.headings as Heading[]) || []);
	
	// NEW: Determine if the current page is a blog post.
	const isBlogPost = $derived(page.url.pathname.startsWith('/blog/'));

	// Use $state for reactive state management of open/closed topics
	let openTopics = $state<Record<string, boolean>>({});

	// Function to toggle the visibility of articles under a topic
	function toggleTopic(topicName: string) {
		openTopics[topicName] = !openTopics[topicName];
	}

	// Initialize topics to be open if they contain the currently active page
	$effect(() => {
		// This logic should only run when we are displaying topics, not page headings.
		if (headings.length > 0) return;

		const newOpenTopics: Record<string, boolean> = {};
		for (const topic of topics) {
			if (topic.articles.some((article) => page.url.pathname === `/blog/${article.slug}`)) {
				newOpenTopics[topic.topic] = true;
			}
		}
		// Only update if there's a change to avoid infinite loops
		if (JSON.stringify(openTopics) !== JSON.stringify(newOpenTopics)) {
			// Merge with existing state to preserve user's manual toggles
			Object.assign(openTopics, newOpenTopics);
		}
	});
</script>

<!-- NEW: The entire component is now wrapped in a conditional block -->
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
