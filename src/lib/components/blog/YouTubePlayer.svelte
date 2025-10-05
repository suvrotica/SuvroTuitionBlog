<script lang="ts">
	/**
	 * A responsive YouTube video player component.
	 * It parses a standard YouTube URL and embeds the video in an aspect-ratio-preserving container.
	 */
	let {
		src,
		title,
		caption = '',
		aspectRatio = '16/9'
	}: {
		src: string; // The full YouTube URL (watch or youtu.be)
		title: string; // A descriptive title for accessibility
		caption?: string; // Optional caption displayed below the video
		aspectRatio?: '16/9' | '4/3' | '1/1'; // The video's aspect ratio
	} = $props();

	/**
	 * Parses a YouTube URL to extract the video ID.
	 * Handles standard `youtube.com/watch?v=` links and shortened `youtu.be/` links.
	 * @param url The YouTube URL string.
	 * @returns The 11-character video ID or null if not found.
	 */
	function parseYouTubeId(url: string): string | null {
		// This regex is designed to capture the 11-character ID from various YouTube URL formats.
		const regex =
			/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
		const match = url.match(regex);
		return match ? match[1] : null;
	}

	// A derived rune that computes the embeddable URL whenever the `src` prop changes.
	let embedSrc = $derived.by(() => {
		const videoId = parseYouTubeId(src);
		if (videoId) {
			// Constructs the privacy-enhanced embed URL.
			return `https://www.youtube-nocookie.com/embed/${videoId}`;
		}
		return null; // Return null for invalid URLs.
	});
</script>

{#if embedSrc}
	<figure class="youtube-player-container not-prose">
		<div class="youtube-player-wrapper" style:aspect-ratio={aspectRatio}>
			<iframe
				class="youtube-player-iframe"
				src={embedSrc}
				{title}
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowfullscreen
			></iframe>
		</div>
		{#if caption}
			<figcaption class="youtube-player-caption">{caption}</figcaption>
		{/if}
	</figure>
{:else}
	<div class="interactive-component-wrapper not-prose text-center text-red-500">
		<p>Invalid YouTube URL provided: {src}</p>
	</div>
{/if}