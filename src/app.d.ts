// src/app.d.ts
import type { Category } from './routes/+layout.server'; // Import the new type

declare global {
	namespace App {
		// ...
		interface LayoutData {
			categories: Category[]; // Change 'topics' to 'categories'
		}
		// ...
		interface Post {
			slug: string;
			content: string;
			meta: {
				title: string;
				description: string;
				date: string;
				lastModified: string;
				category: string;
				published: boolean;
				featured?: boolean;
				readingTime: number;
			};
		}
	}
}

export {};