import {defineConfig} from 'astro/config';
import sitemap from '@astrojs/sitemap';
import indexnow from 'astro-indexnow';

// The primary landing pages we want ranked, alongside the home page.
const primaryPages = ['/download/', '/check/', '/pricing/'];

// Funnel and brand pages: worth ranking, below the primary landings. The deployment and
// config generator pages target the console's buying audience, and the giving page's
// lifetime total changes as donations accrue.
const secondaryPages = ['/deployment/', '/config-generator/', '/giving/'];

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
                } else if (secondaryPages.some((page) => item.url === 'https://osprey.ac' + page)) {
                    item.priority = 0.6;
                    item.changefreq = 'monthly';
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
