# Recommended hardened baseline

This is a starting configuration for an MSP that runs Osprey as enforced protection rather than an optional tool the
user can turn off. Every deployment template in this folder already embeds these values, so you can push any one of them
and adjust from there. Replace the placeholder domains and identifiers first.

## What the baseline sets

| Key                             | Value                           | Effect                                                                             |
|---------------------------------|---------------------------------|------------------------------------------------------------------------------------|
| `LockProviderSettings`         | `true`                          | Provider toggles and provider settings are locked in the options page.             |
| `HideProviderControls`         | `true`                          | Provider controls are hidden from the popup and options page.                     |
| `LockUserAllowlist`   | `true`                          | The user cannot edit or clear the allowed-websites list, but existing entries still apply.                                   |
| `DisableSettingsReset`           | `true`                          | Reset actions in settings are disabled.                                            |
| `DisableThirdPartyProviders` | `true`                          | Third-party providers cannot be enabled from settings.                   |
| `DisableUserAllowlist`          | `true`                          | The user cannot add exclusions, and existing user allowlist entries are ignored.   |
| `HideWarningProceedButton`           | `true`                          | The warning page proceed button is hidden, so a user cannot click past a block. |
| `ManagedAllowlist`              | client-internal hosts           | Internal apps stay reachable and the user cannot remove them.                      |
| `ManagedBlocklist`              | client-specific bad hosts       | Blocked before providers run, independent of the built-in feeds.                   |
| `DeviceTag`, `SiteId`           | per-endpoint and per-client ids | Identifiers reporting attaches to every event and heartbeat.                       |

## Why these three combine

The lock and hide policies alone only freeze or conceal the interface. A determined user can still add a phishing site
to their own allowlist and walk past a warning. `DisableUserAllowlist` removes that escape hatch, and hiding the
proceed button removes the other one. The managed allow and block lists then give you positive control over what is
always safe and always blocked for a specific client, in a form the user cannot edit away. Together they turn Osprey
from a suggestion into enforced protection.

## What the baseline deliberately leaves open

`HideWarningReportButton` is left `false` so a user who hits a false positive can still report it to you. Turn it on if you
route reports through your own help desk instead. `ProxyBaseUrl` in the templates points at a placeholder self-hosted
backend; remove it, or leave it empty, to use the public Osprey backend. Per-provider `enabled` values in `ManagedProviderSettings` keep their shipped
defaults; tune them per client only when a provider causes false positives.

## Branding

The baseline also sets `BrandName`, `BrandLogoUrl`, `SupportUrl`,
`SupportEmail`, and `CustomWarningMessage` so a blocked user sees your name and reaches your help desk. Leave these empty
to render the default Osprey branding.

## Removal protection is separate

This baseline cannot prevent extension removal. Pair it with the browser force-install policy described in
`tamper-protection.md`, or a user who removes the extension loses all protection with nothing to stop them.

## Central management and reporting

The templates also set `ManagedConfigUrl`, `ReportingEndpoint`, and `ReportingAuthToken` to placeholder values, and
`ProxyApiKey` alongside `ProxyBaseUrl`. `ManagedConfigUrl` points every endpoint at one hosted JSON file per client, so
later setting changes need no Group Policy or Intune re-push. `ReportingEndpoint` streams detections, overrides, and
health heartbeats to your receiver, which is your client's ingest URL from the Osprey Management Console, or your own
webhook or SIEM if you run without it, and a gap in heartbeats reveals a removed or disabled install. `ProxyApiKey`
is the per-tenant key a self-hosted proxy authenticates, sent as the `X-Osprey-Tenant-Key` header and never sent to the
public backend. Replace the placeholders with your real URLs and keys, or remove the keys to run without central
management.
