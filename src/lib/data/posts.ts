// File: src/lib/data/posts.ts
// Creating dummy data for the sidebar navigation.
export type Article = {
	title: string;
	slug: string;
};

export type Topic = {
	topic: string;
	articles: Article[];
};

export const topics: Topic[] = [
	{
		topic: 'SvelteKit',
		articles: [
			{ title: 'Understanding Routing', slug: 'sveltekit-routing' },
			{ title: 'Working with Data', slug: 'sveltekit-data' }
		]
	},
	{
		topic: '3D & WebGL',
		articles: [
			{ title: 'Three.js Basics', slug: 'threejs-basics' },
			{ title: 'Shaders in Svelte', slug: 'shaders-in-svelte' }
		]
	},
    {
		topic: 'CSS & Design',
		articles: [
			{ title: 'Modern CSS Layouts', slug: 'css-layouts' },
			{ title: 'Theming with Oklch', slug: 'theming-with-oklch' }
		]
	}
];
