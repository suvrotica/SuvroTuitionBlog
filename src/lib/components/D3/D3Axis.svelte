<script lang="ts">
	import { select } from 'd3-selection';
	import { axisBottom, axisLeft } from 'd3-axis';
	import { format } from 'd3-format';
	import type { ScaleLinear } from 'd3-scale';

	let {
		scale,
		orientation,
		x = 0,
		y = 0,
		ticks = 5,
		// --- CHANGE START: Allow tickFormat to be a function ---
		tickFormat = '~s'
	}: {
		scale: ScaleLinear<number, number>;
		orientation: 'bottom' | 'left';
		x?: number;
		y?: number;
		ticks?: number;
		tickFormat?: string | null | ((domainValue: any, index: number) => string);
		// --- CHANGE END ---
	} = $props();

	let gElement: SVGGElement | undefined = $state();

	$effect(() => {
		if (gElement) {
			const axisGenerator = orientation === 'bottom' ? axisBottom : axisLeft;
			const axis = axisGenerator(scale).ticks(ticks);

			// --- CHANGE START: Handle both string and function formats ---
			if (typeof tickFormat === 'function') {
				axis.tickFormat(tickFormat);
			} else if (tickFormat) {
				axis.tickFormat(format(tickFormat));
			} else {
				axis.tickFormat(null);
			}
			// --- CHANGE END ---

			select(gElement).call(axis);
		}
	});
</script>

<g bind:this={gElement} class="d3-axis" transform="translate({x}, {y})"></g>