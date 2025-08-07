---

title : "Art" 

thumbnail : "/images/placeholders/IMG-20250807-WA0003.jpg" 

category : "Art" 

keywords: ["svelte", "sveltekit", "slideshow", "vite", "component"]
published: true
---

<script lang="ts">
    import ImageSlideshow from '$lib/components/blog/ImageSlideshow.svelte';

    // 1. Use Vite's import.meta.glob to find all image files in the new directory.
    //    'eager: true' imports the modules directly.
    const imageModules = import.meta.glob('/*.{jpg,jpeg,png,webp}', { eager: true });

    // 2. Extract the default export (the URL path) from each module.
    const imageUrls = Object.values(imageModules).map((module: any) => module.default);
</script>

## Embedded Slideshow

Here is a live demonstration of the slideshow component. It automatically finds and displays all images from the `src/lib/assets/slideshow-images` directory, animating them with a smooth cross-fade effect. This method is highly efficient as Vite handles the asset bundling at build time.

<ImageSlideshow images={imageUrls} />

### How It Works

The `<script>` block in this post uses `import.meta.glob`, a Vite feature, to create a list of all images in the specified folder. This list is then passed as the `images` prop to our reusable `ImageSlideshow` component. It's a clean, powerful pattern for handling collections of static assets within a SvelteKit project.



![a1](/images/placeholders/IMG-20250807-WA0003.jpg) 

![a2](/images/placeholders/IMG-20250806-WA0010.jpg) 

![a3](/IMG-20250806-WA0002.jpg) 

![a4](/IMG-20250807-WA0006.jpg) 

![a5](/IMG-20250805-WA0001(1).jpg) 

![a6](/IMG-20250807-WA0010.jpg) 
