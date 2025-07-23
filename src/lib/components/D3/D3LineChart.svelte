<script lang="ts">
	import { scaleLinear } from 'd3-scale';
	import { line as d3Line } from 'd3-shape';
	import { extent } from 'd3-array';
	import { select, pointer } from 'd3-selection';
	import { bisector } from 'd3-array';
	import D3Axis from './D3Axis.svelte';

	export type Point = { year: number; population: number };
	export type Series = { name: string; values: Point[] };

	type CirclePosition = { cx: number; cy: number };

	// --- PROPS ---
	let {
		data = [] as Series[],
		aspectRatio = 1.5 // width / height, e.g., 600/400
	}: {
		data: Series[];
		aspectRatio?: number;
	} = $props();

	// --- STATE & DOM BINDINGS ---
	let chartContainer: HTMLDivElement | undefined = $state();
	let tooltipEl: HTMLDivElement | undefined = $state();
	let width = $state(0); // This will be bound to the container's width

	// --- RESPONSIVE DIMENSIONS ---
	let height = $derived(width / aspectRatio);
	const margin = { top: 20, right: 30, bottom: 40, left: 70 };
	let innerWidth = $derived(width - margin.left - margin.right);
	let innerHeight = $derived(height - margin.top - margin.bottom);

	// --- DATA & SCALES ---
	let allPoints = $derived(data.flatMap((series) => series.values));
	let xScale = $derived(
		scaleLinear()
			.domain(extent(allPoints, (d) => d.year) as [number, number])
			.range([0, innerWidth])
	);
	let yScale = $derived(
		scaleLinear()
			.domain([0, Math.max(...allPoints.map((d) => d.population))])
			.nice()
			.range([innerHeight, 0])
	);

	// --- GENERATORS & FORMATTERS ---
	let lineGenerator = $derived(
		d3Line<Point>()
			.x((d) => xScale(d.year))
			.y((d) => yScale(d.population))
	);
	const yAxisFormat = (d: number) => `${(d / 1e9).toFixed(1)}B`;
	const colors = ['#D4AF47', '#4ade80', '#60a5fa', '#f87171', '#c084fc', '#facc15'];

	// --- INTERACTIVITY EFFECT ---
	$effect(() => {
		if (!chartContainer || !tooltipEl || width === 0) return;

		const svg = select(chartContainer).select('svg');
		// --- FIX: Create the D3 selection for the tooltip ---
		const tooltip = select(tooltipEl);

		svg.selectAll('.event-layer, .d3-tooltip-line, .d3-tooltip-circle').remove();

		const bisectYear = bisector((d: Point) => d.year).left;

		const tooltipLine = svg
			.append('line')
			.attr('class', 'd3-tooltip-line')
			.attr('stroke-dasharray', '5,5')
			.attr('y1', margin.top)
			.attr('y2', height - margin.bottom)
			.style('opacity', 0);

		const tooltipCircles = svg
			.selectAll('.tooltip-circle-group')
			.data(data)
			.join('circle')
			.attr('class', 'd3-tooltip-circle')
			.attr('r', 4)
			.style('opacity', 0);

		function onMouseMove(event: MouseEvent) {
			if (data.length === 0 || !tooltipEl || !chartContainer) return;

			const [mx, my] = pointer(event);
			const svgRect = chartContainer.getBoundingClientRect();
			const mouseX = mx - margin.left;

			if (mouseX < 0 || mouseX > innerWidth) {
				onMouseOut();
				return;
			}

			const hoveredYear = Math.round(xScale.invert(mouseX));
			let tooltipContent = `<div class="font-bold text-base mb-1">~${hoveredYear}</div>`;
			const circlePositions: CirclePosition[] = [];

			for (const [i, series] of data.entries()) {
				const seriesIndex = bisectYear(series.values, hoveredYear, 1);
				const d0 = series.values[seriesIndex - 1];
				const d1 = series.values[seriesIndex];
				const d = d1 && hoveredYear - d0.year > d1.year - hoveredYear ? d1 : d0;
				if (d) {
					tooltipContent += `<div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full" style="background-color: ${colors[i % colors.length]}"></span>${series.name}: ${d.year}, ${yAxisFormat(d.population)}</div>`;
					circlePositions.push({
						cx: xScale(d.year) + margin.left,
						cy: yScale(d.population) + margin.top
					});
				}
			}

			tooltip.style('opacity', 1).html(tooltipContent);

			const tooltipRect = tooltipEl.getBoundingClientRect();
			let newLeft = mx + 20;
			let newTop = my;

			if (newLeft + tooltipRect.width > svgRect.width) {
				newLeft = mx - tooltipRect.width - 20;
			}

			if (newTop + tooltipRect.height > svgRect.height) {
				newTop = my - tooltipRect.height - 10;
			}

			tooltip.style('left', `${newLeft}px`).style('top', `${newTop}px`);

			tooltipLine.style('opacity', 1).attr('x1', mx).attr('x2', mx);
			tooltipCircles
				.style('opacity', 1)
				.attr('cx', (d, i) => circlePositions[i]?.cx ?? -10)
				.attr('cy', (d, i) => circlePositions[i]?.cy ?? -10);
		}

		function onMouseOut() {
			tooltip.style('opacity', 0);
			tooltipLine.style('opacity', 0);
			tooltipCircles.style('opacity', 0);
		}

		const eventLayer = svg
			.append('rect')
			.attr('class', 'event-layer')
			.attr('width', width)
			.attr('height', height)
			.attr('fill', 'none')
			.attr('pointer-events', 'all')
			.on('mousemove', onMouseMove)
			.on('mouseout', onMouseOut);
	});
</script>

<div class="chart-container relative not-prose" bind:this={chartContainer} bind:clientWidth={width}>
	{#if width > 0}
		<svg {width} {height} class="bg-neutral-200 dark:bg-neutral-800 rounded-md">
			<g transform="translate({margin.left}, {margin.top})">
				<D3Axis
					orientation="bottom"
					scale={xScale}
					y={innerHeight}
					ticks={width > 500 ? 10 : 5}
					tickFormat="d"
				/>
				<D3Axis orientation="left" scale={yScale} tickFormat={yAxisFormat} />

				{#each data as series, i (series.name)}
					<path
						d={lineGenerator(series.values)}
						stroke={colors[i % colors.length]}
						fill="none"
						stroke-width="2"
					/>
				{/each}
			</g>
		</svg>

		<div bind:this={tooltipEl} class="d3-tooltip"></div>

		<div class="legend">
			{#each data as series, i (series.name)}
				<div class="legend-item">
					<span class="legend-color" style="background-color: {colors[i % colors.length]}"></span>
					{series.name}
				</div>
			{/each}
		</div>
	{/if}
</div>