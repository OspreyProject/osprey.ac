# Removal protection and tamper resistance

Osprey has no policy that prevents a user from disabling or removing the extension. That is by design. Preventing
removal is a browser-level capability, not something an extension can enforce about itself, so it is configured through
the browser's force-install policy rather than through any key in Osprey's schema. This note documents how to set it,
because the deployment templates in this folder cannot do it for you.

## Chromium browsers (Chrome, Chromium, Edge, Brave, Vivaldi)

Use either `ExtensionInstallForcelist` or the richer `ExtensionSettings` policy on the same policy root the browser
reads managed storage from (see the table in
`README.md`). Force-installed extensions install automatically and the user cannot disable or remove them.

`ExtensionInstallForcelist` takes entries of the form
`<extension-id>;<update-url>`. For the Chrome Web Store build the update url is
`https://clients2.google.com/service/update2/crx`. Example, as a Linux managed JSON fragment for Chrome:

```json
{
  "ExtensionInstallForcelist": [
    "jmnpibhfpmpfjhhkmpadlbgjnbhpjgnd;https://clients2.google.com/service/update2/crx"
  ]
}
```

The macOS `.mobileconfig` files in `macos/` already include an
`ExtensionSettings` force-install payload, so on macOS the templates handle both settings and removal protection.

For Edge, use the Edge Add-ons id `nopglhplnghfhpniofkcopmhbjdonlgn` and the Edge update url
`https://edge.microsoft.com/extensionwebstorebase/v1/crx`. Brave and Vivaldi install from the Chrome Web Store and use
the Chrome id and update url.

## Firefox

Firefox force-install is set with `ExtensionSettings` in `policies.json`, using
`installation_mode: force_installed` and an `install_url` that points at the signed XPI. The `firefox/policies.json`
template in this folder already contains this block. A force-installed Firefox add-on cannot be removed or disabled by
the user.

## What removal protection does not cover

Force-install stops removal from inside the browser. It does not stop a local administrator from removing the policy
itself, uninstalling the browser, or installing a different browser with no policy. Those are endpoint-management
concerns, handled by locking down admin rights and by controlling which browsers are allowed on the fleet, not by
Osprey. Outbound reporting closes the remaining gap: a missing heartbeat reveals an endpoint where the extension was
removed or disabled despite these policies, surfaced as a silent device in the Osprey Management Console or by your own
receiver's heartbeat-gap alerting.
