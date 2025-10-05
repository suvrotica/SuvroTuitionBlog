<script lang="ts">
	/**
	 * A responsive YouTube video player component.
	 * It intelligently handles URLs for single videos, playlists, or videos within a playlist.
	 */
	let {
		src,
		title = 'Embedded YouTube video', // Default title for accessibility
		caption = '',
		aspectRatio = '16/9'
	}: {
		src: string; // The full YouTube URL (video or playlist)
		title?: string; // A descriptive title for accessibility
		caption?: string; // Optional caption displayed below the video
		aspectRatio?: '16/9' | '4/3' | '1/1'; // The video's aspect ratio
	} = $props();

	/**
	 * Parses a YouTube URL to extract the video ID.
	 * @param url The YouTube URL string.
	 * @returns The 11-character video ID or null if not found.
	 */
	function parseYouTubeId(url: string): string | null {
		const regex =
			/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
		const match = url.match(regex);
		return match ? match[1] : null;
	}

	// NEW: A function to parse a YouTube URL to extract the playlist ID.
	/**
	 * Parses a YouTube URL to extract the playlist ID.
	 * @param url The YouTube URL string.
	 * @returns The playlist ID or null if not found.
	 */
	function parseYouTubePlaylistId(url: string): string | null {
		// This regex looks for the `list=` query parameter.
		const regex = /[?&]list=([^"&?/\s]+)/;
		const match = url.match(regex);
		return match ? match[1] : null;
	}

	// UPDATED: The derived logic is now smarter to handle playlists.
	let embedSrc = $derived.by(() => {
		const videoId = parseYouTubeId(src);
		const playlistId = parseYouTubePlaylistId(src);

		if (playlistId) {
			if (videoId) {
				// Case 1: URL has both a video and a playlist (e.g., watching a video in a playlist context)
				// We embed the specific video but tell the player about the whole list.
				return `https://www.youtube-nocookie.com/embed/${videoId}?list=${playlistId}`;
			} else {
				// Case 2: URL is for a playlist directly (no specific video ID)
				// We use the special 'videoseries' keyword to start the playlist.
				return `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}`;
			}
		} else if (videoId) {
			// Case 3: URL is for a single video only
			return `https://www.youtube-nocookie.com/embed/${videoId}`;
		}

		// Case 4: Neither a valid video nor playlist ID was found.
		return null;
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
