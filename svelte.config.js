// File: svelte.config.js

import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { codeToHtml } from 'shiki';
import { join } from 'path';
import remarkMath from 'remark-math';
// Change this import
import rehypeKatexSvelte from 'rehype-katex-svelte';

/**
 * Custom highlighter function using Shiki.
 * @param {string} code The code to highlight.
 * @param {string | undefined} lang The language of the code.
 * @returns {Promise<string>} The highlighted and escaped HTML.
 */
const highlighter = async (code, lang = 'text') => {
	const html = await codeToHtml(code, {
		lang,
		themes: {
			light: 'github-light',
			dark: 'github-dark'
		}
	});
	return html
		.replace(/{/g, '&#123;')
		.replace(/}/g, '&#125;')
		.replace(/`/g, '&#96;');
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md', '.svx'],

	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md', '.svx'],
			layout: {
				blog: join(process.cwd(), 'src/lib/components/layout/BlogLayout.svelte'),
				_: join(process.cwd(), 'src/lib/components/layout/DefaultLayout.svelte')
			},
			remarkPlugins: [
				remarkGfm,
				[remarkFrontmatter, ['yaml', 'toml']],
				remarkMath
			],
			rehypePlugins: [
				rehypeSlug,
				[rehypeAutolinkHeadings, { behavior: 'wrap' }],
				// And use the new plugin here
				rehypeKatexSvelte 
			],
			smartypants: {
				quotes: true,
				ellipses: true,
				backticks: false,
				dashes: 'oldschool'
			},
			highlight: {
				highlighter
			}
		})
	],

	kit: {
		adapter: adapter()
	}
};
export default config;