// src/lib/server/auth.ts
import { PUBLIC_EDITOR_SECRET } from '$env/static/public';
export function isEditor(request: Request): boolean {
	console.warn('Using placeholder isEditor check. Implement real auth!');
	return true; // Placeholder
}

// Helper to check the PUBLIC_EDITOR_SECRET - USE THIS IN ENDPOINTS
export function checkEditorSecret(secret?: string): boolean {
	if (!PUBLIC_EDITOR_SECRET) {
		console.error('PUBLIC_EDITOR_SECRET environment variable is not set!');
		return false;
	}
	// Allow requests in dev without a secret for easier testing? Optional.
	// if (dev && !secret) return true;
	return secret === PUBLIC_EDITOR_SECRET;
}

// Simple function to simulate getting an edit token (in real app, use JWT)
export function getEditToken(): string | null {
	if (!PUBLIC_EDITOR_SECRET) {
		console.error('Cannot generate edit token: PUBLIC_EDITOR_SECRET is not set.');
		return null;
	}
	// For skeleton, the "token" is just the secret itself. NOT SECURE FOR PROD.
	return PUBLIC_EDITOR_SECRET;
}