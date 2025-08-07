// Import the new plugin at the top
import { enhancedImages } from '@sveltejs/enhanced-img';

import tailwindcss from '@tailwindcss/vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	// Add enhancedImages() to your plugins array, BEFORE sveltekit()
	plugins: [enhancedImages(), tailwindcss(), sveltekit(), devtoolsJson()]
});