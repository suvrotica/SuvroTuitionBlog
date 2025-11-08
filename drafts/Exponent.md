---
title: "The Doubling of Calcutta"
date: "2025-07-18"
description: "Using Calcutta's 50-year population doubling period as a case study, this post explores the power of exponential growth. From Malthusian predictions to viral content and pandemics, see how a simple mathematical formula shapes our past, present, and a shockingly crowded future."
category: "Math"
thumbnail: "/images/placeholders/a5nWmIXQTneuGRFUT5fQvg.webp"
keywords: ["exponential growth", "population growth", "Calcutta", "Kolkata", "mathematics", "Malthusian theory", "doubling time", "data visualization", "future projections", "viral growth", "pandemic modeling"]
published: true
---

<script>
    import PopulationProjector from '$lib/components/blog/PopulationProjector.svelte';
    import GoldLine from '$lib/components/GoldLine.svelte';

    import PostBadge from '$lib/components/ui/PostBadge.svelte';
</script>
![An AI-imagined vision of Kolkata 500 years in the future, showcasing extreme urban density.](/images/placeholders/a5nWmIXQTneuGRFUT5fQvg.webp)

Picture the scene. It’s 1975. The world—and a brand-new me—takes his first baby gulp of Calcutta's polluted air. It was a city of glorious, elegant decay and unstoppable life. The grand colonial buildings were shedding plaster like dandruff in the Marxist air, but the streets buzzed with an energy that could power a small nation. The air was a thick soup of diesel from the iconic yellow Ambassador taxis, the sweet tang of sugarcane juice, and the ever-present humidity that feels like a warm, wet hug. The soundtrack was a constant jangling of tram bells, the shouts of vendors, and the gentle creak of the hand-pulled rickshaws.

On that day, I was one soul amongst many. To find Calcutta’s “exponent,” I became a data detective. In 1975, the year of my birth, the population of the Calcutta Urban Agglomeration was hovering around **7.9 million** people.

Now, let’s fast forward through my entire life—all the way to today, July 18th, 2025. As of right now, the estimated population of the Kolkata Metropolitan Area is about **15.8 million** people.

Let's look at those numbers again:
- **1975:** 7.9 million
- **2025:** 15.8 million

Wait a minute. $7.9 \times 2 = 15.8$. This is a coincidence so perfect, it feels scripted. In the 50 years since I was born, the population of my city has almost exactly doubled. Its doubling period—the time it takes to completely replicate its 1975 self—is my lifetime. The most beautiful answer isn’t a tiny decimal point. It’s this: The Doubling Time ($T_{\text{double}}$) is approximately 50 years.

The formula for my city's growth, over the course of my life, looks like this:

$$
P(t) = P_0 \cdot 2^{t/50}
$$

Where $P_0$ is the population at a starting year and $t$ is the number of years since that starting year.

<GoldLine />

**Interactive Population Projection**

The formula above is a powerful tool for modeling growth. The component below uses this exact formula to project the population of various cities 500 years into the future. You can select different cities and change the **doubling period** to see how dramatically this single variable affects the outcome.

<PopulationProjector />

<GoldLine />

**A Glimpse into the Future**

What does this doubling feel like? It means in 2025, for every single person who was waiting for a tram on the Maidan, for every voice in the cacophony of the New Market, for every fan in Eden Gardens back in 1975… there are now two.

If I take this rule—that Kolkata doubles its population every 50 years—and run with it, what happens over the next five centuries? A 500-year projection means we’ll have 10 doubling periods ($500 / 50 = 10$). The formula is my city’s current population multiplied by 2, ten times over, where the new $P_0$ is the population in 2025 (15.8 million):

$$
\text{Future Population} = 15,800,000 \times 2^{10}
$$

Now, $2^{10}$ is a hefty 1024. So, the population of Kolkata in the year 2525 will be:

$$
15,800,000 \times 1024 = 16,179,200,000
$$

That’s **16.2 billion people**. Let that sink in. That’s more than double the current population of the entire Earth, all crammed into one sprawling mega-megalopolis. I imagine the Howrah Bridge will have evolved into a 300-level spaghetti junction of transport tubes. The concept of a “private room” will be a quaint myth; you’ll rent a “personal cubic meter.” It’s a terrifying, yet darkly hilarious, thought.

**The History of a Powerful Idea**

This powerful idea of exponents didn’t just pop out of nowhere. The person who really got the ball rolling was a 16th-century German monk and mathematician named **Michael Stifel**. In his 1544 book *Arithmetica integra*, he systematically laid out the rules for powers and even used the word “exponent.” Ironically, he also famously used his math skills to predict that the world would end at 8 a.m. on October 19, 1533. When it didn’t, his followers were less than pleased. But his work on exponents survived his doomsday blunder and gave us the very language to describe this kind of growth.

But who first applied this tool to the alarming growth of human populations? For that, we turn to the English scholar **Thomas Malthus**. In 1798, he published his *Essay on the Principle of Population*. He was the one who famously pointed out that populations tend to grow exponentially (he called it “geometrically”), while our ability to produce food grows much slower (“arithmetically”). He essentially gave a name to the very panic I feel when I calculate Kolkata having 16.2 billion residents.

**The Personal Exponent**

I am happy to report that while I was 1 in 1975, I am still 1 in 2025, and my contribution to this exponential future is 0. But if a person in Calcutta were to have two children, and those two children, a generation later, each have two of their own, suddenly one data point becomes two, then four, then eight. That is the quiet, inexorable engine of the exponent at work, hidden in the most personal of life's decisions.

Let's do the math: if one person has two children, and this pattern continues for 10 generations over 500 years, the total lineage produced would be **2,046 people**. The last generation alone would consist of **1024 people**, all descended from that initial choice. By stepping aside from this particular equation, I've ended a potential geometric progression—a small, silent act of defiance against the Malthusian curve.

**From Pandemics to Viral Memes**

This exponential logic gives us a tool to understand the frightening speed of a pandemic. During the early days of COVID-19, we all became amateur epidemiologists, anxiously watching the R-number—the average number of people an infected person would pass the virus to. The growth in new cases follows a simple exponential equation:

$$
N_n = N_0 \times R^n
$$

Where $N_0$ is the initial number of cases, $R$ is the reproduction number, and $n$ is the number of generations. An R-value of 3 doesn't just mean three new cases; it means the entire epidemic is on track to triple in size over a single generation of the virus. This is the same mathematical reality that turns a handful of infections into a global crisis.

Now, think of it this way: suppose you share this post's link with just 5 people, and each of them passes it along to 5 more, and so on. In just 10 steps, you’d reach $5^{10} = 9,765,625$—nearly 10 million people. This is **going viral**, another way to look at exponential growth, but instead of babies or viruses, it's ideas that multiply. What begins as one quiet act—a single share—can grow into a digital crowd the size of a metropolis, echoing that same exponential curve that once gave Malthus nightmares.
