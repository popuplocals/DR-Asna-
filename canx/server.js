'use strict';

/**
 * Can X Global — homepage server
 *
 * Serves the canxglobal.com homepage (exact markup, styles, fonts and images
 * from the WordPress site) as a fast Node.js app. Inner pages stay on
 * WordPress: links point there and unknown paths are forwarded.
 *
 * The homepage's own JavaScript (chat widget, Elementor widgets) calls the
 * WordPress AJAX and REST endpoints on the same origin, so those two paths
 * are proxied to WP_BASE_URL.
 */

const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');
const express = require('express');
const compression = require('compression');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';
const WP_BASE_URL = (process.env.WP_BASE_URL || 'https://canxglobal.com').replace(/\/+$/, '');

app.disable('x-powered-by');
app.set('trust proxy', true);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('view cache', IS_PROD);

app.use(compression({ threshold: 1024 }));

// Lightweight security headers (no extra dependency).
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Static assets: file names carry version hashes (…__ver_123.css, …__fit_625.webp),
// so they can be cached for a year.
app.use(
  express.static(path.join(__dirname, 'public'), {
    maxAge: IS_PROD ? '365d' : 0,
    immutable: IS_PROD,
    etag: true,
    index: false,
    dotfiles: 'ignore',
  })
);

/* ------------------------------------------------------------------ */
/* Homepage                                                            */
/* ------------------------------------------------------------------ */

app.get('/', (req, res) => {
  res.setHeader('Cache-Control', IS_PROD ? 'public, max-age=300, stale-while-revalidate=600' : 'no-cache');
  res.render('index', { wpBaseUrl: WP_BASE_URL });
});

app.get(['/home', '/index.html', '/index.php'], (req, res) => res.redirect(301, '/'));

app.get('/healthz', (req, res) => res.json({ ok: true, uptime: process.uptime() }));

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send('User-agent: *\nAllow: /\nDisallow: /wp-admin/\nSitemap: ' + WP_BASE_URL + '/sitemap_index.xml\n');
});

/* ------------------------------------------------------------------ */
/* Proxy the WordPress endpoints the homepage scripts call             */
/* ------------------------------------------------------------------ */

function proxyToWordPress(req, res) {
  const target = new URL(req.originalUrl, WP_BASE_URL);
  const client = target.protocol === 'http:' ? http : https;

  const headers = { ...req.headers, host: target.host };
  delete headers['accept-encoding']; // let Node handle plain bodies
  delete headers.cookie; // never forward visitor cookies to WordPress

  const upstream = client.request(
    target,
    { method: req.method, headers, timeout: 15000 },
    (up) => {
      const passthrough = {};
      for (const [k, v] of Object.entries(up.headers)) {
        if (!['set-cookie', 'transfer-encoding', 'connection', 'content-encoding'].includes(k)) passthrough[k] = v;
      }
      res.writeHead(up.statusCode || 502, passthrough);
      up.pipe(res);
    }
  );
  upstream.on('timeout', () => upstream.destroy(new Error('upstream timeout')));
  upstream.on('error', (err) => {
    console.error('[proxy]', req.method, req.originalUrl, err.message);
    if (!res.headersSent) res.status(502).json({ ok: false, error: 'WordPress is unreachable' });
  });
  req.pipe(upstream);
}

app.all('/wp-admin/admin-ajax.php', proxyToWordPress);
app.all(/^\/wp-json(\/.*)?$/, proxyToWordPress);
app.all(/^\/\?jkit-ajax-request=.*/, proxyToWordPress);

/* ------------------------------------------------------------------ */
/* Plugin assets loaded on demand (Elementor webpack chunks, fonts…)   */
/* ------------------------------------------------------------------ */

// Anything under /wp-content or /wp-includes that is not part of the export is
// fetched once from WordPress, stored in ASSET_CACHE_DIR and served from disk
// from then on, so the page stays same-origin and fast.
const fs = require('fs');
const os = require('os');
let ASSET_CACHE_DIR = process.env.ASSET_CACHE_DIR || path.join(__dirname, '.asset-cache');
try {
  fs.mkdirSync(ASSET_CACHE_DIR, { recursive: true });
} catch (err) {
  // Read-only filesystem (serverless hosts such as Vercel): fall back to the temp dir.
  ASSET_CACHE_DIR = path.join(os.tmpdir(), 'canx-asset-cache');
  fs.mkdirSync(ASSET_CACHE_DIR, { recursive: true });
}

app.use(express.static(ASSET_CACHE_DIR, { maxAge: IS_PROD ? '365d' : 0, immutable: IS_PROD, index: false }));

const inflight = new Map();
function fetchAndCacheAsset(req, res, next) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  const pathname = decodeURIComponent(req.path);
  if (pathname.includes('..')) return res.status(400).end();
  const dest = path.join(ASSET_CACHE_DIR, pathname);
  const target = new URL(req.originalUrl, WP_BASE_URL);
  const client = target.protocol === 'http:' ? http : https;

  const key = target.href;
  const job =
    inflight.get(key) ||
    new Promise((resolve, reject) => {
      const upstream = client.get(target, { headers: { 'user-agent': 'canx-node-homepage', accept: '*/*' }, timeout: 15000 }, (up) => {
        if (up.statusCode !== 200) {
          up.resume();
          return resolve({ status: up.statusCode });
        }
        const chunks = [];
        up.on('data', (c) => chunks.push(c));
        up.on('end', () => {
          const body = Buffer.concat(chunks);
          fs.mkdir(path.dirname(dest), { recursive: true }, (err) => {
            if (err) return resolve({ status: 200, body, type: up.headers['content-type'] });
            fs.writeFile(dest, body, () => resolve({ status: 200, body, type: up.headers['content-type'] }));
          });
        });
        up.on('error', reject);
      });
      upstream.on('timeout', () => upstream.destroy(new Error('upstream timeout')));
      upstream.on('error', reject);
    }).finally(() => inflight.delete(key));
  inflight.set(key, job);

  job
    .then((r) => {
      if (r.status !== 200) return next();
      if (r.type) res.type(r.type);
      res.setHeader('Cache-Control', IS_PROD ? 'public, max-age=31536000, immutable' : 'no-cache');
      res.send(req.method === 'HEAD' ? undefined : r.body);
    })
    .catch((err) => {
      console.error('[asset]', req.originalUrl, err.message);
      next();
    });
}
app.get([/^\/wp-content\/.+/, /^\/wp-includes\/.+/], fetchAndCacheAsset);

/* ------------------------------------------------------------------ */
/* Everything else lives on WordPress                                  */
/* ------------------------------------------------------------------ */

app.use((req, res) => {
  res.redirect(302, WP_BASE_URL + req.originalUrl);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Can X Global homepage running at http://localhost:${PORT} (${IS_PROD ? 'production' : 'development'})`);
    console.log(`WordPress base: ${WP_BASE_URL}`);
  });
}

module.exports = app;
