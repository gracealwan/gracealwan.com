# TODO

- [ ] Auto-discover versions with git tags + Vercel API, instead of hand-editing `src/versions.ts`.
      Tags mark releases; a serverless function (`/api/versions`) resolves tags to deployments and
      aliased `vN.gracealwan.com` domains via the Vercel API, and `VersionSwitcher` fetches it
      instead of importing the static manifest.
