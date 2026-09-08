'use strict';

/**
 * Can X Global — homepage server
 *
 * A small, fast Express app that renders the homepage with EJS.
 * All inner pages remain on the existing WordPress site; links on the
 * homepage point to WP_BASE_URL (default https://canxglobal.com).
 */

const path = require('path');
const express = require('express');
const compression = require('compression');

const site = require('./data/site');
const { icon } = require('./lib/icons');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';
const WP_BASE_URL = (process.env.WP_BASE_URL || 'https://canxglobal.com').replace(/\/+$/, '');

// Cache-busting token for static assets: bump on every deploy.
const ASSET_VERSION = process.env.ASSET_VERSION || String(Date.now()).slice(0, 10);

app.disable('x-powered-by');
app.set('trust proxy', true);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('view cache', IS_PROD);

// Gzip / brotli-compatible compression for HTML, CSS, JS and SVG.
app.use(compression({ threshold: 1024 }));

// Parse form submissions (Get Started form).
app.use(express.urlencoded({ extended: false, limit: '32kb' }));
app.use(express.json({ limit: '32kb' }));

// Static assets with long-lived caching (cache-busted via ?v=ASSET_VERSION).
app.use(
  express.static(path.join(__dirname, 'public'), {
    maxAge: IS_PROD ? '365d' : 0,
    immutable: IS_PROD,
    etag: true,
    index: false,
  })
);

// Lightweight security headers (no extra dependency).
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

/** Build a link to a page on the WordPress site. */
function wp(pathname) {
  if (!pathname) return WP_BASE_URL + '/';
  if (/^https?:\/\//i.test(pathname) || pathname.startsWith('#') || pathname.startsWith('mailto:') || pathname.startsWith('tel:')) {
    return pathname;
  }
  return WP_BASE_URL + '/' + pathname.replace(/^\/+/, '');
}

const baseLocals = {
  site,
  wp,
  icon,
  assetVersion: ASSET_VERSION,
  wpBaseUrl: WP_BASE_URL,
  year: new Date().getFullYear(),
};

app.get('/', (req, res) => {
  res.setHeader('Cache-Control', IS_PROD ? 'public, max-age=300, stale-while-revalidate=600' : 'no-cache');
  res.render('index', { ...baseLocals, page: { title: site.meta.title, description: site.meta.description } });
});

// Convenience alias used by the WordPress site.
app.get(['/home', '/index.html'], (req, res) => res.redirect(301, '/'));

// Get Started form handler. Replace the console.log with an email / CRM hook.
app.post('/api/get-started', (req, res) => {
  const { name = '', email = '', phone = '', interest = '', message = '', website = '' } = req.body || {};

  // Honeypot: real users never fill this hidden field.
  if (website) return res.status(200).json({ ok: true });

  if (!name.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'Please provide your name and a valid email address.' });
  }

  const lead = {
    name: name.trim().slice(0, 120),
    email: email.trim().slice(0, 200),
    phone: phone.trim().slice(0, 40),
    interest: interest.trim().slice(0, 80),
    message: message.trim().slice(0, 2000),
    receivedAt: new Date().toISOString(),
    ip: req.ip,
  };
  console.log('[get-started] new lead', JSON.stringify(lead));

  return res.json({ ok: true, message: 'Thank you! Our team will reach out within one business day.' });
});

// Health check for load balancers / uptime monitors.
app.get('/healthz', (req, res) => res.json({ ok: true, uptime: process.uptime() }));

// robots.txt and a homepage-only sitemap.
app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send('User-agent: *\nAllow: /\nSitemap: ' + WP_BASE_URL + '/sitemap.xml\n');
});

// Anything else lives on WordPress: forward there so old links keep working.
app.use((req, res) => {
  res.redirect(302, WP_BASE_URL + req.originalUrl);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Can X Global homepage running at http://localhost:${PORT} (${IS_PROD ? 'production' : 'development'})`);
    console.log(`Inner-page links point to ${WP_BASE_URL}`);
  });
}

module.exports = app;
