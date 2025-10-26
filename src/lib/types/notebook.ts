// src/lib/types/notebook.ts
export interface Point {
	x: number;
	y: number;
	t: number; // timestamp
	p?: number; // pressure (optional)
}

export interface Stroke {
	id: string; // UUID for the stroke
	points: Point[];
	color: string;
	width: number;
}

export interface InkContent {
	strokes: Stroke[];
	// Optional: Bounding box can be calculated on render or save
	// bbox?: { x: number; y: number; w: number; h: number };
}

export type SectionType = 'ink' | 'markdown' | 'code' | 'title'; // | 'image' omitted for skeleton

export interface SectionVersion {
	versionId: string; // UUID
	changedAt: string; // ISO8601 timestamp
	changeType: 'create' | 'edit'; // | 'reorder' | 'meta' omitted for skeleton
	content: InkContent | { text: string } | { title: string }; // Simplified content types
}

export interface Section {
	id: string; // UUID
	type: SectionType;
	orderIndex: number; // For ordering
	createdAt: string; // ISO8601 timestamp
	// createdBy: string; // Simplified for skeleton - add later with auth
	versions: SectionVersion[]; // History of content, latest is current
}

export interface Notebook {
	id: string; // UUID
	title: string;
	createdAt: string; // ISO8601 timestamp
	// createdBy: string; // Simplified for skeleton - add later with auth
	publishedAt: string | null; // ISO8601 timestamp or null
	sections: Section[];
	// history: any[]; // Full notebook change history - omit for skeleton
	meta?: Record<string, any>; // Optional metadata
}