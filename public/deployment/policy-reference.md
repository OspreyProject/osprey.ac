# Osprey policy reference

Every key below is a property of the extension's managed-storage schema (`src/main/policies.json`). All 44 keys are read
on every supported browser through that browser's managed-storage mechanism. Keys left unset fall back to the defaults
shown here.

### UI hardening and lockdown

| Key                             | Type    | Default | Description                                                                                                            |
|---------------------------------|---------|---------|------------------------------------------------------------------------------------------------------------------------|
| `HideContinueButtons`           | boolean | false   | If true, the warning page continue buttons are hidden.                                                                 |
| `HideReportButton`              | boolean | false   | If true, the warning page report button is hidden.                                                                     |
| `HideProtectionOptions`         | boolean | false   | If true, protection options are hidden from the popup and options page.                                                |
| `LockProtectionOptions`         | boolean | false   | If true, provider toggles and provider settings are locked in the options page.                                        |
| `DisableClearAllowedWebsites`   | boolean | false   | If true, the clear allowed websites button is disabled.                                                                |
| `DisableResetButtons`           | boolean | false   | If true, reset actions in the settings page are disabled.                                                              |
| `DisableThirdPartyIntegrations` | boolean | false   | If true, third-party direct integrations are disabled and cannot be enabled from settings.                             |
| `DisableUserAllowlist`          | boolean | false   | If true, the end user cannot add any allowlist entries or exclusions, and existing user allowlist entries are ignored. |

### Managed lists and provider tuning

| Key                       | Type             | Default        | Description                                                                                                                                                                                                                      |
|---------------------------|------------------|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `ManagedAllowlist`        | array of strings | (empty list)   | Host or URL patterns that are always treated as safe. The end user cannot remove these. Examples: "intranet.example.com", "*.corp.example.com", "https://apps.example.com/portal".                                               |
| `ManagedBlocklist`        | array of strings | (empty list)   | Host or URL patterns that are always blocked, evaluated before the threat providers run. Examples: "bad.example.com", "*.malware.example", "https://phish.example/login".                                                        |
| `ManagedProviderSettings` | object           | (empty object) | Per-provider overrides keyed by provider id. Each value may set "bypassBlockingThreshold" (boolean), "requestTimeoutMs" (integer between 1000 and 60000), and "blockCategories" (an object mapping a category key to a boolean). |

### Branding (warning page and popup)

| Key                  | Type   | Default | Description                                                                                                                                                                           |
|----------------------|--------|---------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `BrandLogoUrl`       | string | (empty) | Image URL or data: image string used for the logo on the warning page and popup. When empty, the default Osprey logo is shown.                                                        |
| `BrandProductName`   | string | (empty) | Name shown in the warning page banner and popup, replacing the default Osprey product name. When empty, the default name is shown.                                                    |
| `SupportUrl`         | string | (empty) | Support or help-desk URL shown as a contact link on the warning page and popup. Must be an http(s) URL, for example "https://help.msp.example". When empty, no support link is shown. |
| `SupportEmail`       | string | (empty) | Support email address shown as a contact link on the warning page. When empty, no email link is shown.                                                                                |
| `CustomBlockMessage` | string | (empty) | Optional override for the lead sentence on the warning page. When empty, the default block message is shown.                                                                          |

### Backend, identity, and cache

| Key                      | Type    | Default  | Description                                                                                                                                                                                                                |
|--------------------------|---------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `ProxyBaseUrl`           | string  | (empty)  | Overrides the backend origin the extension sends lookups to. Must be an http(s) origin, for example "https://osprey.msp.example". When empty, the default public backend is used.                                          |
| `ProxyApiKey`            | string  | (empty)  | Per-tenant API key presented to a self-hosted proxy as the `X-Osprey-Tenant-Key` header on every lookup. Only sent when `ProxyBaseUrl` is set, so the key is never sent to the public backend. When empty, no key is sent. |
| `DeviceTag`              | string  | (empty)  | Opaque identifier for this endpoint, attached to reported events by later features. Has no visible effect on its own.                                                                                                      |
| `SiteId`                 | string  | (empty)  | Opaque identifier for the client organization this endpoint belongs to, attached to reported events by later features. Has no visible effect on its own.                                                                   |
| `CacheExpirationSeconds` | integer | `604800` | Cache entry lifetime in seconds. Range 60 to 2592000.                                                                                                                                                                      |
| `MetaDefenderApiKey`     | string  | (empty)  | Managed API key for the MetaDefender integrations.                                                                                                                                                                         |

### Central management and reporting

| Key                  | Type   | Default | Description                                                                                                                                                                                                                                                                                                                                                                             |
|----------------------|--------|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `ManagedConfigUrl`   | string | (empty) | An http(s) URL to a JSON configuration document the extension fetches on startup and every 60 minutes. Fetched values are merged under managed storage: anything set locally always wins, and the document fills in the rest. On a fetch failure the last successfully fetched document is kept. This key can only be set through managed storage; a fetched document cannot change it. |
| `ReportingEndpoint`  | string | (empty) | An http(s) URL the extension POSTs detection and override events and periodic health heartbeats to. When empty, no events or heartbeats are sent.                                                                                                                                                                                                                                       |
| `ReportingAuthToken` | string | (empty) | Optional bearer token sent as the Authorization header on every reporting request. When set, each POST carries "Authorization: Bearer <token>". When empty, no Authorization header is sent.                                                                                                                                                                                            |

### Provider on/off toggles

| Key                      | Type    | Default | Description                                    |
|--------------------------|---------|---------|------------------------------------------------|
| `AlphaMountainEnabled`   | boolean | true    | Managed enabled state for AlphaMountain.       |
| `BforeAIPreCrimeEnabled` | boolean | true    | Managed enabled state for BforeAI PreCrime.    |
| `ChainPatrolEnabled`     | boolean | true    | Managed enabled state for ChainPatrol.         |
| `iZOOlogicEnabled`       | boolean | true    | Managed enabled state for iZOOlogic.           |
| `PrecisionSecEnabled`    | boolean | true    | Managed enabled state for PrecisionSec.        |
| `AdGuardDNSEnabled`      | boolean | true    | Managed enabled state for AdGuard DNS.         |
| `AA419Enabled`           | boolean | true    | Managed enabled state for Artists Against 419. |
| `CloudflareEnabled`      | boolean | true    | Managed enabled state for Cloudflare.          |
| `ControlDEnabled`        | boolean | false   | Managed enabled state for Control D.           |
| `OpenPhishEnabled`       | boolean | true    | Managed enabled state for OpenPhish.           |
| `PhishuntIOEnabled`      | boolean | true    | Managed enabled state for Phishunt.io.         |
| `Quad9Enabled`           | boolean | true    | Managed enabled state for Quad9.               |
| `RedFlagDomainsEnabled`  | boolean | true    | Managed enabled state for Red Flag Domains.    |
| `SinkingYachtsEnabled`   | boolean | true    | Managed enabled state for SinkingYachts.       |
| `SwitchCHEnabled`        | boolean | true    | Managed enabled state for Switch.ch.           |
| `THREATfoxEnabled`       | boolean | true    | Managed enabled state for THREATfox.           |
| `URLhausEnabled`         | boolean | true    | Managed enabled state for URLhaus.             |
| `URLAbuseEnabled`        | boolean | true    | Managed enabled state for URLAbuse.            |
| `ValidinEnabled`         | boolean | true    | Managed enabled state for Validin.             |

### Notes on complex values

- `ManagedAllowlist` and `ManagedBlocklist` are ordered lists of host or URL patterns. `*` is a wildcard (for example
  `*.corp.example.com`). The blocklist is evaluated before any threat provider runs; the allowlist short-circuits
  providers to allowed.
- `ManagedProviderSettings` is keyed by provider id (for example `alphamountain`, `cloudflare`, `urlhaus`). Each entry
  may set `bypassBlockingThreshold` (boolean), `requestTimeoutMs` (integer, 1000 to 60000), and `blockCategories` (an
  object mapping a provider-specific category key such as `suspicious` or `newly_registered` to a boolean).
- On the Windows registry and the Firefox `3rdparty.Extensions` path, arrays and objects arrive as strings. Use the
  numbered-subkey form for lists (shown in the `.reg` templates) and a native managed-storage manifest for objects where
  possible. See the platform notes in the deployment README.
