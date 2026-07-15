import {createHash} from 'node:crypto';
import {readdir, readFile, writeFile} from 'node:fs/promises';
import {join} from 'node:path';

const DIST = 'dist';

// Third-party origins the site legitimately talks to. Keep this list tiny and
// explicit; every entry widens the policy
const EXTERNAL = {
    script: ['https://www.googletagmanager.com'],
    connect: ['https://www.google-analytics.com', 'https://www.googletagmanager.com'],
    img: ['https://www.google-analytics.com', 'https://www.googletagmanager.com'],
};

const sha256 = (source) => `'sha256-${createHash('sha256').update(source, 'utf8').digest('base64')}'`;

async function htmlFiles(dir) {
    const found = [];

    for (const entry of await readdir(dir, {withFileTypes: true})) {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) {
            found.push(...(await htmlFiles(path)));
        } else if (entry.name.endsWith('.html')) {
            found.push(path);
        }
    }
    return found;
}

const ALLOWLIST = new URL('./inline-scripts.json', import.meta.url);
const UPDATING = process.env.UPDATE_INLINE_ALLOWLIST === '1';

let approved = new Set();

try {
    approved = new Set(JSON.parse(await readFile(ALLOWLIST, 'utf8')));
} catch {
    if (!UPDATING) {
        throw new Error(
            '[security-headers] scripts/inline-scripts.json is missing. Generate it once with:\n' +
            '    UPDATE_INLINE_ALLOWLIST=1 npm run build',
        );
    }
}

const seen = new Set();

function checkApproved(hash, source, file) {
    seen.add(hash);

    if (UPDATING || approved.has(hash)) {
        return;
    }

    throw new Error(
        `[security-headers] Unapproved inline script in ${file}.\n\n` +
        `  hash: ${hash}\n` +
        `  code: ${source.trim().slice(0, 160)}\n\n` +
        'If you changed this script on purpose, re-approve it with:\n' +
        '    UPDATE_INLINE_ALLOWLIST=1 npm run build\n' +
        'If you did not, something injected code into the build. Do not ship it.',
    );
}

const directives = (scriptHashes, styleHashes) => [
    "default-src 'self'",
    `script-src 'self' ${EXTERNAL.script.join(' ')} ${scriptHashes.join(' ')}`,
    `style-src 'self' ${styleHashes.join(' ')}`,
    `img-src 'self' data: ${EXTERNAL.img.join(' ')}`,
    "font-src 'self'",
    `connect-src 'self' ${EXTERNAL.connect.join(' ')}`,
    "base-uri 'self'",
    "form-action 'none'",
    "object-src 'none'",
    'upgrade-insecure-requests',
].join('; ');

let pages = 0;

for (const file of await htmlFiles(DIST)) {
    let html = await readFile(file, 'utf8');

    // Executable inline scripts get hashed AND allowlist-checked.
    // JSON-LD (type=application/ld+json) is data, not script, and is not hashed.
    const scriptHashes = [...html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi)]
        .filter((match) => !/type\s*=\s*["']application\/ld\+json["']/i.test(match[1]))
        .map((match) => {
            const hash = sha256(match[2]);
            checkApproved(hash, match[2], file);
            return hash;
        });

    const styleHashes = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)]
        .map((match) => sha256(match[1]));

    const csp = directives([...new Set(scriptHashes)], [...new Set(styleHashes)]);
    const meta = `<meta http-equiv="Content-Security-Policy" content="${csp}">`;

    html = html.replace(/<meta charset="utf-8"\s*\/?>/i, (m) => `${m}\n${meta}`);
    await writeFile(file, html);
    pages += 1;
}

if (UPDATING) {
    await writeFile(ALLOWLIST, `${JSON.stringify([...seen].sort(), null, 2)}\n`);
    console.log(`[security-headers] allowlist UPDATED with ${seen.size} inline script hashes. Review the diff.`);
}

console.log(`[security-headers] CSP injected into ${pages} pages; ${seen.size} inline scripts approved.`);
