<script lang="ts">
	import type { Snippet } from 'svelte';

	// This component accepts four "slots" for content using the snippets feature.
	// 'children' is the default snippet, which we'll use for the main Sanskrit text.
	let {
		children,
		transliteration,
		translation,
		source
	}: {
		children: Snippet; // For the original Sanskrit
		transliteration: Snippet;
		translation: Snippet;
		source?: Snippet; // Source is optional
	} = $props();
</script>

<div class="sanskrit-verse-container not-prose">
	<div class="sanskrit-verse-original">
		{@render children()}
	</div>

	<div class="sanskrit-verse-translit">
		{@render transliteration()}
	</div>

	<blockquote class="sanskrit-verse-translation">
		{@render translation()}
	</blockquote>

	{#if source}
		<p class="sanskrit-verse-source">
			{@render source()}
		</p>
	{/if}
</div>