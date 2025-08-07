---

title : "Art" 

thumbnail : "/images/placeholders/IMG-20250807-WA0003.jpg" 

category : "Art" 

keywords: ["svelte", "sveltekit", "slideshow", "vite", "component"]
published: true
---
<script lang="ts">
    import ImageSlideshow from '$lib/components/blog/ImageSlideshow.svelte';


    const imageModules = import.meta.glob(
        '/static/*.{jpg,jpeg,png,webp}', 
        { 
            eager: true, 
            query: '?url&w&h' 
        }
    );

    
    const imagesWithData = Object.values(imageModules).map((module: any) => ({
        src: module.default.url,
        width: module.default.w,
        height: module.default.h
    }));
    
</script>

**Slideshow**

<ImageSlideshow images={imagesWithData} />





![a1](/images/placeholders/IMG-20250807-WA0003.jpg) 

![a2](/images/placeholders/IMG-20250806-WA0010.jpg) 

![a3](/IMG-20250806-WA0002.jpg) 

![a4](/IMG-20250807-WA0006.jpg) 

![a5](/IMG-20250805-WA0001(1).jpg) 

![a6](/IMG-20250807-WA0010.jpg) 
