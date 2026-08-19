import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');
const dist = path.join(root, 'dist');
const products = JSON.parse(await fs.readFile(path.join(root, 'src', 'data', 'products.json'), 'utf8')).products || [];
const content = JSON.parse(await fs.readFile(path.join(root, 'src', 'data', 'site-content.json'), 'utf8'));
const insights = Array.isArray(content.insights) ? content.insights : content.insights?.items || [];
const expectedRoutes = 16 + products.filter((item) => item.published !== false && item.slug).length * 2 + insights.filter((item) => item?.slug).length * 2;

async function filesUnder(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesUnder(full));
    else files.push(full);
  }
  return files;
}

const files = await filesUnder(dist);
const routeIndexes = files.filter((file) => path.basename(file) === 'index.html');
const app = await fs.readFile(path.join(dist, 'app.js'), 'utf8');
const settings = JSON.parse(await fs.readFile(path.join(dist, 'data', 'settings.json'), 'utf8'));
const required = ['index.html', '404.html', 'sitemap.xml', 'robots.txt', 'app.js', 'styles.css', '.nojekyll'];
for (const name of required) {
  try { await fs.access(path.join(dist, name)); } catch { throw new Error(`Missing required output: ${name}`); }
}
if (routeIndexes.length !== expectedRoutes) throw new Error(`Expected ${expectedRoutes} route indexes, found ${routeIndexes.length}.`);
if (app.includes("fetch('/api/") || app.includes('fetch("/api/')) throw new Error('Static app still contains a runtime API submission.');
if (app.includes('href="/admin/"')) throw new Error('Static app still links to the private admin console.');
if (settings.mapProvider !== 'baidu-embed') throw new Error('Static map provider must default to baidu-embed.');
if (settings.formspreeFormId !== 'xbgrpbkd') throw new Error('Formspree form ID is not configured.');
if (!app.includes("const FORMSPREE_FORM_ID = 'xbgrpbkd'") || !app.includes("formspree('initForm'") || !app.includes('Send Inquiry')) throw new Error('Formspree inquiry integration is missing.');
if (!app.includes('copy-rfq')) throw new Error('Inquiry copy fallback is missing.');

console.log(`Validated ${files.length} files and ${routeIndexes.length} localized routes.`);
