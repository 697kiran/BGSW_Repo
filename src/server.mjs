import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';

import { trails } from './trails.mjs';

const escapeHtml = (text) => String(text)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');
const trailList = trails.map(({ name, kilometers, difficulty }) =>
  `<li><strong>${escapeHtml(name)}</strong><span>${escapeHtml(kilometers)} km · ${escapeHtml(difficulty)}</span></li>`,
).join('\n');
const page = readFileSync(new URL('../public/index.html', import.meta.url), 'utf8')
  .replace('<!-- trails -->', () => trailList);
const styles = readFileSync(new URL('../public/styles.css', import.meta.url));
const routes = new Map([
  ['/', ['text/html; charset=utf-8', page]],
  ['/styles.css', ['text/css; charset=utf-8', styles]],
  ['/api/trails', ['application/json; charset=utf-8', JSON.stringify(trails)]],
  ['/healthz', ['application/json; charset=utf-8', '{"status":"ok"}']],
]);

export function handleRequest(request, response) {
  const headers = {
    'Content-Security-Policy': "default-src 'none'; style-src 'self'; frame-ancestors 'none'",
    'X-Content-Type-Options': 'nosniff',
  };
  const { method, url } = request;
  if (method !== 'GET' && method !== 'HEAD') {
    response.writeHead(405, { ...headers, Allow: 'GET, HEAD' }).end();
    return;
  }
  const route = routes.get(url.split('?', 1)[0]);
  if (!route) {
    response.writeHead(404, { ...headers, 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(method === 'HEAD' ? undefined : 'Not found\n');
    return;
  }
  const [type, content] = route;
  response.writeHead(200, { ...headers, 'Content-Type': type });
  response.end(method === 'HEAD' ? undefined : content);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const host = process.env.HOST || '127.0.0.1';
  const port = Number(process.env.PORT ?? 3000);
  const server = createServer(handleRequest);
  server.listen(port, host, () => {
    console.log(`Trail Notes Lab is listening on ${host}:${server.address().port}`);
  });
}
