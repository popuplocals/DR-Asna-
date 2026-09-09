# Can X Global — Node.js Homepage

The [canxglobal.com](https://canxglobal.com/) homepage served by a fast Node.js (Express + EJS)
app. The page is the **exact** homepage of the WordPress site — same markup, same Elementor
layout, same stylesheets, fonts and images — with the WordPress-only overhead stripped out.
The rest of the site stays on WordPress: every inner-page link points there, and any path the
Node app does not know is forwarded to WordPress.

## Quick start

```bash
cd canx
npm install
npm start          # http://localhost:3000
```

Development with auto-reload (Node 18+):

```bash
npm run dev
```

Run the smoke tests (boots the app, checks the key routes and that every asset the page
references exists on disk):

```bash
npm test
```

## Configuration

Copy `.env.example` and set the variables in your environment (or a process manager):

| Variable          | Default                    | Purpose                                                                 |
| ----------------- | -------------------------- | ----------------------------------------------------------------------- |
| `PORT`            | `3000`                     | Port to listen on                                                       |
| `WP_BASE_URL`     | `https://canxglobal.com`   | The WordPress site: inner pages, AJAX/REST endpoints, on-demand assets  |
| `NODE_ENV`        | (unset)                    | `production` enables template caching and 1-year asset caching          |
| `ASSET_CACHE_DIR` | `canx/.asset-cache`        | Where assets fetched on demand from WordPress are stored                |

## Project layout

```
canx/
├── server.js               Express app: homepage, static assets, WordPress proxies
├── views/index.ejs         The homepage — generated from the WordPress export (do not hand-edit)
├── tools/clean-mirror.js   Turns the WordPress homepage export into views/index.ejs
├── public/
│   ├── wp-content/         Theme + plugin CSS/JS, uploads (exactly as on WordPress)
│   └── external/           Self-hosted copies of CDN assets (Google Fonts, Jetpack images…)
└── test/smoke.test.js      Boots the server and checks the key routes and assets
```

## How the page is built

`tools/clean-mirror.js` takes the `index.html` of a full WordPress export of the homepage and
writes `views/index.ejs`. It keeps the markup, styles, fonts and images untouched and removes
only what makes sense on a live WordPress install or slows the page down:

- Google Tag Manager / Analytics, Jetpack stats, GoDaddy tracking, Site Kit
- WP Rocket delay-JS, lazy-load and preload scripts (images use native `loading="lazy"`)
- WordPress emoji, oEmbed, RSS, REST discovery, pingback and shortlink tags
- `<noscript>` image duplicates, speculation rules, template-preview code

It also makes every asset path root-relative and points the Elementor runtime at this app
so widget scripts, AJAX and REST calls stay on the same origin.

To regenerate after the WordPress homepage changes, export it again and run:

```bash
node tools/clean-mirror.js path/to/export/index.html
```

## Routing

| Path                                     | Handling                                                        |
| ---------------------------------------- | --------------------------------------------------------------- |
| `/`                                      | The homepage (server-rendered, gzip, short public cache)        |
| `/wp-content/**`, `/external/**`         | Static assets from `public/` (1-year immutable cache in prod)   |
| `/wp-content/**` not in `public/`        | Fetched once from WordPress, cached on disk, then served locally (Elementor widget chunks etc.) |
| `/wp-admin/admin-ajax.php`, `/wp-json/*` | Proxied to WordPress (chat widget, Elementor, forms)            |
| `/healthz`                               | JSON health check                                               |
| anything else                            | 302 to the same path on WordPress                               |

## Why it's fast

- No WordPress/PHP on the request path: static HTML rendered by Node with template caching
- No third-party tracking scripts, no WP Rocket runtime, no emoji/oEmbed scripts
- Fonts, images, CSS and JS are self-hosted and served with ETags and 1-year immutable caching
- Gzip compression on every response
- Native lazy loading for below-the-fold images; hero assets load eagerly

## Deploying

Any Node host works (Render, Railway, Fly.io, a VPS with PM2, Docker). Serve the Node app at
the root of the domain and keep WordPress on its existing paths (or on an internal host set as
`WP_BASE_URL`). Set `NODE_ENV=production`.
