---
title: "A First Look at Svelte's Runes"
date: "2025-06-19"
description: "Exploring the new reactivity model in Svelte 5 and how it changes the way we build apps."
topic: "SvelteKit"
thumbnail: "/images/placeholders/svelte-runes-thumbnail.jpeg"
---

<script>
    // Import the component just like in a regular .svelte file
    import Counter from '$lib/components/blog/Counter.svelte';
    import GoldLine from '$lib/components/GoldLine.svelte';

</script>

## A Paradigm Shift

Svelte 5 introduces a new reactivity model powered by **runes**. This is a fundamental change from the magic of `let` and `$:`. This post will explore what runes are and how to use them.

### From Implicit to Explicit
The core idea is to make reactivity more explicit. Instead of relying on the compiler to infer reactivity from assignments (`=`), we now use special functions called runes to declare reactive state.

### The `$state` Rune
The most basic rune is `$state()`. It creates a piece of state that, when its value changes, will trigger updates to the UI.

Here's a simple example of a reactive counter. The script block looks like this:

```javascript
// Reactive state is now explicitly created with $state
let count = $state(0);

function increment() {
	count += 1;
}
```

And here is that counter component in action, embedded directly into this post:

<Counter />

This demonstrates how easy it is to mix interactive elements within your static Markdown content, thanks to `mdsvex`.

<GoldLine />

## Other Key Runes

Besides `$state`, Svelte 5 provides other powerful runes for derived state and side effects.

### `$derived` for Computed Values
Use `$derived` for values that are calculated from other state. It's the replacement for reactive `$: doubled = count * 2` statements. Any time a dependency of the derived expression changes, the derived value will be automatically recalculated.

### `$effect` for Side Effects
Use `$effect` for running code in response to state changes, such as logging to the console, making API calls, or interacting with third-party libraries. This replaces reactive `$: { ... }` blocks used for side effects.
