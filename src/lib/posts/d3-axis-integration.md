---
title: "Charting with D3 Axes in Svelte"
date: "2025-07-23"
description: "A guide to creating reusable D3.js axes within a Svelte 5 component for clear and effective data visualization."
topic: "3D & WebGL"
published: false

thumbnail: "/images/placeholders/d3-placeholder.jpeg"
---

<script>
    import D3Axis from '$lib/components/D3/D3Axis.svelte';
    import GoldLine from '$lib/components/GoldLine.svelte';
</script>

## Why Build Axis Components?

When creating data visualizations, axes are fundamental. They provide the context and scale needed to understand the data. D3.js offers powerful and highly configurable axis generators like `axisBottom` and `axisLeft`. By encapsulating this logic within a Svelte component, we can create reusable, declarative charts that fit perfectly into our SvelteKit application.

<GoldLine />

### A Reusable Axis Example

The component below demonstrates a basic chart setup. It uses D3 to create linear scales for the X and Y dimensions and then renders the corresponding axes. The entire visualization is contained within a Svelte component, making it easy to drop into any page.

<D3Axis />

<GoldLine />

### The Svelte Component Code

The component's script handles all the D3 logic. Using the `$effect` rune, we ensure the D3 code runs only after the SVG element has been mounted in the DOM. This keeps our D3 manipulations cleanly separated from Svelte's declarative structure.

```typescript
// src/lib/components/D3/D3Axis.svelte
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';

let svgEl: SVGElement | undefined = $state();

$effect(() => {
    if (svgEl) {
        const svg = select(svgEl);

        const margin = { top: 20, right: 30, bottom: 40, left: 50 };
        const width = 500 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        svg.selectAll('*').remove();

        const chart = svg
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        const xScale = scaleLinear().domain([0, 10]).range([0, width]);
        const yScale = scaleLinear().domain([0, 100]).range([height, 0]);

        const xAxis = axisBottom(xScale).ticks(5);
        chart
            .append('g')
            .attr('class', 'd3-axis x-axis')
            .attr('transform', `translate(0, ${height})`)
            .call(xAxis);

        const yAxis = axisLeft(yScale).ticks(5);
        chart.append('g').attr('class', 'd3-axis y-axis').call(yAxis);
    }
});