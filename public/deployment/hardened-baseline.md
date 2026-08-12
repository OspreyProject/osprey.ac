# Recommended hardened baseline

This is a starting configuration for an MSP that runs Osprey as enforced protection rather than an optional tool the
user can turn off. Every deployment template in this folder already embeds these values, so you can push any one of them
and adjust from there. Replace the placeholder domains and identifiers first.

## What the baseline sets

| Key                             | Value                           | Effect                                                                             |
|---------------------------------|---------------------------------|------------------------------------------------------------------------------------|
| `LockProtectionOptions`         | `true`                          | Provider toggles and provider settings are locked in the options page.             |
| `HideProtectionOptions`         | `true`                          | Protection options are hidden from the popup and options page.                     |
| `DisableClearAllowedWebsites`   | `true`                          | The user cannot clear the allowed-websites list.                                   |
| `DisableResetButtons`           | `true`                          | Reset actions in settings are disabled.                                            |
| `DisableThirdPartyIntegrations` | `true`                          | Third-party direct integrations cannot be enabled from settings.                   |
| `DisableUserAllowlist`          | `true`                          | The user cannot add exclusions, and existing user allowlist entries are ignored.   |
| `HideContinueButtons`           | `true`                          | The warning page continue buttons are hidden, so a user cannot click past a block. |
| `ManagedAllowlist`              | client-internal hosts           | Internal apps stay reachable and the user cannot remove them.                      |
| `ManagedBlocklist`              | client-specific bad hosts       | Blocked before providers run, independent of the built-in feeds.                   |
| `DeviceTag`, `SiteId`           | per-endpoint and per-client ids | Identifiers later reporting attaches to every event.                               |

## Why these three combine

The lock and hide policies alone only freeze or conceal the interface. A determined user can still add a phishing site
to their own allowlist and walk past a warning. `DisableUserAllowlist` removes that escape hatch, and hiding the
continue buttons removes the other one. The managed allow and block lists then give you positive control over what is
always safe and always blocked for a specific client, in a form the user cannot edit away. Together they turn Osprey
from a suggestion into enforced protection.

## What the baseline deliberately leaves open

`HideReportButton` is left `false` so a user who hits a false positive can still report it to you. Turn it on if you
route reports through your own help desk instead. `ProxyBaseUrl` in the templates points at a placeholder self-hosted
backend; remove it, or leave it empty, to use the public Osprey backend. The provider on/off toggles keep their shipped
defaults; tune them per client only when a provider causes false positives.

## Branding

The baseline also sets `BrandProductName`, `BrandLogoUrl`, `SupportUrl`,
`SupportEmail`, and `CustomBlockMessage` so a blocked user sees your name and reaches your help desk. Leave these empty
to render the default Osprey branding.

## Removal protection is separate

This baseline cannot prevent extension removal. Pair it with the browser force-install policy described in
`tamper-protection.md`, or a user who removes the extension loses all protection with nothing to stop them.
