import {defineConfig} from 'astro/config';
import sitemap from '@astrojs/sitemap';
import indexnow from 'astro-indexnow';

// The primary landing pages we want ranked, alongside the home page.
const primaryPages = ['/download/', '/check/'];

export default defineConfig({
    // Custom domain on GitHub Pages, so no `base` is needed.
    site: 'https://osprey.ac',
    trailingSlash: 'always',
    build: {
        format: 'directory',
        inlineStylesheets: 'always',
    },
    integrations: [
        sitemap({
            // The legal pages should be indexable but are not what we want ranked. The generated
            // per-URL result pages under /check/<host>/... are only ever built for hard-flagged
            // links, so they belong in the sitemap, but at a lower priority and a fresher cadence
            // than the tool page itself.
            serialize(item) {
                const isCheckSubpage = item.url.startsWith('https://osprey.ac/check/')
                    && item.url !== 'https://osprey.ac/check/';

                if (item.url === 'https://osprey.ac/') {
                    item.priority = 1.0;
                    item.changefreq = 'weekly';
                } else if (isCheckSubpage) {
                    item.priority = 0.4;
                    item.changefreq = 'daily';
                } else if (primaryPages.some((page) => item.url === 'https://osprey.ac' + page)) {
                    item.priority = 0.9;
                    item.changefreq = 'weekly';
                } else {
                    item.priority = 0.3;
                    item.changefreq = 'yearly';
                }
                return item;
            },
        }),
        indexnow({
            key: process.env.INDEXNOW_KEY,
        }),
    ],
});
