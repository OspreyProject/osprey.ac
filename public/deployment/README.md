# Osprey deployment templates

This folder contains ready-to-push configuration for deploying and configuring Osprey: Browser Protection across a
managed fleet. It covers every managed policy the extension reads, on every supported browser and operating system, so
an administrator can deploy without hand-writing raw registry keys.

Every template embeds the same hardened example configuration. Values such as
`example.example` domains and `REPLACE-WITH-...` tokens are placeholders you edit before pushing. See
`policy-reference.md` for the full list of keys and
`hardened-baseline.md` for what the example enforces and why.

## Extension IDs

The extension has a different id in each store. Use the right one for each browser family.

| Store                                               | Extension id                       |
|-----------------------------------------------------|------------------------------------|
| Chrome Web Store (Chrome, Chromium, Brave, Vivaldi) | `jmnpibhfpmpfjhhkmpadlbgjnbhpjgnd` |
| Microsoft Edge Add-ons                              | `nopglhplnghfhpniofkcopmhbjdonlgn` |
| Firefox Add-ons (AMO)                               | `osprey@foulest.net`               |

## What is here

| Path                                              | Use                                                                                                    |
|---------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| `admx/Osprey.admx`, `admx/en-US/Osprey.adml`      | Group Policy administrative template for Chrome and Edge. Every key gets a real UI in `gpedit` / GPMC. |
| `intune/README.md`                                | Microsoft Intune deployment for Chrome and Edge, including ADMX ingestion and force-install.           |
| `macos/*.mobileconfig`                            | macOS configuration profiles for managed Chrome and Edge (settings plus force-install).                |
| `macos/*.plist`                                   | A plain plist form of the Chrome extension settings for MDMs that take a custom plist.                 |
| `linux/*.json`                                    | Linux managed-policy JSON for Chrome, Chromium, and Edge, each named for its target path.              |
| `firefox/managed-storage/osprey@foulest.net.json` | Firefox native managed-storage manifest.                                                               |
| `firefox/policies.json`                           | Firefox enterprise policy with the `3rdparty.Extensions` block and force-install.                      |
| `windows/*.reg`                                   | Registry import files for Chrome, Edge, and the Firefox managed-storage pointer.                       |
| `policy-reference.md`                             | Every policy key: type, default, constraints, description.                                             |
| `hardened-baseline.md`                            | The recommended starting configuration.                                                                |
| `tamper-protection.md`                            | Why removal protection is a browser policy, not an Osprey policy.                                      |

## Where each browser reads managed settings

Chrome, Edge, Chromium, Brave, and Vivaldi share the Chromium managed-storage model but each vendor uses its own path.
Firefox does not read Chromium managed storage at all and needs its own manifest or policy file. Getting the path wrong
is the most common reason a deployment silently applies on some browsers and not others, so the paths per operating
system are listed below.

### Chromium family managed-storage path

For every Chromium browser the value form is identical: a `policy` key under
`3rdparty\extensions\<extension-id>` on Windows, a preference domain
`<browser-domain>.extensions.<extension-id>` on macOS, and a
`3rdparty.extensions.<extension-id>` block in a managed JSON file on Linux.

| Browser  | Windows registry root                        | macOS preference domain | Linux managed JSON directory        |
|----------|----------------------------------------------|-------------------------|-------------------------------------|
| Chrome   | `HKLM\SOFTWARE\Policies\Google\Chrome`       | `com.google.Chrome`     | `/etc/opt/chrome/policies/managed/` |
| Chromium | `HKLM\SOFTWARE\Policies\Chromium`            | `org.chromium.Chromium` | `/etc/chromium/policies/managed/`   |
| Edge     | `HKLM\SOFTWARE\Policies\Microsoft\Edge`      | `com.microsoft.Edge`    | `/etc/opt/edge/policies/managed/`   |
| Brave    | `HKLM\SOFTWARE\Policies\BraveSoftware\Brave` | `com.brave.Browser`     | `/etc/brave/policies/managed/`      |
| Vivaldi  | `HKLM\SOFTWARE\Policies\Vivaldi`             | `com.vivaldi.Vivaldi`   | `/etc/vivaldi/policies/managed/`    |

On Windows the full key is the root above followed by
`\3rdparty\extensions\<extension-id>\policy`. `HKCU` works in place of `HKLM` for per-user testing. Brave installs
Osprey from the Chrome Web Store, so it uses the Chrome extension id. Vivaldi's enterprise-policy support is partial and
varies by version; confirm applied values at `vivaldi://policy` before relying on it.

### Firefox managed-storage path

Firefox reads Osprey settings one of two ways. Both accept the same key names.

Native managed-storage manifest, filename `osprey@foulest.net.json`, in this format: a `name` equal to the extension id,
a `type` of `storage`, and a `data`
object holding the policy values. Place it at:

| OS      | Location                                                                                                                                                  |
|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Windows | Any path, pointed to by the default value of `HKLM\SOFTWARE\Mozilla\ManagedStorage\osprey@foulest.net`. See `windows/osprey-firefox-managed-storage.reg`. |
| macOS   | `/Library/Application Support/Mozilla/ManagedStorage/osprey@foulest.net.json`                                                                             |
| Linux   | `/usr/lib/mozilla/managed-storage/osprey@foulest.net.json` (per user: `~/.mozilla/managed-storage/`)                                                      |

Enterprise policy file `policies.json`, using the
`policies.3rdparty.Extensions.osprey@foulest.net` block. Place it at:

| OS      | Location                                                                                                                                                |
|---------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| Windows | `<install dir>\distribution\policies.json`, or set string values under `HKLM\SOFTWARE\Policies\Mozilla\Firefox\3rdparty\Extensions\osprey@foulest.net`. |
| macOS   | `Firefox.app/Contents/Resources/distribution/policies.json`                                                                                             |
| Linux   | `/etc/firefox/policies/policies.json` (or `<install dir>/distribution/policies.json`)                                                                   |

Prefer the native managed-storage manifest when you set `ManagedAllowlist`,
`ManagedBlocklist`, or `ManagedProviderSettings`. Firefox delivers arrays and objects set through the Windows registry
`3rdparty.Extensions` path as strings, which the extension cannot use. The native manifest preserves real types.

## Force-install (removal protection)

None of the templates here can stop a user from removing the extension. That is done with the browser's own
force-install policy, which is separate from Osprey's settings. It is documented, not shipped, in
`tamper-protection.md`. In short:

| Browser                                | Force-install policy                                                                      | Where                                         |
|----------------------------------------|-------------------------------------------------------------------------------------------|-----------------------------------------------|
| Chrome, Chromium, Edge, Brave, Vivaldi | `ExtensionInstallForcelist` or `ExtensionSettings` (`installation_mode: force_installed`) | Same policy root as the table above           |
| Firefox                                | `ExtensionSettings` (`installation_mode: force_installed`, `install_url`)                 | `policies.json` (see `firefox/policies.json`) |

## Quick start per platform

- Windows, on-prem Active Directory: copy `admx/Osprey.admx` to
  `\\<domain>\SYSVOL\<domain>\Policies\PolicyDefinitions\` and
  `admx/en-US/Osprey.adml` to the `en-US` subfolder, then configure under Computer Configuration. For a fast test
  without GPO, edit and import
  `windows/osprey-chrome.reg` or `windows/osprey-edge.reg`.
- Windows, Intune: follow `intune/README.md`.
- macOS: edit and deploy the matching `macos/*.mobileconfig` through your MDM.
- Linux: copy the matching `linux/*.json` file to the directory in its name (for example
  `linux/chrome-etc-opt-chrome-policies-managed-osprey.json` goes to
  `/etc/opt/chrome/policies/managed/osprey.json`).
- Firefox: deploy `firefox/managed-storage/osprey@foulest.net.json` to the path in the Firefox table above, or deploy
  `firefox/policies.json`.

After deploying, confirm the values applied. Chromium browsers list them at
`chrome://policy`, `edge://policy`, `brave://policy`, or `vivaldi://policy`. Firefox lists them at `about:policies` and
`about:studies` is unrelated. The extension applies managed values with no user action and no restart.
