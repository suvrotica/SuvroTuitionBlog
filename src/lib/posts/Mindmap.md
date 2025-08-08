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

**Programming Paradigms**  
Colored by branch point with Mermaid’s classDefs and class assignments:

<Mermaid code={`mindmap
    Programming Paradigms
        Imperative: Explicit step-by-step instructions
            Procedural: Organized into procedures/functions (C, Pascal)
            Object-Oriented: Objects combine data+methods (Java, Python)
                Class-Based: Objects from classes (Java, C++)
                Prototype-Based: Objects from other objects (JavaScript, Lua)
            Parallel/Concurrent: Multiple tasks at once (Go, Erlang)
            Event-Driven: Respond to events/triggers (JavaScript, Node.js)
        Declarative: State what you want, not how to get it
            Functional: Pure functions, no state changes (Haskell, Lisp)
                Pure Functional: No side effects (Haskell)
                Lazy Evaluation: Compute only when needed (Haskell)
                Strict Evaluation: Compute immediately (OCaml)
            Logic: Rules and facts, inference (Prolog)
            Constraint: Satisfy constraints, find solutions (MiniZinc)
            Dataflow: Computation as data moving through graph (LabVIEW)
            Reactive: Values update when dependencies change (RxJS)
    class Imperative,Procedural,Object-Oriented,Parallel/Concurrent,Event-Driven imperativeBranch;
    class Declarative,Functional,Logic,Constraint,Dataflow,Reactive declarativeBranch;
    class Class-Based,Prototype-Based oopBranch;
    class Pure Functional,Lazy Evaluation,Strict Evaluation functionalBranch;
    classDef imperativeBranch stroke:#d6336c,stroke-width:2px;
    classDef declarativeBranch stroke:#198754,stroke-width:2px;
    classDef oopBranch stroke:#0d6efd,stroke-width:2px,dasharray: 5 3;
    classDef functionalBranch stroke:#f59f00,stroke-width:2px,dasharray: 2 2;
`} />

**Software Evolution**  
The conceptual evolution from Software 1.0 through 3.0, with color-coded main branches:

<Mermaid code={`mindmap
    Software Evolution
        Software 1.0: Traditional Explicit Code
            Imperative: Step-by-step commands
            Procedural: Functions and procedures
            Declarative: What, not how
            Object-Oriented: Objects combining data and behavior
            Functional: Pure functions and immutability
            Logic: Rules and inference
        Software 2.0: Learned / Trained Models (ML)
            Supervised Learning: Learn from labeled data
            Unsupervised Learning: Discover patterns without labels
            Reinforcement Learning: Learn by interaction and reward
            Deep Learning: Multi-layer neural networks
            Probabilistic Models: Model uncertainty
            Feature Engineering: Manual data transformations
            Transfer Learning: Reuse learned features
            AutoML: Automated model selection and tuning
        Software 3.0: Prompting, Generative AI, LLMs
            Prompt Engineering: Designing inputs for models
            Few-shot Learning: Learning from few examples
            Zero-shot Learning: Generalizing without examples
            Program Synthesis: Generating code from specs or prompts
            Self-modifying Code: Code that adapts or rewrites itself
            Interactive Natural Language Interfaces: Conversing with AI to get software behaviors
            Meta-Learning: Learning how to learn
            Generative AI Models: Models creating content or code
            Human-in-the-Loop Programming: Collaborative human+AI development
            Differentiable Programming: Programs with gradients for optimization
            Conversational Agents: AI assistants driving tasks
            Code Completion and Generation: AI-generated code snippets
            Knowledge Graph Integration: Semantic context for AI understanding
    class "Software 1.0: Traditional Explicit Code",Imperative,Procedural,Declarative,Object-Oriented,Functional,Logic s1Branch;
    class "Software 2.0: Learned / Trained Models (ML)",Supervised Learning,Unsupervised Learning,Reinforcement Learning,Deep Learning,Probabilistic Models,Feature Engineering,Transfer Learning,AutoML s2Branch;
    class "Software 3.0: Prompting, Generative AI, LLMs",Prompt Engineering,Few-shot Learning,Zero-shot Learning,Program Synthesis,Self-modifying Code,Interactive Natural Language Interfaces,Meta-Learning,Generative AI Models,Human-in-the-Loop Programming,Differentiable Programming,Conversational Agents,Code Completion and Generation,Knowledge Graph Integration s3Branch;
    classDef s1Branch stroke:#6f42c1,stroke-width:2px;
    classDef s2Branch stroke:#d6336c,stroke-width:2px;
    classDef s3Branch stroke:#0d6efd,stroke-width:2px;
`} />

