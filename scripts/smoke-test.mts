// Runs the production bundle in jsdom and fails if the version button never renders,
// catching bundles that pass lint and typecheck but crash in the browser.
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const DIST_URL = new URL('../dist/', import.meta.url);
const RENDER_WAIT_MS = 500;

const html = await readFile(new URL('index.html', DIST_URL), 'utf8');
const bundle = await readFile(new URL('bundle.js', DIST_URL), 'utf8');
const { window } = new JSDOM(html, { runScripts: 'outside-only', pretendToBeVisual: true });

try {
  window.eval(bundle);
} catch (error) {
  process.stderr.write(`Smoke test failed: bundle.js threw on load: ${String(error)}\n`);
  process.exit(1);
}

// React 18 renders asynchronously; give it a moment before checking.
await new Promise((resolve) => setTimeout(resolve, RENDER_WAIT_MS));
const button = window.document.querySelector('button[popovertarget]');
if (!button) {
  process.stderr.write('Smoke test failed: version button did not render\n');
  process.exit(1);
}

process.stdout.write(`Smoke test passed: rendered ${button.textContent}\n`);
