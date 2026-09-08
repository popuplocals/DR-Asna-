'use strict';

/* Minimal smoke test: boots the app on a random port and checks key routes. */

const assert = require('assert');
const http = require('http');
const app = require('../server');

function request(server, method, path, body) {
  return new Promise((resolve, reject) => {
    const { port } = server.address();
    const req = http.request(
      { host: '127.0.0.1', port, method, path, headers: body ? { 'Content-Type': 'application/json' } : {} },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
      }
    );
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

(async () => {
  const server = app.listen(0);
  try {
    const home = await request(server, 'GET', '/');
    assert.strictEqual(home.status, 200, 'homepage should return 200');
    assert.ok(home.body.includes('We Help Companies Thrive'), 'hero headline present');
    assert.ok(home.body.includes('help@canxglobal.com'), 'contact email present');
    assert.ok(home.body.includes('Hire TFW'), 'recruitment services present');
    assert.ok(home.body.includes('Express Entry'), 'immigration mega menu present');
    assert.ok(home.body.includes('application/ld+json'), 'structured data present');

    const css = await request(server, 'GET', '/css/style.css');
    assert.strictEqual(css.status, 200, 'stylesheet served');

    const health = await request(server, 'GET', '/healthz');
    assert.strictEqual(health.status, 200);

    const bad = await request(server, 'POST', '/api/get-started', { name: '', email: 'nope' });
    assert.strictEqual(bad.status, 400, 'invalid lead rejected');

    const good = await request(server, 'POST', '/api/get-started', { name: 'Test', email: 'test@example.com' });
    assert.strictEqual(good.status, 200, 'valid lead accepted');

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
