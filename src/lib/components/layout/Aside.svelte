<script lang="ts">
	import { page } from '$app/state';

	// The topics data is now derived directly from the global page state.
	// This makes the component self-sufficient with data it needs from the layout.
	let topics = $derived(page.data.topics || []);
</script>

<aside class="hidden lg:block">
	<nav>
		{#each topics as topic (topic.topic)}
			<div class="sidebar-group">
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
			</div>
		{/each}
	</nav>
</aside>