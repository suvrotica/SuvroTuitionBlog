---

title : "Binary Operations" 

thumbnail: "/src/lib/assets/slideshow-images/portrait/IMG-PHOTO-ART--1510172753.jpg"

category : "Mathematics" 

---

<script>
    import PostImage from '$lib/components/blog/PostImage.svelte';
    
    import imageSrc from '$lib/assets/slideshow-images/portrait/IMG-PHOTO-ART--1510172753.jpg?url';
    
</script>

<PostImage src={imageSrc} alt="thinking math" />

Picture a set. It could be anything: numbers, people, hats, exotic cheeses, the works. Let’s call it $S$. Now, left to its own devices, $S$ is just a pile of things — dignified, perhaps, but idle. To get anything happening, you need a **product**. The Cartesian product $S \times S$ is a gloriously bureaucratic invention that says, “Right, let’s consider *all* possible ordered couples from $S$.” If $S$ has Alice and Bob, the Cartesian product lists $(\text{Alice},\text{Alice})$, $(\text{Alice},\text{Bob})$, $(\text{Bob},\text{Alice})$, and $(\text{Bob},\text{Bob})$. Every possible pairing, in strict order, no exceptions. This is the mathematician’s way of saying: “What if everyone danced with everyone, including themselves?”

Now, that was with *two* inputs — pairs. There’s nothing stopping you from being more gregarious. You can have $S \times S \times S$, a set of all triples. In that dance hall, people turn up in threes: $(\text{Alice},\text{Bob},\text{Alice})$, $(\text{Bob},\text{Alice},\text{Bob}$, and so on, until you’ve exhausted the possibilities and the floor is a mess of permutations. Similarly, $S \times S \times S \times S$ gives you quadruples, $S^n$ gives you $n$-tuples — mathematicians are shameless about this sort of scaling. Even $S^1$ is allowed, though that’s just $S$ itself, and $S^0$ is the somewhat monastic idea of the “empty tuple,” a lone point representing “no inputs at all.”

Enter **operations**. Once you have your product $S \times S$ (or $S^n$ if you’re feeling frisky), you can define a rule — an *operation* — that says, “Given one of these tuples, I’ll spit out exactly one thing.” That’s crucial: **one** output. It could be a number, a colour, a marmot, but if you’re serious about algebra, it should be something from the same set $S$.

When it’s two inputs from $S$ and one output back into $S$, the thing is called a **binary operation** (or binary composition). For example, addition on integers: $(3,5) \mapsto 8$. If you try to add two integers and end up with a penguin, you’ve broken closure, which is the sacred pact that says *all results must stay in the set*. Without closure, you don’t have a binary operation on $S$, you just have a rogue mapping that goes wandering off into other sets, like a dinner guest who leaves your house and turns up at the neighbours’.

Unary operations are the one-input cousins of binary operations: they take a single element of $S$ and return one element of $S$ — like squaring a number or reversing a string. Ternary operations take three inputs, $S \times S \times S \to S$, and so on. The number of inputs is called the **arity**, which is a fine word to drop into conversations if you want to sound like you own more mathematics textbooks than you actually do.

It is one of history’s odder little accidents that René Descartes’ name is forever chained to the Cartesian product, when the poor man almost certainly never sat down and thought, “I’ll make a set of all possible ordered pairs and call it after myself.” Descartes was too busy in the 17th century trying to weld algebra and geometry into one sleek machine, what we now call coordinate geometry, to be fussing over set-theoretic crossbreeding.

His real contribution was the idea that you could use pairs of numbers to pinpoint locations on a plane, the way a letter and number on a battleship grid tells you where to drop the torpedo. $(x,y)$ was his big move — numbers as addresses. That one idea was so fruitful that, two and a half centuries later, when set theory got going under Cantor and his crowd, mathematicians looked back and said, “Aha! This whole business of ordered pairs deserves a general name.” And since Descartes had been the poster boy for ordered pairs in coordinates, they called the set of all such pairs the Cartesian product. It was a posthumous christening, which makes you wonder how many other mathematical concepts have been pinned on people who never asked for them.

The generalisation came fast and inevitable. If you can list all possible pairs of points, why stop there? You could list all possible triples — which, by the way, Descartes never needed, since he was working in two dimensions most of the time — and quadruples, and $n$-tuples for any $n$ you please. This is why the Cartesian product isn’t just a geometrical tool anymore; it’s the universal raw material for making any finite arity of operation.

Once you’ve got $S \times S$ lying there in all its combinatorial glory, you can define a binary operation. That’s what closure is for — to keep the whole thing in-house. Think of closure as the house rule at a Victorian gentlemen’s club: members may duel, drink, or play billiards as they like, but they must all remain members when the evening ends. No one is permitted to challenge a stranger or drag a barmaid into the fray. Lose closure, and you’re not in the club anymore.

Mathematicians learned long ago that without closure, any theory turns slippery. Imagine defining “addition” on integers, except that $2+2$ gives you “fish curry” Every statement involving addition would be a potential escape hatch into nonsense. Closure gives you the comfort that once you’re inside a set with its operation, the operation can’t eject you into another set mid-thought.

So in a way, Descartes provided the theatre (coordinates, ordered pairs), later mathematicians formalised the seating chart (Cartesian products), and closure made sure the performance always stayed within the same troupe. The binary operation is the play itself — it takes two actors from the cast, hands them a script, and produces a single ending, which might be romantic, tragic, or just arithmetic, but never strays outside the building.




