---
title : "Art" 
thumbnail : "/images/placeholders/IMG-20250807-WA0003.jpg" 
category : "Art" 
keywords: ["svelte", "sveltekit", "slideshow", "vite", "component"]
published: true
---
<script lang="ts">
    import ImageSlideshow from '$lib/components/blog/ImageSlideshow.svelte';

    // FIX: Use `?url` to get direct image URLs instead of `?enhanced` metadata objects.
    // The `import: 'default'` option ensures we get an array of strings directly.
    const imageModules = import.meta.glob(
        '$lib/assets/slideshow-images/*.{jpg,jpeg,png,webp}', 
        { 
            eager: true, 
            query: '?url',
            import: 'default'
        }
    );

    const imageUrls = Object.values(imageModules);
</script>

**Slideshow**

<ImageSlideshow images={imageUrls} />