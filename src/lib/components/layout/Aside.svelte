<script lang="ts">
	import { page } from '$app/state';
	// Data is now `categories` from the root layout server load function.
	let categories = $derived(page.data.categories || []);
</script>

<aside >
	<nav>
		<div class="sidebar-group">
			<a href="/blog" class="sidebar-topic hover:underline">All Posts</a>
		</div>
		
		{#each categories as category (category.name)}
			<div class="sidebar-group">
				<a href="/blog/{category.name}" class="sidebar-topic hover:underline">
					{category.name}
				</a>
				<ul>
					{#each category.articles as article (article.slug)}
						{@const href = `/blog/${article.category}/${article.slug}`}
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