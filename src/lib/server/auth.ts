// src/lib/server/auth.ts
import { EDITOR_SECRET } from '$env/static/private';

// Helper to check the secret against the Environment Variable
export function checkEditorSecret(secret?: string): boolean {
	if (!EDITOR_SECRET) {
		console.error('EDITOR_SECRET environment variable is not set!');
		return false;
	}
	// Compare the provided secret (from client) with the server-side secret
	return secret === EDITOR_SECRET;
}

// Used when creating a new notebook to send the key back to the client initially
export function getEditToken(): string | null {
	if (!EDITOR_SECRET) {
		console.error('Cannot generate edit token: EDITOR_SECRET is not set.');
		return null;
	}
	return EDITOR_SECRET;
}