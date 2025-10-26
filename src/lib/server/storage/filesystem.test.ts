// src/lib/server/storage/filesystem.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { createNotebook, getNotebook, saveNotebook, updateNotebookSections } from './filesystem';
import type { Notebook } from '$lib/types/notebook';

// Use a temporary directory for tests
const testSessionsDir = path.join(process.cwd(), 'data', 'test-sessions');

// Mock process.cwd() to point to test dir or adjust adapter path logic
// For simplicity, let's assume the adapter correctly uses testSessionsDir if base path is manipulated
// Or, more robustly, modify the adapter temporarily for tests (less ideal)
// Easiest: clear the dir before/after tests.

beforeAll(async () => {
	try {
		await fs.mkdir(testSessionsDir, { recursive: true });
	} catch {}
});

afterAll(async () => {
	try {
		// Clean up test directory
		await fs.rm(testSessionsDir, { recursive: true, force: true });
	} catch {}
});

beforeEach(async () => {
    // Clear directory before each test
    const files = await fs.readdir(testSessionsDir);
    for (const file of files) {
        await fs.unlink(path.join(testSessionsDir, file));
    }
     // Hacky: Temporarily override the sessionsDir path for testing
    // This is not ideal, dependency injection would be better
    (createNotebook as any).__TEST_SESSION_DIR = testSessionsDir;
    (getNotebook as any).__TEST_SESSION_DIR = testSessionsDir;
    (saveNotebook as any).__TEST_SESSION_DIR = testSessionsDir;
     (updateNotebookSections as any).__TEST_SESSION_DIR = testSessionsDir; // Need to adjust adapter code slightly for this
});


// --- Helper in filesystem.ts needed for the hack above ---
/*
Add this near the top of filesystem.ts:
let sessionsDir = path.join(process.cwd(), 'data', 'sessions');
// Allow overriding for tests (ugly, but simple for now)
if ((createNotebook as any)?.__TEST_SESSION_DIR) {
    sessionsDir = (createNotebook as any).__TEST_SESSION_DIR;
}
// Repeat for getNotebook, saveNotebook, updateNotebookSections if needed or make sessionsDir exportable and mutable
export function __setTestSessionDir(dir: string) { // A slightly cleaner way
    sessionsDir = dir;
}
// Then call __setTestSessionDir(testSessionsDir) in beforeEach
*/
// --- End Helper ---


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

    it('should save updates to a notebook', async () => {
        const notebook = await createNotebook('Test Save');
        notebook.title = 'Updated Title';
        await saveNotebook(notebook);

        const fetched = await getNotebook(notebook.id);
        expect(fetched?.title).toBe('Updated Title');
    });

     it('should update notebook sections', async () => {
        const notebook = await createNotebook('Test Update Sections');
        const newSections: any[] = [{ id: 'sec1', type: 'ink', orderIndex: 1000, versions: [{ versionId: 'v1', changedAt: '', changeType: 'create', content: { strokes: []}}] }];

        const updated = await updateNotebookSections(notebook.id, newSections);
        expect(updated?.sections).toHaveLength(1);
        expect(updated?.sections[0].id).toBe('sec1');

         const fetched = await getNotebook(notebook.id);
         expect(fetched?.sections).toHaveLength(1);
         expect(fetched?.sections[0].id).toBe('sec1');
     });

     it('should return null when updating sections of non-existent notebook', async () => {
        const updated = await updateNotebookSections('non-existent-id', []);
        expect(updated).toBeNull();
     });
});