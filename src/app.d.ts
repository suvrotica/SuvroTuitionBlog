// src/app.d.ts
import type { Category } from './routes/+layout.server'; // Import the new type

declare global {
	namespace App {
		// ...
		interface LayoutData {
			categories: Category[]; // Change 'topics' to 'categories'
		}
		// ...
	}
}

export {};