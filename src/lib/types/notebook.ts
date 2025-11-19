// src/lib/types/notebook.ts

// REPLACE the existing Point and Stroke interfaces with these:
export interface Point {
	x: number;
	y: number;
	t: number;      // Keep 't' required (timestamp) as per original code
	p?: number;     // Pressure (0 to 1) - Optional
}

export interface Stroke {
	id: string;
	points: Point[];
	color: string;
	width: number;
	type?: 'pen' | 'highlighter' | 'eraser'; // Add this new optional field
}

// Keep the rest of your file (InkContent, SectionType, etc.) exactly as is below...
export interface InkContent {
	strokes: Stroke[];
	// bbox?: { x: number; y: number; w: number; h: number };
}

export type SectionType = 'ink' | 'markdown' | 'code' | 'title';

export interface SectionVersion {
	versionId: string;
	changedAt: string;
	changeType: 'create' | 'edit';
	content: InkContent | { text: string } | { title: string };
}

export interface Section {
	id: string;
	type: SectionType;
	orderIndex: number;
	createdAt: string;
	versions: SectionVersion[];
}

export interface Notebook {
	id: string;
	title: string;
	createdAt: string;
	publishedAt: string | null;
	sections: Section[];
	meta?: Record<string, any>;
}