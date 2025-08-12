---

title : "My first statistics post" 

thumbnail : "/src/lib/assets/slideshow-images/portrait/IMG-20250805-WA0001.jpg" 

tags: ["blog", "mathematics", "statistics"]

summary: "Introducing the word `statistics`"

category : "Statistics" 

date: "2025-08-12"

---

<script>
    import PostImage from '$lib/components/blog/PostImage.svelte';
    import imageSrc1 from '$lib/assets/slideshow-images/portrait/IMG-20250805-WA0001.jpg?url';
    
    
</script>

<PostImage src={imageSrc1} alt="spitting statistics" />

My first post on statistics won’t start with the standard formalities—you know, the solemn “Statistics is the science of…” opening that feels like it was last dusted off in 1954. Instead, I’ll just say that most of us—myself included—were introduced to statistics by people who made it about as inviting as a tax audit. Which is a shame, because when you scrape off the crust, it’s actually quite fascinating.

In the beginning, statistics wasn’t about chi-squared tests or bell curves. It was literally about counting things for kings. The word comes from the German *Statistik*, which Gottfried Achenwall coined in the 18th century to mean “stuff about the state”—as in, “Your Majesty, we have 18,492 adult males fit for service, 4,110 barrels of grain, and three sheep that don’t look entirely well.” This migrated into English, most famously in Sir John Sinclair’s *Statistical Account of Scotland*, which was essentially a national selfie in table form. It was all about whole populations—complete counts—because that’s what rulers wanted.

Then, in the 19th century, mathematicians like Galton and Pearson came along and ruined the perfect headcount by not bothering to count everyone. Instead, they took samples—bits of the population—and calculated numbers from them. These little computed values needed their own name, so the singular “statistic” popped up around 1852 to mean “one of those numbers you actually work out from your data.” Meanwhile, the “parameter” became the imagined, perfect number for the entire population—something you could never know but pretended existed anyway.

Now, here’s the catch. Let’s say we have the maths scores for a class in North Calcutta—Suvro, Amrita, Chandrima, Arindam, Ganguly, and so on. If I turn all their marks into one number—the average—I’ve committed a statistical fib. Suppose five students scored 80, 70, 60, 88, and 90. The average is 77.6, a number no one in the room actually got. But it’s a useful fib, because it lets us say “They’re all doing pretty well” without having to remember each score.

The fib gets more mischievous when the class is uneven. Two kids get 40 and 49, the rest score 99, 100, and 100. The average? Still 77.6. Now that single number is hiding a gaping canyon between the high-flyers and the struggling. In cases like this, the mean is the wrong tool—we need something that captures the spread, like a median or standard deviation, or even a plot of the scores so we can see what’s going on.

And that’s the first thing worth knowing: statistics isn’t about truth carved in stone. It’s about constructing useful, bite-sized lies—clever compressions of reality that help us make sense of a messy world. Just remember: the lie is in the simplification, and it’s only harmless as long as you know what’s missing.


