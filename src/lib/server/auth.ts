// src/lib/server/auth.ts
// VERY basic auth check for skeleton - replace with proper auth later
import { EDITOR_SECRET } from '$env/static/private';
export function isEditor(request: Request): boolean {
	// In a real app, verify a JWT or session cookie
	// For skeleton, just check a simple header or rely on EDITOR_SECRET check
	// This function isn't strictly needed if we check EDITOR_SECRET directly in endpoints
	// but provides a hook for future expansion.
	// For now, let's assume endpoints check EDITOR_SECRET directly.
	console.warn('Using placeholder isEditor check. Implement real auth!');
	return true; // Placeholder
}

// Helper to check the EDITOR_SECRET - USE THIS IN ENDPOINTS
export function checkEditorSecret(secret?: string): boolean {
	if (!EDITOR_SECRET) {
		console.error('EDITOR_SECRET environment variable is not set!');
		return false;
	}
	// Allow requests in dev without a secret for easier testing? Optional.
	// if (dev && !secret) return true;
	return secret === EDITOR_SECRET;
}

// Simple function to simulate getting an edit token (in real app, use JWT)
export function getEditToken(): string | null {
	if (!EDITOR_SECRET) {
		console.error('Cannot generate edit token: EDITOR_SECRET is not set.');
		return null;
	}
	// For skeleton, the "token" is just the secret itself. NOT SECURE FOR PROD.
	return EDITOR_SECRET;
}