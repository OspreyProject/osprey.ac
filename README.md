# osprey.ac

The Osprey website, built using Astro, deployed to GitHub Pages.

## Development

To run the website locally, you need to have Node.js installed. Then, follow these steps:

```
npm install
npm run dev
```

## Security, linting, and testing

- [x] Astro type check (`astro check`, run by the CI workflow on every pull request)
- [x] npm audit (high severity and above fails CI)
- [x] Dependency Review (blocks pull requests that introduce known-vulnerable packages)
- [x] DevSkim (security linting)
- [x] Dependabot dependency updates
- [x] GitHub secret scanning
