---
title: "A First Look at Svelte's Runes"
date: "2025-06-19"
description: "Exploring the new reactivity model in Svelte 5 and how it changes the way we build apps."
topic: "SvelteKit"
thumbnail: "/images/placeholders/svelte-runes-thumbnail.jpeg"
---

<script>
    import Counter from '$lib/components/blog/Counter.svelte';
    import GoldLine from '$lib/components/GoldLine.svelte';
    import InfoBox from '$lib/components/ui/InfoBox.md';
</script>

## A Paradigm Shift

Svelte 5 introduces a new reactivity model powered by **runes**. [cite: 2413] [cite_start]This is a fundamental change from the magic of `let` and `$:`. [cite: 2414] [cite_start]This post will explore what runes are and how to use them. [cite: 2415]

<InfoBox>
    <p>The core idea of runes is to make reactivity explicit and composable, moving away from compiler-driven magic toward a more robust and predictable system.</p>
</InfoBox>

### From Implicit to Explicit
The core idea is to make reactivity more explicit. [cite: 2416] Instead of relying on the compiler to infer reactivity from assignments (`=`), we now use special functions called runes to declare reactive state. 

### The `$state` Rune
The most basic rune is `$state()`. [cite: 2418] It creates a piece of state that, when its value changes, will trigger updates to the UI.
Here's a simple example of a reactive counter. The script block looks like this:

```javascript
// Reactive state is now explicitly created with $state
let count = $state(0);
function increment() {
	count += 1;
}