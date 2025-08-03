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

**Markdown & Icons**
Yes, you can style the text. Because your ideas have feelings, and some of them are bold. Some are *softly italicized*. Some come with bling.

But a word of caution: GitHub might look at your fancy Font Awesome icon and say, “Nice try, nerd.” So if you're publishing on platforms that don’t support external icon libraries, don’t be surprised when your fancy `::icon(fa fa-brain)` renders as the digital equivalent of a shrug.

Still, here's how it looks if your setup supports it:

<Mermaid code={`mindmap
    Brainstorm         **Strong thought**
        *Fleeting notion*         ::icon(fa fa-lightbulb)         ::icon(mdi mdi-coffee)`} />

And now, for the final flourish: you want your mindmap to look like your thoughts at 2am during Durga Puja? With the color sense of Kolkata neon and the logic of a late-night adda? Knock yourself out:

<Mermaid code={`mindmap
    Idea Factory
        Creativity
            Subconscious
                Dreams
        Doubt
            Impostor Syndrome
                Late-stage Panic
    style Idea Factory fill:#d97706,stroke:#78350f,color:#fef3c7
    style Creativity fill:#a3e635,stroke:#4d7c0f,color:#1a2e05
    style Doubt fill:#fca5a5,stroke:#b91c1c,color:#7f1d1d
    style Impostor Syndrome fill:#f87171,stroke:#991b1b,color:#fff`} />

No one's stopping you from making your inner chaos visible. Just remember: the mindmap is a mirror. Use it wisely, or risk staring into the abyss of your own to-do list.
