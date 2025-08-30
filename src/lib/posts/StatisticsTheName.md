---

title : "My first statistics post" 

description: "Introducing the word `statistics`"

thumbnail : "/src/lib/assets/slideshow-images/portrait/IMG-20250812-WA0001.jpg" 

tags: ["blog", "mathematics", "statistics"]


category : "Statistics" 

date: "2025-08-31"

published: true

---

<script>
    import PostImage from '$lib/components/blog/PostImage.svelte';
    import imageSrc1 from '$lib/assets/slideshow-images/portrait/IMG-20250812-WA0001.jpg?url';
    import imageSrc2 from '$lib/assets/slideshow-images/portrait/8b1b52a9-fa9a-4f03-8686-d863f5dff48f.png?url';
    
</script>

<PostImage src={imageSrc1} alt="spitting statistics" />

My first post on statistics won’t start with the standard formalities—you know, the solemn “Statistics is the science of…” opening that feels like it was last dusted off in 1954. Instead, I’ll just say that most of us—myself included—were introduced to statistics by people who made it about as inviting as a tax audit. Which is a shame, because when you scrape off the crust, it’s actually quite fascinating.

In the beginning, statistics wasn’t about chi-squared tests or bell curves. It was literally about counting things for kings. The word comes from the German *Statistik*, which Gottfried Achenwall coined in the 18th century to mean “stuff about the state”—as in, “Your Majesty, we have 18,492 adult males fit for service, 4,110 barrels of grain, and three sheep that don’t look entirely well.” This migrated into English, most famously in Sir John Sinclair’s *Statistical Account of Scotland*, which was essentially a national selfie in table form. It was all about whole populations—complete counts—because that’s what rulers wanted.

<PostImage src={imageSrc2} alt="king" />

Then, in the 19th century, mathematicians like Galton and Pearson came along and ruined the perfect headcount by not bothering to count everyone. Instead, they took samples—bits of the population—and calculated numbers from them. These little computed values needed their own name, so the singular “statistic” popped up around 1852 to mean “one of those numbers you actually work out from your data.” Meanwhile, the “parameter” became the imagined, perfect number for the entire population—something you could never know but pretended existed anyway.

Now, here’s the catch. Let’s say we have the maths scores for a class in North Calcutta—Suvro, Amrita, Chandrima, Arindam, Ganguly, and so on. If I turn all their marks into one number—the average—I’ve committed a statistical fib. Suppose five students scored 80, 70, 60, 88, and 90. The average is 77.6, a number no one in the room actually got. But it’s a useful fib, because it lets us say “They’re all doing pretty well” without having to remember each score.

The fib gets more mischievous when the class is uneven. Two kids get 40 and 49, the rest score 99, 100, and 100. The average? Still 77.6. Now that single number is hiding a gaping canyon between the high-flyers and the struggling. In cases like this, the mean is the wrong tool—we need something that captures the spread, like a median or standard deviation, or even a plot of the scores so we can see what’s going on.

And that’s the first thing worth knowing: statistics isn’t about truth carved in stone. It’s about constructing useful, bite-sized lies—clever compressions of reality that help us make sense of a messy world. Just remember: the lie is in the simplification, and it’s only harmless as long as you know what’s missing.

I think the deeper personal cognitive dissonance is impossible to avoid because we cannot at least raise our own experience at the physical or sensation level to that of many people, I will always be in my own skull slave to the numericity of one, the group mathematics even if there’s an area in the brain to compute it is, is at a literal level of counting, of amounts, more of one group vs another say, but doesn’t have inbuilt evolutionary imperative for subtlety like specific distribution of characteristics of a group—like how many are slightly below average, how many are extreme outliers, how tightly clustered most of them are. Our intuitive machinery deals in coarse contrasts, in more versus less, in friend versus stranger, but not in variance, skewness, or multimodality. Which is precisely why statistics feels so alien: it is a prosthesis for a kind of perception we never evolved, a way of holding in one glance the shape of many minds, many scores, many lives, compressed into abstractions that no single nervous system was built to grasp.

