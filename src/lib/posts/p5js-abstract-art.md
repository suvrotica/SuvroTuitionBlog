---
title: "Generative Abstract Art with p5.js and Svelte"
date: "2025-06-22"
description: "Learn how to integrate the creative coding power of p5.js into a modern Svelte 5 application to create dynamic, interactive art for the web."
topic: "3D & WebGL"
published: false

thumbnail: "/images/placeholders/p5js-placeholder.jpeg"
---

<script>
    import P5AbstractArt from '$lib/components/P5/P5AbstractArt.svelte';
    import GoldLine from '$lib/components/GoldLine.svelte';
</script>

## Creative Coding Meets Component-Driven Development

[p5.js](https://p5js.org/) is a fantastic JavaScript library for creative coding, making it accessible for artists, designers, and developers to create graphics and interactive experiences on the web. Svelte, with its component-based architecture and efficient reactivity, provides the perfect framework to structure and manage these creative sketches.

Combining these two technologies allows us to build encapsulated, reusable visual components that are both dynamic and easy to integrate into a larger application. Below is a live example of a p5.js sketch running within this blog post.

<GoldLine />

<P5AbstractArt />

<GoldLine />

### The Integration Strategy

The key to making p5.js work seamlessly within a Svelte component is to use its "instance mode". This prevents p5.js from polluting the global namespace and allows us to attach a sketch to a specific DOM element. Here’s the approach used in the component above:

1.  **Component Mounting**: We use Svelte's `onMount` lifecycle function to ensure our p5.js code runs only on the client-side, after the component's host element is available in the DOM.
2.  **DOM Binding**: A `<div>` element is bound to a variable using `bind:this`, giving us a direct reference to the container where the p5.js canvas will live.
3.  **Sketch Instantiation**: Inside `onMount`, we create a new `p5` instance, passing our sketch function and the container element.
4.  **Cleanup**: The function returned from `onMount` is called when the component is destroyed. We use this to call the `remove()` method on our p5 instance, which cleans up the canvas and its event listeners, preventing memory leaks during navigation.

Here is a simplified look at the script portion of the Svelte component:

```typescript
import { onMount } from 'svelte';
import p5 from 'p5';

let container: HTMLDivElement;

onMount(() => {
    const sketch = (p: p5) => {
        // p5 setup() and draw() functions go here
        p.setup = () => {
            p.createCanvas(600, 400).parent(container);
        };

        p.draw = () => {
            p.background(0);
            p.ellipse(p.width / 2, p.height / 2, 50, 50);
        };
    };

    const p5Instance = new p5(sketch, container);

    // Cleanup when component is unmounted
    return () => {
        p5Instance.remove();
    };
});