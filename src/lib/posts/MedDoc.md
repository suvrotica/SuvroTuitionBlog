---

title : "Medical Documentaries" 

thumbnail : "/src/lib/assets/slideshow-images/portrait/IMG-20251009-WA0006.jpg"

date: "2025-10-11"

category : "Audio Video" 

published : true

tags: ["Medical Documentaries" ]


---

<script>
    import PostImage from '$lib/components/blog/PostImage.svelte';
    import imageSrc1 from '$lib/assets/slideshow-images/portrait/IMG-20251009-WA0006.jpg?url';
   import Ytp from '$lib/components/blog/YouTubePlayer.svelte';
</script> 
    

<PostImage src={imageSrc1} alt="skull" />

<Ytp src="https://youtu.be/mfqKS5trngs?si=6y52sOoRt8Qejd1-" />

