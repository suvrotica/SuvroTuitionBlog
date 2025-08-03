<script lang="ts">
	import type { ClassValue } from 'svelte/elements';

	/**
	 * A decorative badge component that links to another post.
	 * It opens the link in a new browser tab.
	 */
	let {
		title, // The text to display on the badge
		href, // The URL the badge should link to
		standalone = false, // If true, applies default block/margin/centering styles
		class: className = '' // Accept an optional 'class' prop, aliased to className
	}: {
		title: string;
		href: string;
		standalone?: boolean;
		class?: ClassValue;
	} = $props();
</script>

<a
	{href}
	target="_blank"
	rel="noopener noreferrer"
	class={[
		'post-badge',
		standalone && 'block my-8 mx-auto w-fit',
		className
	]}
>
	<span>{title}</span>
</a>