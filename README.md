# osprey.ac

The Osprey website, built using Astro, deployed to GitHub Pages.

## Development

To run the website locally, you need to have Node.js installed. Then, follow these steps:

```
npm install
npm run dev
```

## Security, linting, and testing

Run each check from the repository root.

- [x] Astro type check (also run by CI on every pull request): `npx astro check`
- [x] npm audit (high severity and above fails CI): `npm audit --audit-level=high`
- [x] Dependency Review (blocks pull requests that introduce known-vulnerable packages): runs on pull requests only; `npm audit --audit-level=high` is the local equivalent
- [x] DevSkim (security linting): `dotnet tool install --global Microsoft.CST.DevSkim.CLI`, then `devskim analyze -I src`
- [x] Dependabot dependency updates: `gh api repos/OspreyProject/osprey.ac/dependabot/alerts` lists open alerts
- [x] GitHub secret scanning: `gh api repos/OspreyProject/osprey.ac/secret-scanning/alerts` lists open alerts
