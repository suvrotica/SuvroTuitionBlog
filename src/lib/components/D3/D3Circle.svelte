<script lang="ts">
	import { select } from 'd3-selection';

	// D3's transition is a side-effect import
	import 'd3-transition';

	// bind:this needs an initial undefined value
	let svgEl: SVGElement | undefined = $state();
	
	// Reactive state for circle properties
	let cx = $state(50);
	let fill = $state('#D4AF47'); // Gold color from theme

	$effect(() => {
		if (svgEl) {
			const svg = select(svgEl);

			// --- FIX STARTS HERE ---
			
			// Use the .join() method for a cleaner enter/update pattern.
			// It handles creating the element on first run and selecting it on subsequent runs.
			const circle = svg
				.selectAll('circle')
				.data([null]) // Data array with one item for our single circle
				.join('circle') // .join() handles enter and update
					.attr('r', 20)
					.attr('cy', 50);

			// Apply the transition to the selection returned by .join()
			circle
				.transition()
				.duration(750)
				.attr('cx', cx)
				.attr('fill', fill);

			// --- FIX ENDS HERE ---
		}
	});

	function moveCircle() {
		// Update state to trigger the effect
		cx = cx === 50 ? 150 : 50;
		fill = fill === '#D4AF47' ? '#374151' : '#D4AF47'; // Using neutral-700 from your theme
	}
</script>

<div class="interactive-component-wrapper">
	<p>This is a simple D3.js visualization rendered inside a Svelte component. Click the button to move the circle.</p>
	<svg bind:this={svgEl} width="200" height="100" class="bg-neutral-200 dark:bg-neutral-800 rounded-md mt-4"></svg>
	<button onclick={moveCircle}>
		Animate Circle
	</button>
</div>