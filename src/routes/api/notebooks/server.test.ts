// src/routes/api/notebooks/+server.test.ts
import { describe, it, expect, vi } from 'vitest';
import { POST } from './+server'; // Import your handler
import { json } from '@sveltejs/kit';

// Mock the storage adapter
vi.mock('$lib/server/storage/filesystem', () => ({
	createNotebook: vi.fn(),
}));
// Mock auth helper
vi.mock('$lib/server/auth', () => ({
    getEditToken: vi.fn()
}));
 // Mock env
 vi.mock('$env/static/private', () => ({
    EDITOR_SECRET: 'test-secret-from-mock'
}));

import { createNotebook } from '$lib/server/storage/filesystem';
import { getEditToken } from '$lib/server/auth';


describe('POST /api/notebooks', () => {
	it('should create a notebook and return its ID and token', async () => {
		const mockNotebook = { id: 'test-uuid', title: 'Untitled Notebook', sections: [], createdAt: '', publishedAt: null };
        const mockToken = 'mock-edit-token';

		vi.mocked(createNotebook).mockResolvedValue(mockNotebook as any);
        vi.mocked(getEditToken).mockReturnValue(mockToken);

		// Simulate a SvelteKit RequestEvent (only needs `request` for this endpoint)
		const mockRequest = new Request('http://localhost/api/notebooks', { method: 'POST' });
		const event = {
			request: mockRequest,
             url: new URL('http://localhost/api/notebooks'),
            // Add other required event properties if your actual code uses them
             cookies: {} as any,
             fetch: {} as any,
             getClientAddress: () => '',
             locals: {} as any,
             params: {},
             platform: undefined,
             route: { id: '/api/notebooks' } as any,
             setHeaders: () => {},
             isDataRequest: false,
             isSubRequest: false
		};

		const response = await POST(event as any); // Use 'as any' for brevity in test

		expect(response.status).toBe(201);
		const body = await response.json();
		expect(body.id).toBe('test-uuid');
		expect(body.editToken).toBe(mockToken);
        expect(body.notebook.id).toBe('test-uuid');
		expect(createNotebook).toHaveBeenCalledWith('Untitled Notebook');
         expect(getEditToken).toHaveBeenCalled();
	});

     it('should return 500 if token generation fails', async () => {
        const mockNotebook = { id: 'test-uuid-2', title: 'Untitled Notebook', sections: [], createdAt: '', publishedAt: null };
        vi.mocked(createNotebook).mockResolvedValue(mockNotebook as any);
        vi.mocked(getEditToken).mockReturnValue(null); // Simulate missing secret

        const mockRequest = new Request('http://localhost/api/notebooks', { method: 'POST' });
        const event = { request: mockRequest, url: new URL('http://localhost/api/notebooks') }; // Simplified event

        const response = await POST(event as any);
        expect(response.status).toBe(500);
        const body = await response.json();
        expect(body.error).toContain('Server configuration error');
    });

     it('should return 500 if storage fails', async () => {
         vi.mocked(createNotebook).mockRejectedValue(new Error('Disk full'));
         vi.mocked(getEditToken).mockReturnValue('token');

         const mockRequest = new Request('http://localhost/api/notebooks', { method: 'POST' });
         const event = { request: mockRequest, url: new URL('http://localhost/api/notebooks') }; // Simplified event

         const response = await POST(event as any);
         expect(response.status).toBe(500);
         const body = await response.json();
         expect(body.error).toContain('Failed to create notebook');
     });
});