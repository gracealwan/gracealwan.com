# gracealwan.com
Works in progress personal website!
```
npm install # install dependencies
npm start # start
# open at localhost:3000
npm run verify # lint (oxlint + Stylelint) and typecheck
npm run build # verify, bundle to dist/, then smoke-test the bundle in jsdom
```

`npm run build` is what Vercel runs on every push, so a lint error, type error, or
a production bundle that fails to render blocks the deploy.

## Cutting a new major version

The version button (bottom-right) reads from `src/versions.ts`, a hand-maintained
manifest bundled at build time. `current` is the label on the button; `majors` lists
the latest release of each major, newest first. Each frozen major lives at its own
`vN.gracealwan.com` subdomain. To ship a new major (examples use `v2` as the outgoing major):

1. Before pushing the breaking change, find the last production deployment of the
   outgoing major (Vercel dashboard, or `list_deployments` via the Vercel API/MCP).
2. Add DNS for the subdomain. DNS is at Namecheap (Domain List → Manage →
   Advanced DNS), not Vercel. Add a CNAME with host `v2` and the same target as the
   `www` record.
3. Point the subdomain at that deployment with a plain alias:
   `vercel alias set <deployment-url> v2.gracealwan.com`, or `assign_alias` via the
   API/MCP. Do **not** add it as a project domain. Project domains without a git
   branch move to every new production deployment, so the subdomain would silently
   start serving the new major. If the alias fails with `cert_missing`, issue a cert
   for the subdomain first (`issue_cert`) once DNS resolves.
4. Make the subdomain public. The project uses Vercel Authentication with Standard
   Protection, which only exempts the *current* production domains. An alias to an
   older deployment redirects to the Vercel login. In the dashboard, open Settings →
   Deployment Protection → Deployment Protection Exceptions → Add Domain, and add
   the subdomain. Check it loads logged out before continuing.
5. In the same commit that ships the new major, update `src/versions.ts`:
   - point the outgoing major's entry at its frozen subdomain
   - add the new major's entry at the top of `majors`
   - bump `current` to the new version
6. Push to `main`; Vercel auto-deploys as usual.
