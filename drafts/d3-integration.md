---
title: "Integrating D3.js with Svelte"
date: "2025-06-22"
description: "A practical guide to combining the power of D3.js for data visualization with the reactive and component-based architecture of Svelte 5."
topic: "3D & WebGL"
published: false

thumbnail: "/images/placeholders/d3-placeholder.jpeg"
---

<script>
    import D3Circle from '$lib/components/D3/D3Circle.svelte';
    import GoldLine from '$lib/components/GoldLine.svelte';
</script>

## Why D3.js with Svelte?

[D3.js](https://d3js.org/) is an incredibly powerful library for creating data-driven documents. It gives you fine-grained control over the DOM, allowing you to create complex and beautiful data visualizations. Svelte, on the other hand, excels at managing the DOM and state in a highly efficient, reactive way.

Combining them seems like a perfect match: Svelte manages the component's state and structure, while D3 handles the complex parts of the visualization that are data-dependent.

<GoldLine />

### A Simple Example

Let's start with a basic example. We'll create a Svelte component that uses D3 to draw and animate a simple circle inside an SVG element. The component below is fully self-contained. It uses Svelte's `$state` for reactive properties and the `$effect` rune to interact with the DOM via D3 when those properties change.

This approach lets Svelte handle when to re-run the D3 code, keeping our logic clean and declarative.

<D3Circle />

The code for the component above looks something like this:

```typescript
// src/lib/components/blog/D3Circle.svelte
import { select } from 'd3-selection';
import 'd3-transition';

let svgEl: SVGElement | undefined = $state();

let cx = $state(50);
let fill = $state('#D4AF47');

$effect(() => {
    if (svgEl) {
        const svg = select(svgEl);
        const circle = svg.selectAll('circle').data([null]);
        const circleEnter = circle.enter().append('circle')
            .attr('r', 20)
            .attr('cy', 50);

        circle.merge(circleEnter)
            .transition()
            .duration(750)
            .attr('cx', cx)
            .attr('fill', fill);
    }
});