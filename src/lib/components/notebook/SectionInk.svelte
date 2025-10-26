<script lang="ts">
	import type { Stroke, Point, InkContent } from '$lib/types/notebook';
	import { generateUUID } from '$lib/utils/uuid';

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

	// This is the local source of truth for strokes.
	// It's initialized from the prop one time.
	let strokes = $state<Stroke[]>(content?.strokes || []);

	// --- THIS IS THE FIX ---
	// This effect runs when the component mounts AND when the `content` prop
	// changes (e.g., after a successful save).
	// It resynchronizes the local state with the prop,
	// but *only* if the user is not in the middle of drawing.
	$effect(() => {
		if (!isDrawing) {
			// If the prop changes, reset local state to match the prop.
			// This ensures that after a save, the local state
			// reflects the newly saved data.
			strokes = content?.strokes || [];
		}
	});
	// --- END FIX ---

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
		// This line is crucial for Svelte 5 to see the mutation
		currentStroke = currentStroke;
	}

	function handlePointerUp(event: PointerEvent) {
		if (!isDrawing || !currentStroke) return;
		isDrawing = false;
		svgElement?.releasePointerCapture(event.pointerId);

		if (currentStroke.points.length > 1) {
			strokes = [...strokes, currentStroke];
		}
		currentStroke = null;
		onchange(); // Fire the change event
	}

	function undo() {
		if (strokes.length === 0) return;
		strokes = strokes.slice(0, -1);
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