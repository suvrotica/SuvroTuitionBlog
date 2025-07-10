<script lang="ts">
	import { page } from '$app/state';
	import type { Topic } from '$lib/data/posts';

	let { topics = [] }: { topics: Topic[] } = $props();
</script>

<aside>
	<nav>
		{#each topics as topic (topic.topic)}
			<h3 class="sidebar-topic">{topic.topic}</h3>
			<ul>
				{#each topic.articles as article (article.slug)}
					{@const href = `/blog/${article.slug}`}
					<li>
						<a {href} class:sidebar-link={true} class:sidebar-link-active={page.url.pathname === href}>
							{article.title}
						</a>
					</li>
				{/each}
			</ul>
		{/each}
	</nav>
</aside>
