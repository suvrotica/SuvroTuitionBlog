import { env } from '$env/dynamic/private';

// We use dynamic private env to ensure it picks up changes without full rebuilds in some contexts.
const SECRET = env.EDITOR_SECRET;

export function checkEditorSecret(secret?: string): boolean {
	if (!SECRET) {
		// Log error on server side so you can debug in Vercel logs
		console.error('EDITOR_SECRET environment variable is not set on server!');
		return false;
	}
	// Strict equality check
	return secret === SECRET;
}

export function getEditToken(): string | null {
	if (!SECRET) {
		console.error('Cannot generate edit token: EDITOR_SECRET is not set.');
		return null;
	}
	return SECRET;
}