# Deploying Osprey with Microsoft Intune

Intune configures the same Chromium extension policy as Group Policy; it just delivers it a different way. This guide
covers Chrome and Edge, which is where Intune is used in practice. Firefox on Intune-managed devices is deployed with
the files in `../firefox/`, delivered as a Win32 app or platform script rather than through Intune's browser policy
surfaces.

Use the extension ids from the main `README.md`: Chrome
`jmnpibhfpmpfjhhkmpadlbgjnbhpjgnd`, Edge `nopglhplnghfhpniofkcopmhbjdonlgn`.

## Recommended: import the Osprey ADMX

The `../admx/Osprey.admx` and `../admx/en-US/Osprey.adml` template gives Intune a full settings UI, the same one it
gives on-prem Group Policy, and it covers every Osprey key for both Chrome and Edge.

1. In the Intune admin center, go to Devices, then Configuration, then Import ADMX. Import `Osprey.admx` with its
   `en-US/Osprey.adml`.
2. Create a profile of type Templates, then Imported Administrative templates.
3. The profile shows an Osprey: Browser Protection category with a Google Chrome / Chromium branch and a Microsoft Edge
   branch. Set the keys you need, using
   `../hardened-baseline.md` as a starting point.
4. Assign the profile to your device groups.

Because the template writes to the browser's `3rdparty\extensions\<id>\policy`
registry path, the values land in exactly the place Chrome and Edge read managed storage from, and take effect with no
user action.

## Force-install the extension

Force-install is a browser policy, not an Osprey policy. Set it alongside the settings above.

For Edge, the Settings Catalog has this built in. Create a Settings Catalog profile, add Microsoft Edge, then
Extensions, then "Control which extensions are installed silently", and add
`nopglhplnghfhpniofkcopmhbjdonlgn;https://edge.microsoft.com/extensionwebstorebase/v1/crx`.

For Chrome, the same control exists once Google's Chrome ADMX is imported, under
"Configure the list of force-installed apps and extensions"; add
`jmnpibhfpmpfjhhkmpadlbgjnbhpjgnd;https://clients2.google.com/service/update2/crx`.

## Alternative: custom OMA-URI

If you do not want to import ADMX, you can push each value with a custom profile (Templates, then Custom). This is more
manual, and you must ingest the Osprey ADMX first with an ADMXInstall OMA-URI, then reference each policy by its
generated path. The imported-ADMX method above is simpler and is preferred; use OMA-URI only where your tenant requires
it.

Ingest the template once:

- OMA-URI: `./Device/Vendor/MSFT/Policy/ConfigOperations/ADMXInstall/Osprey/Policy/OspreyAdmx`
- Data type: String
- Value: the full contents of `../admx/Osprey.admx`

Then set individual keys with OMA-URIs of the form
`./Device/Vendor/MSFT/Policy/Config/Osprey~<category-path>~<PolicyName>`, matching the category and policy names in the
ADMX. Confirm each generated path in
`edge://policy` or `chrome://policy` after the first sync, because the exact path depends on the namespace and category
names in the imported template.

## Verify

On an enrolled device, open `edge://policy` or `chrome://policy`, reload policies, and filter for the extension id. Each
Osprey key you set should show with status OK and the expected value.
