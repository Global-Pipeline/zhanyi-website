import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const srcDir = path.join(projectRoot, 'src');
const distDir = path.join(projectRoot, 'dist');
const config = JSON.parse(await fs.readFile(path.join(projectRoot, 'site.config.json'), 'utf8'));
const productsData = JSON.parse(await fs.readFile(path.join(srcDir, 'data', 'products.json'), 'utf8'));
const content = JSON.parse(await fs.readFile(path.join(srcDir, 'data', 'site-content.json'), 'utf8'));
const settings = JSON.parse(await fs.readFile(path.join(srcDir, 'data', 'settings.json'), 'utf8'));

if (path.dirname(distDir) !== projectRoot) throw new Error('Refusing to build outside the static project directory.');

function text(value, locale, fallback = '') {
  if (value == null) return fallback;
  if (typeof value === 'string' || typeof value === 'number') return String(value).trim() || fallback;
  if (Array.isArray(value)) return value.map((item) => text(item, locale)).filter(Boolean).join(', ') || fallback;
  if (typeof value === 'object') return text(value[locale] ?? value.en ?? value.zh ?? value.title ?? value.name, locale, fallback);
  return fallback;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function normalizeDomain(value) {
  return String(value || '').trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '');
}

function githubPagesUrl() {
  const repository = String(process.env.GITHUB_REPOSITORY || '').trim();
  if (!repository.includes('/')) return '';
  const [owner, repositoryName] = repository.split('/');
  if (!owner || !repositoryName) return '';
  return repositoryName.toLowerCase() === `${owner.toLowerCase()}.github.io`
    ? `https://${owner}.github.io`
    : `https://${owner}.github.io/${repositoryName}`;
}

const customDomain = normalizeDomain(process.env.CUSTOM_DOMAIN || config.customDomain);
const configuredSiteUrl = String(process.env.SITE_URL || config.siteUrl || '').trim();
const siteUrl = (configuredSiteUrl || (customDomain ? `https://${customDomain}` : '') || githubPagesUrl() || 'http://localhost:4180').replace(/\/+$/, '');
const deployment = new URL(siteUrl + '/');
const deploymentBasePath = deployment.pathname.replace(/\/+$/, '') === '/' ? '' : deployment.pathname.replace(/\/+$/, '');

function siteRouteUrl(route) {
  const url = new URL(deployment.origin);
  const routePath = route === '/' ? '/' : '/' + String(route || '').replace(/^\/+/, '');
  url.pathname = `${deploymentBasePath}${routePath}`.replace(/\/{2,}/g, '/');
  return url.toString();
}

function assetUrl(value) {
  const input = String(value || '').trim();
  if (/^https?:/i.test(input)) return input;
  return siteRouteUrl('/' + input.replace(/^\/+/, ''));
}

const products = Array.isArray(productsData) ? productsData : productsData.products || [];
const insights = Array.isArray(content.insights) ? content.insights : content.insights?.items || [];
const baseRoutes = ['/', '/about', '/capabilities', '/products', '/industries', '/quality', '/insights', '/contact'];

function localizedPath(baseRoute, locale) {
  return locale === 'zh' ? (baseRoute === '/' ? '/zh' : `/zh${baseRoute}`) : baseRoute;
}

const routes = [];
for (const baseRoute of baseRoutes) {
  routes.push({ path: localizedPath(baseRoute, 'en'), baseRoute, locale: 'en', type: 'page' });
  routes.push({ path: localizedPath(baseRoute, 'zh'), baseRoute, locale: 'zh', type: 'page' });
}
for (const product of products.filter((item) => item.published !== false && item.slug)) {
  const baseRoute = `/products/${encodeURIComponent(product.slug)}`;
  routes.push({ path: baseRoute, baseRoute, locale: 'en', type: 'product', item: product });
  routes.push({ path: `/zh${baseRoute}`, baseRoute, locale: 'zh', type: 'product', item: product });
}
for (const insight of insights.filter((item) => item && item.slug)) {
  const baseRoute = `/insights/${encodeURIComponent(insight.slug)}`;
  routes.push({ path: baseRoute, baseRoute, locale: 'en', type: 'insight', item: insight });
  routes.push({ path: `/zh${baseRoute}`, baseRoute, locale: 'zh', type: 'insight', item: insight });
}

function seoForRoute(route) {
  const locale = route.locale;
  const company = locale === 'zh' ? settings.companyName : settings.companyNameEn;
  const pageKey = route.baseRoute === '/' ? 'home' : route.baseRoute.split('/').filter(Boolean)[0];
  const pageSeo = content.seo?.pages?.[pageKey] || {};
  let title = text(pageSeo.title, locale, text(content.seo?.defaultTitle, locale, company));
  let description = text(pageSeo.description, locale, text(content.seo?.defaultDescription, locale, 'Custom metal manufacturing support.'));
  let image = '/assets/generated/hero-stamping.webp';
  if (route.type === 'product') {
    title = `${text(route.item.name || route.item.title, locale, route.item.slug)} | ${company}`;
    description = text(route.item.description, locale, description);
    image = route.item.image || route.item.images?.[0] || image;
  } else if (route.type === 'insight') {
    title = `${text(route.item.title, locale, route.item.slug)} | ${company}`;
    description = text(route.item.excerpt || route.item.summary, locale, description);
    image = route.item.image || '/assets/generated/tooling-workshop.webp';
  } else if (pageKey === 'quality') image = '/assets/generated/quality-lab.webp';
  else if (pageKey === 'about') image = '/assets/generated/global-review.webp';
  else if (pageKey === 'insights') image = '/assets/generated/tooling-workshop.webp';
  return { title, description, image: assetUrl(image) };
}

function routeDepth(routePath) {
  return routePath.split('/').filter(Boolean).length;
}

function rootRelative(routePath) {
  const depth = routeDepth(routePath);
  return depth ? '../'.repeat(depth) : './';
}

function outputDirectory(routePath) {
  const segments = routePath.split('/').filter(Boolean).map(decodeURIComponent);
  return segments.length ? path.join(distDir, ...segments) : distDir;
}

function analyticsMarkup() {
  const googleAnalyticsId = String(process.env.GOOGLE_ANALYTICS_ID || config.analytics?.googleAnalyticsId || '').trim();
  const clarityId = String(process.env.CLARITY_ID || config.analytics?.clarityId || '').trim();
  const blocks = [];
  if (googleAnalyticsId) {
    const id = escapeHtml(googleAnalyticsId);
    blocks.push(`<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${id}');</script>`);
  }
  if (clarityId) {
    const id = JSON.stringify(clarityId).replace(/</g, '\\u003c');
    blocks.push(`<script>(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,'clarity','script',${id});</script>`);
  }
  return blocks.join('');
}

function pageHtml(route) {
  const locale = route.locale;
  const languageTag = locale === 'zh' ? 'zh-CN' : 'en';
  const root = rootRelative(route.path);
  const seo = seoForRoute(route);
  const canonical = siteRouteUrl(route.path);
  const alternateEn = siteRouteUrl(localizedPath(route.baseRoute, 'en'));
  const alternateZh = siteRouteUrl(localizedPath(route.baseRoute, 'zh'));
  const runtimeConfig = JSON.stringify({ root, siteUrl }).replace(/</g, '\\u003c');
  const loading = locale === 'zh' ? '正在加载展益精密...' : 'Loading Zhanyi Precision...';
  const skip = locale === 'zh' ? '跳到主要内容' : 'Skip to content';
  const noScript = locale === 'zh'
    ? '本网站需要启用 JavaScript 才能显示产品目录和询价工具。'
    : 'This website requires JavaScript to display its product catalogue and inquiry tools.';
  return `<!doctype html>
<html lang="${languageTag}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#111417">
  <meta name="description" content="${escapeHtml(seo.description)}">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <link rel="alternate" hreflang="en" href="${escapeHtml(alternateEn)}">
  <link rel="alternate" hreflang="zh-CN" href="${escapeHtml(alternateZh)}">
  <link rel="alternate" hreflang="x-default" href="${escapeHtml(alternateEn)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${escapeHtml(text(content.seo?.siteName, locale, settings.companyNameEn))}">
  <meta property="og:title" content="${escapeHtml(seo.title)}">
  <meta property="og:description" content="${escapeHtml(seo.description)}">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <meta property="og:image" content="${escapeHtml(seo.image)}">
  <meta property="og:locale" content="${locale === 'zh' ? 'zh_CN' : 'en_US'}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(seo.title)}">
  <meta name="twitter:description" content="${escapeHtml(seo.description)}">
  <meta name="twitter:image" content="${escapeHtml(seo.image)}">
  <title>${escapeHtml(seo.title)}</title>
  <link rel="icon" type="image/svg+xml" href="${root}assets/brand/favicon.svg">
  <link rel="stylesheet" href="${root}vendor/leaflet/leaflet.css?v=1.9.4">
  <link rel="stylesheet" href="${root}styles.css?v=20260819.1-static">
  <script>window.__ZHANYI_STATIC__=${runtimeConfig};</script>
  ${analyticsMarkup()}
</head>
<body>
  <a class="skip-link" href="#main-content">${skip}</a>
  <div id="app" aria-live="polite">
    <div class="app-loading" role="status">
      <span class="app-loading-mark" aria-hidden="true">ZY</span>
      <span>${loading}</span>
    </div>
  </div>
  <noscript>${noScript}</noscript>
  <script>window.formspree=window.formspree||function(){(window.formspree.q=window.formspree.q||[]).push(arguments)};</script>
  <script src="https://unpkg.com/@formspree/ajax@1.1.5/dist/global.js" defer></script>
  <script src="${root}vendor/leaflet/leaflet.js?v=1.9.4" defer></script>
  <script src="${root}app.js?v=20260819.1-static" defer></script>
</body>
</html>`;
}

function sitemapXml() {
  const entries = routes.map((route) => {
    const en = siteRouteUrl(localizedPath(route.baseRoute, 'en'));
    const zh = siteRouteUrl(localizedPath(route.baseRoute, 'zh'));
    const alternates = `<xhtml:link rel="alternate" hreflang="en" href="${escapeHtml(en)}"/><xhtml:link rel="alternate" hreflang="zh-CN" href="${escapeHtml(zh)}"/><xhtml:link rel="alternate" hreflang="x-default" href="${escapeHtml(en)}"/>`;
    return `<url><loc>${escapeHtml(siteRouteUrl(route.path))}</loc>${alternates}<changefreq>${route.baseRoute === '/' ? 'weekly' : 'monthly'}</changefreq><priority>${route.baseRoute === '/' ? '1.0' : '0.7'}</priority></url>`;
  }).join('');
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries}</urlset>`;
}

function redirectHtml(target) {
  const safeTarget = escapeHtml(target);
  return `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=${safeTarget}"><link rel="canonical" href="${safeTarget}"><title>Redirecting...</title></head><body><p><a href="${safeTarget}">Continue</a></p><script>location.replace(${JSON.stringify(target).replace(/</g, '\\u003c')});</script></body></html>`;
}

function notFoundHtml() {
  const home = siteRouteUrl('/');
  const productsUrl = siteRouteUrl('/products');
  return `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>404 | ZHANYI PRECISION</title><style>body{margin:0;display:grid;min-height:100vh;place-items:center;background:#111417;color:#fff;font-family:Arial,sans-serif}.box{width:min(620px,calc(100% - 40px))}.mark{color:#e34a2b;font-weight:800;letter-spacing:.12em}.code{margin:.25em 0;font-size:clamp(5rem,18vw,11rem);line-height:.9}.box p{color:#aeb6bb;line-height:1.7}.links{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}.links a{padding:14px 20px;color:#111417;background:#fff;text-decoration:none;font-weight:700}.links a:first-child{color:#fff;background:#e34a2b}</style></head><body><main class="box"><div class="mark">ZHANYI PRECISION</div><h1 class="code">404</h1><p>The requested page could not be found.<br>未找到您访问的页面。</p><div class="links"><a href="${escapeHtml(home)}">Back to home / 返回首页</a><a href="${escapeHtml(productsUrl)}">Products / 产品中心</a></div></main></body></html>`;
}

await fs.rm(distDir, { recursive: true, force: true });
await fs.mkdir(distDir, { recursive: true });
for (const directory of ['assets', 'vendor', 'data']) {
  await fs.cp(path.join(srcDir, directory), path.join(distDir, directory), { recursive: true });
}
for (const file of ['app.js', 'styles.css']) {
  await fs.copyFile(path.join(srcDir, file), path.join(distDir, file));
}
for (const route of routes) {
  const directory = outputDirectory(route.path);
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(path.join(directory, 'index.html'), pageHtml(route), 'utf8');
}

const legacyRoutes = {
  'chanpinzhongxin.html': '/products',
  'lianxiwomen.html': '/contact',
  'gongsijianjie.html': '/about',
  'shebeizhanshi.html': '/capabilities',
  'xinwenzixun.html': '/insights',
};
for (const [legacy, target] of Object.entries(legacyRoutes)) {
  await fs.writeFile(path.join(distDir, legacy), redirectHtml(siteRouteUrl(target)), 'utf8');
  await fs.mkdir(path.join(distDir, 'zh'), { recursive: true });
  await fs.writeFile(path.join(distDir, 'zh', legacy), redirectHtml(siteRouteUrl(`/zh${target}`)), 'utf8');
}

await fs.writeFile(path.join(distDir, '404.html'), notFoundHtml(), 'utf8');
await fs.writeFile(path.join(distDir, 'sitemap.xml'), sitemapXml(), 'utf8');
await fs.writeFile(path.join(distDir, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteRouteUrl('/sitemap.xml')}\n`, 'utf8');
await fs.writeFile(path.join(distDir, '.nojekyll'), '', 'utf8');
if (customDomain) await fs.writeFile(path.join(distDir, 'CNAME'), customDomain + '\n', 'utf8');

console.log(`Built ${routes.length} localized routes in ${distDir}`);
console.log(`Deployment URL: ${siteUrl}`);
console.log(`Products: ${products.length}; insights: ${insights.length}; custom domain: ${customDomain || 'not configured'}`);
