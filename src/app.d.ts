// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

// Import the Topic type from your server load function to ensure consistency
import type { Topic } from './routes/+layout.server';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {}
		
		// Define the shape of data returned from the root layout's load function
		interface LayoutData {
			topics: Topic[];
		}

		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};