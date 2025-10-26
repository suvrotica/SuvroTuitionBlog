// src/lib/server/storage/filesystem.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { createNotebook, getNotebook, updateNotebook, getAllNotebooks } from './filesystem';
import type { Notebook, Section } from '$lib/types/notebook';

// Use a temporary directory for tests
// This logic works because the filesystem.ts module itself checks process.env.VERCEL
// and will use '/tmp/sessions' if it's '1'. We'll set that env var for our tests.
process.env.VERCEL = '1';
const testSessionsDir = path.join('/tmp', 'sessions');

beforeAll(async () => {
	try {
		await fs.mkdir(testSessionsDir, { recursive: true });
	} catch (e) {
		console.log('Test session dir already exists, cleaning...');
	}
});

afterAll(async () => {
	try {
		// Clean up test directory
		await fs.rm(testSessionsDir, { recursive: true, force: true });
	} catch (e) {
		console.error('Could not clean up test session dir:', e);
	}
});

beforeEach(async () => {
	// Clear directory before each test
	const files = await fs.readdir(testSessionsDir).catch(() => []);
	for (const file of files) {
		await fs.unlink(path.join(testSessionsDir, file));
	}
});

describe('Filesystem Storage Adapter', () => {
	it('should create a new notebook file', async () => {
		const notebook = await createNotebook('Test Create');
		expect(notebook.id).toBeDefined();
		expect(notebook.title).toBe('Test Create');
		expect(notebook.sections).toEqual([]);

		// Check if file exists
		const filePath = path.join(testSessionsDir, `${notebook.id}.json`);
		await expect(fs.access(filePath)).resolves.toBeUndefined();
	});

	it('should get an existing notebook', async () => {
		const created = await createNotebook('Test Get');
		const fetched = await getNotebook(created.id);
		expect(fetched).not.toBeNull();
		expect(fetched?.id).toBe(created.id);
		expect(fetched?.title).toBe('Test Get');
	});

	it('should return null for a non-existent notebook', async () => {
		const fetched = await getNotebook('non-existent-id');
		expect(fetched).toBeNull();
	});

	it('should save updates to a notebook title and sections', async () => {
		const notebook = await createNotebook('Test Save');
		const newTitle = 'Updated Title';
		const newSections: Section[] = [
			{
				id: 'sec1',
				type: 'ink',
				orderIndex: 1000,
				createdAt: new Date().toISOString(),
				versions: [
					{
						versionId: 'v1',
						changedAt: new Date().toISOString(),
						changeType: 'create',
						content: { strokes: [] }
					}
				]
			}
		];

		const updated = await updateNotebook(notebook.id, newTitle, newSections);
		expect(updated).not.toBeNull();
		expect(updated?.title).toBe(newTitle);
		expect(updated?.sections).toHaveLength(1);
		expect(updated?.sections[0].id).toBe('sec1');

		const fetched = await getNotebook(notebook.id);
		expect(fetched?.title).toBe(newTitle);
		expect(fetched?.sections).toHaveLength(1);
		expect(fetched?.sections[0].id).toBe('sec1');
	});

	it('should return null when updating a non-existent notebook', async () => {
		const updated = await updateNotebook('non-existent-id', 'No Title', []);
		expect(updated).toBeNull();
	});

	it('should get all notebook summaries', async () => {
		await createNotebook('Notebook A');
		// Wait a moment to ensure different createdAt times for sorting
		await new Promise((res) => setTimeout(res, 10));
		await createNotebook('Notebook B');

		const summaries = await getAllNotebooks();
		expect(summaries).toHaveLength(2);
		expect(summaries[0].title).toBe('Notebook B'); // Most recent first
		expect(summaries[1].title).toBe('Notebook A');
		expect(summaries[0].id).toBeDefined();
		expect(summaries[0].createdAt).toBeDefined();
	});
});