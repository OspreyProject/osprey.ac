// Copyright (C) 2026 Osprey Project LLC (https://osprey.ac) All rights reserved.
// This software is not licensed for redistribution or self-hosting.

// Shared provider metadata and result-state mapping, used by both the interactive checker
// (/check/) and the per-URL result pages (/check/<host><path>/). Keeping one source of truth
// means the two surfaces can never drift on provider names, grouping, or status labels.

export interface Provider {
    id: string;
    name: string;
    icon: string;
    group: string;
}

export const groups = ['Official Partners', 'DNS Servers', 'Threat Feeds'] as const;

export const providers: Provider[] = [
    {id: 'alphamountain', name: 'AlphaMountain', icon: 'alphamountain', group: 'Official Partners'},
    {id: 'bforeai', name: 'BforeAI PreCrime', icon: 'bforeai', group: 'Official Partners'},
    {id: 'chainpatrol', name: 'ChainPatrol', icon: 'chainpatrol', group: 'Official Partners'},
    {id: 'izoologic', name: 'iZOOlogic', icon: 'izoologic', group: 'Official Partners'},
    {id: 'precisionsec', name: 'PrecisionSec', icon: 'precisionsec', group: 'Official Partners'},
    {id: 'adguard-dns', name: 'AdGuard DNS', icon: 'adguard', group: 'DNS Servers'},
    {id: 'cloudflare', name: 'Cloudflare', icon: 'cloudflare', group: 'DNS Servers'},
    {id: 'control-d', name: 'Control D', icon: 'controld', group: 'DNS Servers'},
    {id: 'quad9', name: 'Quad9', icon: 'quad9', group: 'DNS Servers'},
    {id: 'switch-ch', name: 'Switch.ch', icon: 'switchch', group: 'DNS Servers'},
    {id: 'aa419', name: 'Artists Against 419', icon: 'aa419', group: 'Threat Feeds'},
    {id: 'openphish', name: 'OpenPhish', icon: 'openphish', group: 'Threat Feeds'},
    {id: 'phishunt-io', name: 'Phishunt.io', icon: 'phishuntio', group: 'Threat Feeds'},
    {id: 'red-flag-domains', name: 'Red Flag Domains', icon: 'red-flag-domains', group: 'Threat Feeds'},
    {id: 'sinking-yachts', name: 'SinkingYachts', icon: 'sinking-yachts', group: 'Threat Feeds'},
    {id: 'threatfox', name: 'THREATfox', icon: 'urlhaus', group: 'Threat Feeds'},
    {id: 'urlhaus', name: 'URLhaus', icon: 'urlhaus', group: 'Threat Feeds'},
    {id: 'urlabuse', name: 'URLAbuse', icon: 'urlabuse', group: 'Threat Feeds'},
    {id: 'validin', name: 'Validin', icon: 'validin', group: 'Threat Feeds'}
];

export interface ResultState {
    label: string;
    tone: string;
}

// Maps each provider result string (matching the proxy's LookupResult values) to a visible state.
export const resultStates: Record<string, ResultState> = {
    waiting: {label: 'Waiting', tone: 'waiting'},
    allowed: {label: 'Safe', tone: 'safe'},
    known_safe: {label: 'Safe', tone: 'safe'},
    phishing: {label: 'Phishing', tone: 'danger'},
    malicious: {label: 'Malicious', tone: 'danger'},
    suspicious: {label: 'Suspicious', tone: 'warn'},
    newly_registered: {label: 'Newly Registered', tone: 'warn'},
    dynamic_dns: {label: 'Dynamic DNS', tone: 'warn'},
    failed: {label: 'Unavailable', tone: 'muted'},
    idle: {label: 'Idle', tone: 'idle'}
};

// The result strings that count as a block/flag.
export const blockingResults = ['phishing', 'malicious', 'suspicious', 'newly_registered', 'dynamic_dns'];

export const providerName = (id: string): string =>
    providers.find(p => p.id === id)?.name ?? id;

// Normalizes a provider name for comparison, matching the client's logic.
export const normalizeName = (value: string): string =>
    value.replace(/[^a-z0-9]/gi, '').toLowerCase();

// Providers whose flag alone warrants an "Unsafe" verdict. A single flag from a provider
// outside this set is downgraded to "Caution". Mirrors the set used in the checker script.
const authoritativeSet = new Set(
    [
        'AlphaMountain',
        'Artists Against 419',
        'OpenPhish',
        'SinkingYachts',
        'THREATfox',
        'URLhaus',
        'Validin'
    ].map(normalizeName)
);

export const isAuthoritative = (name: string): boolean => authoritativeSet.has(normalizeName(name));

export interface SummaryInfo {
    label: string;
    tone: string;
    text: string;
}

// A flagging provider and the result state it returned, enough to weigh the verdict.
export interface FlaggedProvider {
    name: string;
    state: string;
}

// AlphaMountain's normalized name. Flagging alone with a non-red verdict softens the summary.
const alphaMountain = normalizeName('AlphaMountain');

// Derives the summary badge label, tone, and text from the flagging providers.
// This is the server-side twin of updateSummary() in the checker script, so a pre-rendered
// result page reads exactly like the tool does the moment a scan finishes.
export const summarize = (flagged: FlaggedProvider[]): SummaryInfo => {
    const count = flagged.length;

    if (count === 0) {
        return {label: 'Safe', tone: 'safe', text: 'No providers flagged this URL'};
    }

    // A single flag from a non-authoritative provider is a soft signal
    let caution = count === 1 && !isAuthoritative(flagged[0].name);

    // AlphaMountain alone counts as soft when its verdict would not render red
    if (!caution && count === 1 && normalizeName(flagged[0].name) === alphaMountain) {
        const tone = resultStates[flagged[0].state]?.tone;
        caution = tone != null && tone !== 'danger';
    }

    return {
        label: caution ? 'Caution' : 'Unsafe',
        tone: caution ? 'warn' : 'danger',
        text: count === 1 ? '1 provider flagged this URL' : `${count} providers flagged this URL`
    };
};

export interface Faq {
    q: string;
    a: string;
}

// The checker FAQ, rendered on both the tool page and every result page so the two surfaces
// stay identical, and reused to build the FAQPage schema on the tool page.
export const faqs: Faq[] = [
    {
        q: 'How do I check if a website or link is safe?',
        a: 'Paste the full address into the box above and select Scan. Osprey checks the link against the same phishing, malware, and scam sources it uses to protect your browser, then shows what each provider reports. If every provider returns a clean result, the site is very likely safe to open. If one or more flag it, treat the link with caution.'
    },
    {
        q: 'Can I scan a URL for viruses and malware?',
        a: 'Yes. The scanner checks each URL against threat feeds and reputation services that track malware, malicious downloads, and compromised sites. A flagged result means at least one provider considers the page dangerous, so you should avoid it. This checks the address and its reputation, not the contents of a file you have already downloaded.'
    },
    {
        q: 'How do I tell if a link is phishing or a scam?',
        a: 'Phishing and scam pages are often brand new and built to imitate a real login page or store. Osprey acts as a scam website detector by checking anti-phishing feeds and newly registered domain lists, so a link that copies your bank is more likely to be flagged here. A clean result is not a guarantee, so still read the address bar carefully.'
    },
    {
        q: 'Is there a website reputation score?',
        a: 'Rather than giving a single website reputation score, this web reputation check shows you exactly which security vendors flag the domain. Because the check runs through Osprey\'s proxy, the providers only see the proxy rather than you.'
    },
    {
        q: 'How can I check link legitimacy and detect spam?',
        a: 'You can check a link for spam and verify link legitimacy by running it through our free scam checker. We aggregate data from threat feeds to identify domains frequently used in spam campaigns and deceptive advertising.'
    },
    {
        q: 'Is this link scanner tool safe to use?',
        a: 'Yes. When you use this link scanner tool to run a virus scan on a link, our servers process the request. Your browser never connects directly to the suspicious destination, keeping your device safe from potentially malicious code.'
    },
    {
        q: 'How is this different from VirusTotal?',
        a: 'VirusTotal is a broad aggregator of antivirus engines and is well suited to inspecting files and URLs in depth. Osprey\'s checker is narrower by design: it runs the exact set of URL and domain providers that block sites live in your browser, so a result here tells you how Osprey itself would treat the page.'
    },
    {
        q: 'Is the URL scanner free?',
        a: 'Yes. Checking a link is completely free and does not require an account or any personal details. It uses the same protection that ships with the free, open-source Osprey extension.'
    }
];
