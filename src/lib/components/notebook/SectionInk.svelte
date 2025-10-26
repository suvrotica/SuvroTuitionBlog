<script lang="ts">
	import type { Stroke, Point, InkContent } from '$lib/types/notebook';
	import { generateUUID } from '$lib/utils/uuid';
	import { untrack, tick } from 'svelte';

	let {
		content,
		onchange = () => {}
	}: {
		content: InkContent;
		onchange?: () => void;
	} = $props();

	let svgElement: SVGSVGElement | undefined = $state();
	let currentStroke: Stroke | null = $state(null);
	let isDrawing = $state(false);

	const backgroundColor = '#000000';
	const colors = [
		{ name: 'White', value: '#FFFFFF' },
		{ name: 'Blue', value: '#0000FF' },
		{ name: 'Orange', value: '#FFA500' },
		{ name: 'Green', value: '#008000' },
		{ name: 'Yellow', value: '#FFFF00' }
	];
	let selectedColor = $state(colors[0].value);
	let selectedWidth = $state(2);
	let tool = $state<'pen' | 'eraser'>('pen');

	let strokes = $state<Stroke[]>(content?.strokes || []);

	// This effect syncs incoming prop changes to the local state
	$effect(() => {
		const propStrokes = content?.strokes || [];
		
		// Don't update local state if we are actively drawing
		if (untrack(() => isDrawing)) {
			return;
		}
		
		// Only update if the prop is *actually different* from our local state
		// to prevent unnecessary re-renders or infinite loops.
		if (untrack(() => JSON.stringify(propStrokes) !== JSON.stringify(strokes))) {
			strokes = propStrokes;
		}
	});

	function getPathData(stroke: Stroke): string {
		if (!stroke || stroke.points.length === 0) return '';
		let d = `M ${stroke.points[0].x} ${stroke.points[0].y}`;
		for (let i = 1; i < stroke.points.length; i++) {
			d += ` L ${stroke.points[i].x} ${stroke.points[i].y}`;
		}
		return d;
	}

	function getPointerPosition(event: PointerEvent): { x: number; y: number } {
		if (!svgElement) return { x: 0, y: 0 };
		const rect = svgElement.getBoundingClientRect();
		const container = svgElement.parentElement;
		const scrollTop = container?.scrollTop || 0;
		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top + scrollTop
		};
	}

	function handlePointerDown(event: PointerEvent) {
		if (!svgElement || event.button !== 0) return;
		isDrawing = true;
		svgElement.setPointerCapture(event.pointerId);

		const { x, y } = getPointerPosition(event);
		const newPoint: Point = { x, y, t: Date.now(), p: event.pressure };

		currentStroke = {
			id: generateUUID(),
			points: [newPoint],
			color: tool === 'eraser' ? backgroundColor : selectedColor,
			width: tool === 'eraser' ? 20 : selectedWidth
		};
	}

	function handlePointerMove(event: PointerEvent) {
		if (!isDrawing || !currentStroke) return;
		const { x, y } = getPointerPosition(event);
		const newPoint: Point = { x, y, t: Date.now(), p: event.pressure };
		currentStroke.points.push(newPoint);
		currentStroke = currentStroke; // Trigger reactivity
	}

	async function handlePointerUp(event: PointerEvent) {
		if (!isDrawing || !currentStroke) return;
		isDrawing = false;
		svgElement?.releasePointerCapture(event.pointerId);

		if (currentStroke.points.length > 1) {
			strokes = [...strokes, currentStroke];
		}
		currentStroke = null;
		
		// Wait for Svelte to apply the state change
		await tick();
		// NOW fire onchange, so the parent reads the *new* state
		onchange();
	}

	async function undo() {
		if (strokes.length === 0) return;
		strokes = strokes.slice(0, -1);
		
		// Wait for Svelte to apply the state change
		await tick();
		// NOW fire onchange
		onchange();
	}

	function selectColor(color: string) {
		tool = 'pen';
		selectedColor = color;
		selectedWidth = color === '#FFFF00' ? 4 : 2;
	}

	function selectEraser() {
		tool = 'eraser';
		selectedWidth = 20;
	}

	export function getCurrentContent(): InkContent {
		return { strokes: strokes };
	}
</script>

<div
	class="ink-section-container border border-neutral-300 dark:border-neutral-700 rounded bg-neutral-900 flex flex-col"
	style="height: 75vh;"
>
	<div
		class="toolbar sticky top-0 z-10 p-2 flex gap-2 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex-shrink-0"
	>
		{#each colors as color (color.value)}
			<button
				title={color.name}
				onclick={() => selectColor(color.value)}
				class="w-6 h-6 rounded-full border-2"
				class:border-blue-500={tool === 'pen' && selectedColor === color.value}
				class:border-neutral-300={tool !== 'pen' || selectedColor !== color.value}
				style="background-color: {color.value};"
				aria-label="Select {color.name} ink"
			></button>
		{/each}

		<div class="border-l border-neutral-300 dark:border-neutral-600 mx-1"></div>

		<button
			title="Eraser"
			onclick={selectEraser}
			class:border-blue-500={tool === 'eraser'}
			class:border-neutral-300={tool !== 'eraser'}
			class="px-2 py-0 h-6 text-sm text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-700 rounded border flex items-center justify-center"
			aria-label="Select Eraser"
		>
			Eraser
		</button>

		<button
			title="Undo"
			onclick={undo}
			class="px-2 py-0 h-6 text-sm text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-700 rounded border border-neutral-300 dark:border-neutral-600 flex items-center justify-center"
			aria-label="Undo last stroke"
		>
			Undo
		</button>
	</div>

	<div class="overflow-y-auto w-full flex-grow">
		<svg
			bind:this={svgElement}
			class="w-full"
			onpointerdown={handlePointerDown}
			onpointermove={handlePointerMove}
			onpointerup={handlePointerUp}
			onpointerleave={handlePointerUp}
			onpointercancel={handlePointerUp}
			style="touch-action: none; background-color: {backgroundColor}; height: 1500px;"
		>
			{#each strokes as stroke (stroke.id)}
				<path
					d={getPathData(stroke)}
					stroke={stroke.color}
					stroke-width={stroke.width}
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			{/each}

			{#if currentStroke && currentStroke.points.length > 0}
				<path
					d={getPathData(currentStroke)}
					stroke={tool === 'eraser' ? backgroundColor : currentStroke.color}
					stroke-width={currentStroke.width}
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
					opacity="0.8"
				/>
			{/if}
		</svg>
	</div>
</div>