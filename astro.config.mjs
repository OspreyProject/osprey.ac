import {defineConfig} from 'astro/config';
import sitemap from '@astrojs/sitemap';

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
            // The legal pages should be indexable but are not what we want ranked.
            serialize(item) {
                if (item.url === 'https://osprey.ac/') {
                    item.priority = 1.0;
                    item.changefreq = 'weekly';
                } else if (item.url.includes('/download/')) {
                    item.priority = 0.9;
                    item.changefreq = 'weekly';
                } else {
                    item.priority = 0.3;
                    item.changefreq = 'yearly';
                }
                return item;
            },
        }),
    ],
});
