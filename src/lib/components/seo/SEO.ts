// src/lib/components/seo/SEO.ts
import { dev } from '$app/environment';
import type { WithContext, WebSite, Person } from 'schema-dts';

// Basic site metadata
const title = 'Suvro Ghosh Blog | Satire | Technology Insights & Expert Opinions';
const description =
	"Join Suvro Ghosh's journey through the evolving landscape of technology. This blog offers a blend of detailed tech tutorials, industry trend analyses, and personal stories, providing a unique view from a tech expert's lens. Stay ahead of the curve with insights into the latest developments and thoughtful perspectives on tech's impact in everyday life. Perfect for tech enthusiasts, professionals, and learners alike.";
const url = dev ? 'http://localhost:5173' : 'https://suvroghosh.blog';

// Default SEO object
export const siteSEO = {
	title: title,
	description: description,
	canonical: url,
	openGraph: {
		type: 'website',
		url: url,
		title: title,
		description: description,
		images: [
			{
				url: `${url}/default-og-image.png`, // We need to create this image
				width: 1200,
				height: 630,
				alt: 'Suvro Ghosh Blog Logo'
			}
		]
	},
	twitter: {
		card: 'summary_large_image',
		title: title,
		description: description,
		image: `${url}/default-og-image.png`,
		creator: '@suvro_ghosh' // Assuming a handle, can be changed
	}
};

// Default JSON-LD schema for the website
export const websiteSchema: WithContext<WebSite> = {
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	name: title,
	url: url,
	description: description,
	publisher: {
		'@type': 'Person',
		name: 'Suvro Ghosh'
	},
	inLanguage: 'en-US'
};