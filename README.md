# gracealwan.com
Works in progress personal website!
```
npm install # install dependencies
npm start # start
# open at localhost:3000
```

## Cutting a new major version

The version button (bottom-right) reads from `src/versions.js`, a hand-maintained
manifest bundled at build time. `current` is the label on the button; `majors` lists
the latest release of each major, newest first. To ship a new major:

1. Before merging the breaking change, find the last production deployment of the
   outgoing major (Vercel dashboard, or `list_deployments` via the Vercel API/MCP).
2. In Vercel, add a project domain for the frozen version (e.g. `v1.gracealwan.com`)
   and alias it to that deployment ID. Plain `*.vercel.app` deployment URLs sit behind
   this project's SSO protection; a `gracealwan.com` subdomain counts as a custom
   domain and is publicly reachable.
3. In the same commit that ships the new major, update `src/versions.js`:
   - point the outgoing major's entry at its frozen subdomain
   - add the new major's entry at the top of `majors`
   - bump `current` to the new version
4. Push to `main`; Vercel auto-deploys as usual.
