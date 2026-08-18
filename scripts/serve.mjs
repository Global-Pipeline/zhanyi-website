import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..', 'dist');
const port = Number(process.env.PORT || 4180);
const host = String(process.env.HOST || '127.0.0.1');
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
};

function safePath(pathname) {
  let decoded;
  try { decoded = decodeURIComponent(pathname); } catch { return null; }
  const candidate = path.resolve(root, '.' + decoded);
  return candidate === root || candidate.startsWith(root + path.sep) ? candidate : null;
}

function resolveFile(pathname) {
  const candidate = safePath(pathname);
  if (!candidate) return null;
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
    const index = path.join(candidate, 'index.html');
    if (fs.existsSync(index)) return index;
  }
  if (!path.extname(candidate)) {
    const index = path.join(candidate, 'index.html');
    if (fs.existsSync(index)) return index;
  }
  return null;
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url || '/', `http://${req.headers.host || `${host}:${port}`}`);
  const candidate = safePath(requestUrl.pathname);
  if (candidate && !requestUrl.pathname.endsWith('/') && !path.extname(requestUrl.pathname)) {
    const index = path.join(candidate, 'index.html');
    if (fs.existsSync(index)) {
      res.writeHead(308, { Location: requestUrl.pathname + '/' + requestUrl.search });
      return res.end();
    }
  }
  const file = resolveFile(requestUrl.pathname);
  const target = file || path.join(root, '404.html');
  const status = file ? 200 : 404;
  const stat = fs.statSync(target);
  res.writeHead(status, {
    'Content-Type': mime[path.extname(target).toLowerCase()] || 'application/octet-stream',
    'Content-Length': stat.size,
    'Cache-Control': 'no-cache',
  });
  if (req.method === 'HEAD') return res.end();
  fs.createReadStream(target).pipe(res);
});

server.listen(port, host, () => {
  console.log(`Zhanyi static preview: http://${host}:${port}/`);
});
