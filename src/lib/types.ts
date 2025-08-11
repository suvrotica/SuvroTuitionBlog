// This file defines the shape of your data structures.

// Based on your TheApp.txt, you may need these imports for SEO later.
// import type { OpenGraph } from '$lib/components/seo/types';
// import type { Schema } from 'schema-dts';

export type Post = {
    // Required properties from your markdown frontmatter
    title: string;
    description: string;
    category: string;
    published: boolean;
    date: string; // The original publication date as a string

    // Properties that are added by the server load function
    slug: string;
    lastUpdated: Date; // The file's last modified date
};