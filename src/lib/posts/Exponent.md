---

title: "On Exponential Growth and Calcutta"

date: "2025-07-18"

description: "A terrifying look at the population of Calcutta mathematically projected 500 years from now, using a personal-life-based doubling constant."

topic: "Food & Science"

thumbnail: "/images/placeholders/IMG-20250718-WA0001.jpg"

---
![An AI-imagined vision of Kolkata 500 years in the future, showcasing extreme urban density.](/images/placeholders/IMG-20250718-WA0001.jpg)
Picture the scene. It’s 1975. The world—and a brand-new me—takes his first baby gulp of Calcutta's polluted air. It was a city of glorious, elegant decay and unstoppable life. The grand colonial buildings were shedding plaster like dandruff in the Marxist air, but the streets buzzed with an energy that could power a small nation. The air was a thick soup of diesel from the iconic yellow Ambassador taxis, the sweet tang of sugarcane juice, and the ever-present humidity that feels like a warm, wet hug. The soundtrack was a constant jangling of tram bells, the shouts of vendors, and the gentle creak of the hand-pulled rickshaws.

On that day, I was one soul amongst many. To find Calcutta’s “exponent,” I became a data detective. In 1975, the year of my birth, the population of the Calcutta Urban Agglomeration was hovering around **7.9 million** people. Now, let’s fast forward through my entire life—all the way to today, July 18th, 2025. As of right now, the estimated population of the Kolkata Metropolitan Area is about **15.8 million** people.

Let's look at those numbers again:

- **1975:** 7.9 million

- **2025:** 15.8 million

Wait a minute. $7.9 \times 2 = 15.8$.

This is a coincidence so perfect, it feels scripted. In the 50 years since I was born, the population of my city has almost exactly doubled. Its doubling period—the time it takes to completely replicate its 1975 self—is my lifetime. So, what is Calcutta’s exponent? The most beautiful answer isn’t a tiny decimal point. It’s this: The Doubling Time ($T_{\text{double}}$) is approximately 50 years.

The formula for my city's growth, over the course of my life, looks like this:
$$

P(t) = P_0 \cdot 2^{t/50}

$$

Where $P_0$ is the population at a starting year and $t$ is the number of years since that starting year. What does this doubling feel like? It means in 2025, for every single person who was waiting for a tram on the Maidan, for every voice in the cacophony of the New Market, for every fan in Eden Gardens back in 1975… there are now two.

If I take this rule—that Kolkata doubles its population every 50 years—and run with it, what happens over the next five centuries from 2025? A 500-year projection means we’ll have 10 doubling periods ($500 / 50 = 10$). The formula is my city’s current population multiplied by 2, ten times over:

Where the new $P_0$ is the population in 2025 (15.8 million)
$$

\text{Future Population} = 15,800,000 \times 2^{10}

$$
Now, $2^{10}$ is a hefty 1024. So, the population of Kolkata in the year 2525 will be:
$$

15,800,000 \times 1024 = 16,179,200,000

$$
That’s **16.2 billion people**.

Let that sink in. That’s more than double the current population of the entire Earth, all crammed into one sprawling mega-megalopolis. I imagine the Howrah Bridge will have evolved into a 300-level spaghetti junction of transport tubes. The concept of a “private room” will be a quaint myth; you’ll rent a “personal cubic meter.” It’s a terrifying, yet darkly hilarious, thought.

This powerful idea of exponents didn’t just pop out of nowhere. The person who really got the ball rolling was a 16th-century German monk and mathematician named **Michael Stifel**. In his 1544 book *Arithmetica integra*, he systematically laid out the rules for powers and even used the word “exponent.” Ironically, he also famously used his math skills to predict that the world would end at 8 a.m. on October 19, 1533. When it didn’t, his followers were less than pleased. But his work on exponents survived his doomsday blunder and gave us the very language to describe this kind of growth.

But who first applied this tool to the alarming growth of human populations? For that, we turn to the English scholar **Thomas Malthus**. In 1798, he published his *Essay on the Principle of Population*. He was the one who famously pointed out that populations tend to grow exponentially (he called it “geometrically”), while our ability to produce food grows much slower (“arithmetically”). He predicted this mismatch would inevitably lead to what’s now called a “Malthusian catastrophe.” He essentially gave a name to the very panic I feel when I calculate Kolkata having 16.2 billion residents.

It seems I’m not the first person to use exponents to give myself a headache about overcrowding. Stifel gave us the “how,” and Malthus gave us the “Oh, dear.” But I am happy to report I was 1 in 1975, I am still 1, and the descent contribution to the future in this exponential from me is 0. But normally if a person in 2025 in Calcutta were to birth 2 children, and those two children, a generation later, each have two of their own, suddenly one data point becomes two, then four, then eight. That is the quiet, inexorable engine of the exponent at work, hidden in the most personal of life's decisions. By stepping aside from this particular equation, I've ended a potential geometric progression—a small, silent act of defiance against the Malthusian curve.

The problem describes a geometric progression where each new generation is twice the size of the previous one.

**Number of Generations:** The timeframe is 500 years. With a new generation every 50 years, this results in **10 generations** of descendants. ($500 \div 50 = 10$).

**Descendants per Generation:** The number of new people in each generation follows the pattern $2^n$:
    * **Generation 1 (Year 2075):** $2^1 = 2$ children
    * **Generation 2 (Year 2125):** $2^2 = 4$ grandchildren
    * **Generation 3 (Year 2175):** $2^3 = 8$ great-grandchildren
    * ...and so on, up to the 10th generation.

**Total Descendants:** To find the total number of people produced, we sum the number of descendants from all 10 generations. This is the sum of a geometric series:

    $$\sum_{n=1}^{10} 2^n = 2 + 4 + 8 + 16 + 32 + 64 + 128 + 256 + 512 + 1024 = 2046$$

So, the total lineage produced by that one person's one child over 500 years would be **2,046 people**. Two produces twice that or **4,092 people**. Counting the original person and his 2 children from which these people descended the total amount of people is **4,095 of that family**

Thankfully not all of them will be around (although by then longevity research may have changed all that), but the last generation 500 years from now—is frightening **2048 people** from just one person with two kids today.

This exponential logic gives us a tool to understand the frightening speed of a pandemic. During the early days of COVID-19, we all became amateur epidemiologists, anxiously watching the R-number—the average number of people an infected person would pass the virus to. This R-number is the direct driver of the doubling time. An R-value of 3 doesn't just mean three new cases; it means the entire epidemic is on track to triple in size over a single generation of the virus. When we saw case counts doubling every few days, we were witnessing the same mathematical reality in real-time: a simple exponent turning a handful of infections into a global crisis. The Malthusian panic I felt imagining a future Kolkata was the same anxiety the world felt watching the case counts climb that vertical curve.

The growth in new cases per viral generation can be modeled with a simple exponential equation:

$$N_n = N_0 \times R^n$$

Where:
* $N_n$ = The number of new cases in a specific generation `n`.
* $N_0$ = The initial number of cases.
* $R$ = The reproduction number.
* $n$ = The number of generations that have passed.

Let's imagine a scenario at the start of an outbreak:
* We start with **10** initial cases ($N_0 = 10$).
* The R-number is **3** ($R = 3$).
* A viral generation (the time from one person getting infected to them infecting the next) is **5 days**.

Using the equation, the spread of new infections would look like this:

* **Day 0 (Gen 0):** Starts with 10 cases.
* **Day 5 (Gen 1):** $10 \times 3^1 = 30$ new cases.
* **Day 10 (Gen 2):** $10 \times 3^2 = 90$ new cases.
* **Day 15 (Gen 3):** $10 \times 3^3 = 270$ new cases.
* **Day 20 (Gen 4):** $10 \times 3^4 = 810$ new cases.

In just 20 days, the number of new infections generated in a single 5-day period has grown from 10 to over 800, powerfully demonstrating how an R-number above 1 drives explosive, exponential growth. This is why a high reproduction number is so deadly.

Now, imagine applying this to a single superspreader event. Go back to the same equation ($N_n = N_0 \times R^n$), but substitute a much larger R-number from a single act, like an uncovered sneeze in a packed Calcutta metro train. In that dense environment, you might not infect just three people; your personal R-number for that moment could be 20.

Starting with just yourself ($N_0 = 1$), the first generation of new cases would be:

$$N_1 = 1 \times 20^1 = 20$$

From a single person, 20 new branches of the infection tree are instantly created. Even if those 20 people then return to less crowded environments and spread the virus at the normal rate, the epidemic has already made a catastrophic leap forward, fueled by one moment of high transmission. This is the terrifying power of the R-number: it's not just an average, but a measure of potential that can be devastatingly realized in the right conditions.
