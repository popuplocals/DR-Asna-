'use strict';

/* Minimal smoke test: boots the app on a random port and checks key routes. */

const assert = require('assert');
const http = require('http');
const fs = require('fs');
const path = require('path');
const app = require('../server');

function request(server, method, reqPath) {
  return new Promise((resolve, reject) => {
    const { port } = server.address();
    const req = http.request({ host: '127.0.0.1', port, method, path: reqPath }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    req.end();
  });
}

(async () => {
  const server = app.listen(0);
  try {
    const home = await request(server, 'GET', '/');
    assert.strictEqual(home.status, 200, 'homepage should return 200');
    assert.ok(home.body.includes('Top Rated Recruitment &amp; Immigration Experts in Canada') || home.body.includes('Top Rated Recruitment & Immigration Experts in Canada'), 'hero headline present');
    assert.ok(/Connecting\s*<[^>]*>\s*Talent/.test(home.body) && home.body.includes('Simplifying'), 'hero headline present');
    assert.ok(home.body.includes('"assets":"\\/wp-content\\/plugins\\/elementor\\/assets\\/"'), 'elementor chunks load from this origin');
    assert.ok(/Trusted by Clients from(<[^>]*>|\s)*30\+ Countries/.test(home.body), 'testimonials heading present');
    assert.ok(!home.body.includes('googletagmanager'), 'tag manager stripped');
    assert.ok(!home.body.includes('data-lazy-src'), 'rocket lazyload stripped');

    // Every local asset the homepage references must exist on disk.
    const refs = new Set();
    for (const m of home.body.matchAll(/(?:href|src|poster)=["'](\/(?:wp-content|external)\/[^"'?#]+)/g)) refs.add(m[1]);
    for (const m of home.body.matchAll(/srcset=["']([^"']+)["']/g)) {
      for (const part of m[1].split(',')) {
        const u = part.trim().split(/\s+/)[0];
        if (u.startsWith('/wp-content/') || u.startsWith('/external/')) refs.add(u.split('?')[0]);
      }
    }
    for (const m of home.body.matchAll(/url\((['"]?)(\/(?:wp-content|external)\/[^)'"?#]+)/g)) refs.add(m[2]);
    const missing = [...refs].filter((r) => !fs.existsSync(path.join(__dirname, '..', 'public', decodeURIComponent(r))));
    assert.deepStrictEqual(missing, [], 'missing assets: ' + missing.slice(0, 10).join(', '));
    console.log(`homepage references ${refs.size} local assets, all present`);

    const css = await request(server, 'GET', '/wp-content/themes/astra/assets/css/minified/main.min__ver_4_13_2.css');
    assert.strictEqual(css.status, 200, 'theme stylesheet served');

    const health = await request(server, 'GET', '/healthz');
    assert.strictEqual(health.status, 200);

    const fallback = await request(server, 'GET', '/work-permit/');
    assert.strictEqual(fallback.status, 302, 'unknown paths forward to WordPress');
    assert.ok(fallback.headers.location.endsWith('/work-permit/'));

    console.log('All smoke tests passed.');
  } finally {
    server.close();
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
