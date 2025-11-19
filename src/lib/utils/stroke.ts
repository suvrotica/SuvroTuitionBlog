import { getStroke } from 'perfect-freehand';

export interface Point {
	x: number;
	y: number;
	p?: number; // Pressure
}

export function getSvgPathFromStroke(points: Point[], options: any = {}): string {
	const stroke = getStroke(points, options);
	if (!stroke.length) return '';

	const d = stroke.reduce(
		(acc, [x0, y0], i, arr) => {
			const [x1, y1] = arr[(i + 1) % arr.length];
			acc.push(x0, y0, (x0 + x1) / 2, (y1 + y0) / 2);
			return acc;
		},
		['M', ...stroke[0], 'Q']
	);

	d.push('Z');
	return d.join(' ');
}