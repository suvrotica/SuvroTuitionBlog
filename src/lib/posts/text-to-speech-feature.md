---
title: "New Feature: Listen to Posts"
date: "2025-06-22"
description: "Introducing an accessibility feature that uses the Web Speech API to read blog posts aloud, built with Svelte 5."
topic: "SvelteKit"
thumbnail: "/images/placeholders/tts-placeholder.png"
---

<script>
    import TextToSpeech from '$lib/components/blog/TextToSpeech.svelte';
</script>

I'm excited to introduce a new accessibility feature to the blog: a text-to-speech player. Now, you can listen to articles directly in your browser. This functionality is built using the browser's native **Web Speech API** and is seamlessly integrated into the site with a reusable Svelte component.

Below the player, you'll find the content that it will read. The component is designed to find and read the main content of the post, which is wrapped in a container with the ID `#post-content`.

<!-- The TextToSpeech component is placed here -->
<!-- It will look for the #post-content element below and read its text -->
<TextToSpeech contentSelector="#post-content" />

<div id="post-content">

I just want to write what I feel about Svelte and Sveltekit instead of being another pastiche copying their documentation. As you can see, Svelte is like the new slim, handsome, sophisticated young man on the block, as opposed to all the rest, who, by that comparison, all fall into the character of a fat fuck in his declining years strapped to a pension with an unsuitable and unsustainable ecosystem with religious views that, when compared to Svelte, are orthodox and ancient, pernicious even. With svelte you write less and achieve at or above par.  
  
For me, what transcends everything is how straightforward it is for the svelte ecosystem to get a website up and running, that being the simplicity of the simplifications that they have managed and the meaningful industry collaborations. I'll try to go over the details with this very blog as an example so that you can relate to something that's living instead of contrived pretentious and unnatural scenarios.  
  
We all know that, if I use as a metaphor construction of a building (say your house) for example, we are tethered to three pieces of technology in web development: hypertext markup language (HTML), which is the brick and mortar; cascading style sheet (CSS), which is the paint, tiles and all the decorative paraphernalia; and java script (JS), which is the plumbing and electricity to make the metaphorical home livable with running water and lights to switch on. What Svelte does is make this tethering more visible, easier to understand, and knit together to create a website. Svelte is the frontend part of it—what you see on the browser as an user, client or customer, while Sveltekit is the backend—the server which deals with the questions related to dishing out the data that the client wants to consume; together, they're a full-stack (client-server) in one bundle. The word stack alludes to all the layers, the UI, web server, database, operating system and application server. For a developer, at least during the time he is programming an application he is both the "give" (running a development server) as well as the "take" (masquerading as the intended user), and this is just a temporary illusion, the final "give" is from a real server and "take" from the web application (client) running on some sort of browser (broadly user agent) used by people the developer might never meet. The word client is often used to mean the application running or the browser, the machine on which it is running and even sometimes the human sitting in front of the machine.  
  
If you want, think of this architecture as a give-and-take. The sveltekit is the give, and the svelte is the take, and it's a marvelous affair of give and take; it's really that buried under stiff terms and dozens of hard-to-remember acronyms and jargon.  
  
Declarative(what) vs Imperative(how)  

---

  
In this context, I want to talk a little about the what style (declarative) as opposed to the how style (imperative). Declarative style is empowering while imperative crippling.  
  
You know, when you're hungry, you just say, Mom, I want breakfast, and your mom gives you breakfast. This is declarative in that you declare and it is done. Your mom, of course, understands you and cooks the best breakfast for you. She is opinionated, but in the right way.  
  
As opposed to telling a new cook that you hired all the details of how to cook the eggs (I like medium-boiled) or how to butter your toast (soft fresh bread untoasted, sides cut, with a lot of butter), this is the how-style or imperative way.  
  
Svelte is like your mom; it takes care of unnecessary details. You just focus on designing the what-you-want part of your website. You let the Svelte compiler, like your mother, fetch the distilled know-how passed down by generations to do all the complex stuff that you don't need to worry about, like timing and setting the water temperature for the egg, taking the shell out, etcetera, etcetera.  
  
This makes life worth living, I think. If you had to reinvent the wheel every time, life grinds to a screeching and quite boring halt just for stuff that has already been perfected, and I feel this is a programming paradigm that really compels me to want to write better software by letting me focus on the stuff that matters to me or who I am writing the software for.  
  
PS: I use mom instead of a partner because, usually, in partnerships, there's not that spontaneous selflessness that a mother brings. I see this spontaneity in Rich Harris and the volunteers of the svelte open-source community. Cooking becomes a chore in a partnership, or it's an imposition, or barter, or some ulterior motive, which doesn't represent svelte. Anyway, I am divorced; this is really me in my example, and it's bona fide.  

</div>

