---

title: "Mindmaps"

thumbnail: "/images/placeholders/IMG-20250803-WA0003.jpg"

category: "Technology"

---

<script>
    import Mermaid from '$lib/components/blog/Mermaid.svelte';

    import PostBadge from '$lib/components/ui/PostBadge.svelte';
</script>

![mindmap](/images/placeholders/IMG-20250803-WA0003.jpg) 

They say the shortest distance between two points is a straight line. That’s why we invented flowcharts. But then some bright spark decided that maybe, just maybe, the human brain doesn't think in straight lines. It meanders. It loops. It free-associates like a stand-up comic on mushrooms. Enter: the mindmap.

A mindmap is what happens when a flowchart eats a thesaurus, grows tentacles, and starts talking about its feelings. It’s the tool for when your thoughts aren’t a pipeline but a party. Everyone’s invited. Ideas, doubts, distractions, regrets, that one memory from third grade—come on in.

Now let’s get down to the technicalities.

**Definition**
At its core, a mindmap in Mermaid is just a nested list. That’s it. Indentation is your master. Indentation is your god. If you can indent a paragraph in Microsoft Word without throwing your computer out the window, you can write a mindmap.

<Mermaid code={`mindmap
    Me, trying to focus
        A brilliant idea
            Wait, does this already exist?
                Existential panic
        Another idea
            Better than the last one?
            Where's my coffee?
        The original idea again
            No longer feels original`} />


Each node here is a thought, a neuron firing in the dark. “Me, trying to focus” is the root, and every child node is another mental browser tab you forgot to close.

**Shapes**
You like boxes? You like clouds? You want your thoughts shaped like a hexagon because you're feeling spicy? Good news.

<Mermaid code={`mindmap
    My Mood Today         [Just a square]
        (A little rounded)
        ((Trapped in a circle))
        ))POW! Bang! Zap!(( 
        )Daydream cloud(
        {{Hexagone à la française}}`} />

Use square brackets for squares, parentheses for rounded ones, double parens for circles, double outside-in parens for “Batman comic shout,” and curly braces for hexagons. You are now styling your thoughts. You are now a thought stylist.