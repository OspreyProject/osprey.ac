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
