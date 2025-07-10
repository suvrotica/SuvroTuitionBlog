import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts,md}'],
	theme: {
		extend: {
			colors: {
				// Add the custom gold color
				gold: '#D4AF47'
			},
			fontFamily: {
				sans: ['"Source Sans Pro"', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
				serif: ['Merriweather', 'ui-serif', 'Georgia', 'serif'],
				mono: ['"Fira Code"', 'ui-monospace', 'monospace']
			}
		}
	},
	plugins: [typography()]
};