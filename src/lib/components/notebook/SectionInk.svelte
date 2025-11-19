<script lang="ts">
	import type { Stroke, Point, InkContent } from '$lib/types/notebook';
	import { generateUUID } from '$lib/utils/uuid';
	import { getSvgPathFromStroke } from '$lib/utils/stroke';
	import { tick } from 'svelte';

	let {
		content,
		readOnly = false,
		onchange = () => {}
	}: {
		content: InkContent;
		readOnly?: boolean;
		onchange?: () => void;
	} = $props();

	let svgElement = $state<SVGSVGElement>();
	let currentStroke = $state<Stroke | null>(null);
	let isDrawing = $state(false);

	let strokes = $state<Stroke[]>(content?.strokes || []);
	
	// Default: Graphite (#373737)
	let selectedColor = $state('#373737'); 
	let tool = $state<'pen' | 'highlighter' | 'eraser'>('pen');
	let strokeWidth = $state(4);

	const colors = [
		{ name: 'Graphite', value: '#373737' },
		{ name: 'Black', value: '#000000' },
		{ name: 'Blue', value: '#2563eb' },
		{ name: 'Red', value: '#dc2626' },
		{ name: 'Gold', value: '#D4AF47' }
	];

	const highlighterColors = [
		{ name: 'Yellow', value: '#facc15' },
		{ name: 'Green', value: '#4ade80' },
		{ name: 'Pink', value: '#f472b6' }
	];

	const tools = {
		pen: { size: 8, thinning: 0.5, smoothing: 0.5, streamline: 0.5 },
		highlighter: { size: 25, thinning: 0, smoothing: 0.5, streamline: 0.5 },
		eraser: { size: 30 }
	};

	function getPointerPosition(event: PointerEvent): Point {
		if (!svgElement) return { x: 0, y: 0, p: 0.5, t: Date.now() };

		const rect = svgElement.getBoundingClientRect();
		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top,
			p: event.pressure,
			t: Date.now()
		};
	}

	function handlePointerDown(event: PointerEvent) {
		if (readOnly || event.button !== 0 || !svgElement) return;
		
		isDrawing = true;
		svgElement.setPointerCapture(event.pointerId);
		const point = getPointerPosition(event);

		if (tool === 'eraser') {
			eraseAt(point);
			return;
		}

		currentStroke = {
			id: generateUUID(),
			points: [point],
			color: tool === 'highlighter' ? selectedColor : selectedColor,
			width: tool === 'highlighter' ? 25 : strokeWidth, 
			type: tool 
		};
	}

	function handlePointerMove(event: PointerEvent) {
		if (!isDrawing || !svgElement) return;
		const events = event.getCoalescedEvents();
		
		if (tool === 'eraser') {
			eraseAt(getPointerPosition(event));
			return;
		}

		if (currentStroke) {
			for (const e of events) {
				currentStroke.points.push(getPointerPosition(e));
			}
		}
	}

	async function handlePointerUp(event: PointerEvent) {
		if (!isDrawing) return;
		isDrawing = false;
		svgElement?.releasePointerCapture(event.pointerId);

		if (currentStroke && tool !== 'eraser') {
			// Reassignment triggers reactivity for the array
			strokes = [...strokes, currentStroke];
		}
		
		currentStroke = null;
		await tick();
		onchange();
	}

	function eraseAt(point: Point) {
		const threshold = 20; 
		const initialLength = strokes.length;

		strokes = strokes.filter(stroke => {
			const minX = Math.min(...stroke.points.map(p => p.x));
			const maxX = Math.max(...stroke.points.map(p => p.x));
			const minY = Math.min(...stroke.points.map(p => p.y));
			const maxY = Math.max(...stroke.points.map(p => p.y));

			if (point.x < minX - threshold || point.x > maxX + threshold || 
				point.y < minY - threshold || point.y > maxY + threshold) {
				return true;
			}
			return !stroke.points.some(p => Math.hypot(p.x - point.x, p.y - point.y) < threshold);
		});

		if (strokes.length !== initialLength) {
			onchange();
		}
	}

	function setTool(t: 'pen' | 'highlighter' | 'eraser', color?: string) {
		tool = t;
		if (color) selectedColor = color;
		
		if (t === 'highlighter' && !highlighterColors.find(c => c.value === selectedColor)) {
			selectedColor = highlighterColors[0].value;
		}
		if (t === 'pen' && !colors.find(c => c.value === selectedColor)) {
			selectedColor = colors[0].value;
		}
	}

	function undo() {
		if (strokes.length === 0) return;
		strokes = strokes.slice(0, -1);
		onchange();
	}

	export function getCurrentContent(): InkContent {
		// --- FIX: Use snapshot to return a plain JS object, detaching from the reactive proxy ---
		return $state.snapshot({ strokes });
	}

	function getStrokeOptions(stroke: Stroke) {
		if (stroke.type === 'highlighter') {
			return { size: stroke.width, thinning: 0, smoothing: 0.5, streamline: 0.5 };
		}
		return { size: stroke.width, thinning: 0.5, smoothing: 0.5, streamline: 0.5 };
	}
</script>

<div class="flex flex-col md:flex-row gap-4 items-start w-full">
	{#if !readOnly}
		<div class="toolbar sticky top-4 z-10 flex md:flex-col items-center gap-4 p-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl shadow-sm mx-auto md:mx-0 overflow-x-auto md:overflow-visible max-w-full">
			
			<div class="flex md:flex-col gap-2 pb-0 md:pb-2 md:border-b border-r md:border-r-0 border-neutral-300 dark:border-neutral-600 pr-2 md:pr-0">
				{#each colors as color}
					<button
						onclick={() => setTool('pen', color.value)}
						class="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none"
						class:scale-110={tool === 'pen' && selectedColor === color.value}
						class:border-neutral-900={tool === 'pen' && selectedColor === color.value}
						class:dark:border-white={tool === 'pen' && selectedColor === color.value}
						class:border-transparent={tool !== 'pen' || selectedColor !== color.value}
						style="background-color: {color.value};"
						aria-label="Pen {color.name}"
					></button>
				{/each}
			</div>

			<div class="flex md:flex-col gap-2 pb-0 md:pb-2 md:border-b border-r md:border-r-0 border-neutral-300 dark:border-neutral-600 pr-2 md:pr-0">
				{#each highlighterColors as color}
					<button
						onclick={() => setTool('highlighter', color.value)}
						class="w-8 h-8 rounded-sm opacity-80 transition-transform hover:scale-110 focus:outline-none border-2"
						class:scale-110={tool === 'highlighter' && selectedColor === color.value}
						class:border-neutral-900={tool === 'highlighter' && selectedColor === color.value}
						class:dark:border-white={tool === 'highlighter' && selectedColor === color.value}
						class:border-transparent={tool !== 'highlighter' || selectedColor !== color.value}
						style="background-color: {color.value};"
						aria-label="Highlighter {color.name}"
					></button>
				{/each}
			</div>

			<div class="flex md:flex-col gap-2 items-center">
				<button 
					onclick={() => setTool('eraser')}
					class="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors border-2"
					class:bg-neutral-200={tool === 'eraser'}
					class:dark:bg-neutral-700={tool === 'eraser'}
					class:border-neutral-900={tool === 'eraser'}
					class:dark:border-white={tool === 'eraser'}
					class:border-transparent={tool !== 'eraser'}
					aria-label="Eraser"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>
				</button>

				<button 
					onclick={undo}
					class="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors border-2 border-transparent"
					aria-label="Undo"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
				</button>
			</div>

			{#if tool === 'pen'}
				<div class="flex flex-col items-center gap-1 pt-2 border-t border-neutral-300 dark:border-neutral-600 w-full">
					<span class="text-[10px] text-neutral-500 uppercase font-bold">Size</span>
					<input 
						type="range" 
						min="2" 
						max="20" 
						bind:value={strokeWidth}
						class="w-24 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer dark:bg-neutral-700 accent-neutral-600 dark:accent-neutral-400 md:-rotate-90 md:w-20 md:mt-8 md:mb-8"
						aria-label="Brush Size"
					/>
				</div>
			{/if}
		</div>
	{/if}

    <div class="ink-wrapper relative flex-1 bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
		<svg
			bind:this={svgElement}
			class="w-full h-[800px] cursor-crosshair touch-none"
			onpointerdown={handlePointerDown}
			onpointermove={handlePointerMove}
			onpointerup={handlePointerUp}
			onpointerleave={handlePointerUp}
			onpointercancel={handlePointerUp}
		>
			{#each strokes.filter(s => s.type === 'highlighter' || (s.width > 10 && !s.type)) as stroke (stroke.id)}
				<path
					d={getSvgPathFromStroke(stroke.points, getStrokeOptions(stroke))}
					fill={stroke.color}
					opacity="0.4"
					style="mix-blend-mode: multiply;"
				/>
			{/each}

			{#each strokes.filter(s => s.type !== 'highlighter' && (!s.width || s.width <= 10)) as stroke (stroke.id)}
				<path
					d={getSvgPathFromStroke(stroke.points, getStrokeOptions(stroke))}
					fill={stroke.color}
				/>
			{/each}

			{#if currentStroke}
				<path
					d={getSvgPathFromStroke(currentStroke.points, getStrokeOptions(currentStroke))}
					fill={currentStroke.color}
					opacity={tool === 'highlighter' ? 0.4 : 1}
				/>
			{/if}
		</svg>
	</div>
</div>