import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { ROUTES, SITE } from './src/data/seo-routes.js';
import { CATALOG } from './src/data/catalog.js';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

const NAV =
  '<ul><li><a href="/shop">Shop the range</a></li><li><a href="/science">The science of fiber</a></li>' +
  '<li><a href="/story">Our story</a></li><li><a href="/journal">Journal</a></li></ul>';

function fallback(route, title, desc) {
  const products =
    route === '/shop'
      ? `<ul>${Object.entries(CATALOG)
          .map(
            ([sku, p]) =>
              `<li><a href="/shop/${sku}">fibbi ${esc(p.title)}</a> — ₹${p.price} (MRP ₹${p.mrp})</li>`,
          )
          .join('')}</ul>`
      : '';
  return `<noscript><h1>${esc(title)}</h1><p>${esc(desc)}</p>${products}${NAV}</noscript>`;
}

// The host rewrites every unknown path to index.html, so non-JS crawlers saw homepage
// meta (and a canonical pointing at "/") on every URL. Emit a real file per route instead.
function prerenderRoutes() {
  return {
    name: 'prerender-routes',
    apply: 'build',
    closeBundle() {
      const out = path.resolve('dist');
      const shell = fs.readFileSync(path.join(out, 'index.html'), 'utf8');

      for (const [route, { title, desc, ld }] of Object.entries(ROUTES)) {
        if (route === '/') continue;
        const url = SITE + route;
        const t = esc(title);
        const d = esc(desc);

        let html = shell
          .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${t}</title>`)
          .replace(
            /<meta name="description" content="[^"]*"/,
            () => `<meta name="description" content="${d}"`,
          )
          .replace(/<link rel="canonical" href="[^"]*"/, () => `<link rel="canonical" href="${url}"`)
          .replace(
            /<meta property="og:url" content="[^"]*"/,
            () => `<meta property="og:url" content="${url}"`,
          )
          .replace(
            /<meta property="og:title" content="[^"]*"/,
            () => `<meta property="og:title" content="${t}"`,
          )
          .replace(
            /<meta property="og:description" content="[^"]*"/,
            () => `<meta property="og:description" content="${d}"`,
          )
          .replace(/<!--crawler-->[\s\S]*?<!--\/crawler-->/, () => fallback(route, title, desc));

        if (ld) {
          const tag = `<script type="application/ld+json">${JSON.stringify(ld)}</script>`;
          html = html.replace('</head>', () => `${tag}</head>`);
        }

        const dir = path.join(out, route.slice(1));
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), html);
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), prerenderRoutes()],
});
