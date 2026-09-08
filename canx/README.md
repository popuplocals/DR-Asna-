# Can X Global — Node.js Homepage

A fast, dependency-light rebuild of the [canxglobal.com](https://canxglobal.com/) homepage in
Node.js (Express + EJS). The rest of the site stays on WordPress: every inner-page link on this
homepage points to the WordPress site, and any unknown path is forwarded there.

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

Run the smoke tests:

```bash
npm test
```

## Configuration

Copy `.env.example` and set the variables in your environment (or a process manager):

| Variable        | Default                    | Purpose                                                  |
| --------------- | -------------------------- | -------------------------------------------------------- |
| `PORT`          | `3000`                     | Port to listen on                                        |
| `WP_BASE_URL`   | `https://canxglobal.com`   | Base URL of the WordPress site for inner-page links      |
| `NODE_ENV`      | (unset)                    | `production` enables template caching and 1-year asset caching |
| `ASSET_VERSION` | current timestamp          | Cache-busting token appended to CSS/JS/image URLs        |

## Project layout

```
canx/
├── server.js            Express app: routes, compression, caching, form endpoint
├── data/site.js         ALL homepage content (nav, hero, services, testimonials, footer…)
├── lib/icons.js         Inline SVG icon set
├── views/
│   ├── index.ejs        Homepage sections in order
│   └── partials/        head, header (top bar + sticky nav + mega menu), footer
├── public/
│   ├── css/style.css    Single hand-written stylesheet, fully responsive
│   ├── js/main.js       Mobile nav, sticky header, reveal-on-scroll, AJAX form
│   └── img/             Logo, favicon and illustrations (all SVG)
└── test/smoke.test.js   Boots the server and checks the key routes
```

## Homepage sections (top to bottom)

1. Top bar — phone, email, office hours, social links
2. Sticky header — logo, primary nav (Employers ▾, Job Seekers, Immigration mega menu, Why Can X, Our Story, Team, Blog, Contact Us), **Get Started** button
3. Hero — "We Help Companies Thrive and People Succeed — Real People, Real Solutions."
4. Stats strip — 10+ years, 30+ countries, 10,000+ clients, since 2016
5. Two ways we can help — Employers / Job Seekers / Immigration
6. Recruitment — Hire Local, Hire Global, Hire Remote, Hire TFW (LMIA)
7. Immigration — Work Permit, PR, Study, Visit, Family Sponsorship, Citizenship
8. Why Choose Can X — licensed RCICs, human-first, people + technology, integrity
9. Our Story — since 2016, founder Anuj Sengar (RCIC R515178)
10. How it works — 4 steps
11. Testimonials
12. Latest blog posts
13. Get Started — contact details + lead form (`POST /api/get-started`)
14. Footer — about, Employers / Immigration / Company link columns, contact, legal

Edit `data/site.js` to change any copy or link; templates need no changes.

## Why it's fast

- No CSS/JS frameworks; one ~14 KB stylesheet and one ~4 KB script, both deferred/preloaded
- Inline SVG icons and SVG illustrations — no icon fonts, no raster downloads
- System font stack — no web-font requests
- Gzip compression on every response, ETags and immutable 1-year caching for assets
- Server-rendered HTML with EJS template caching in production
- Lazy-loaded below-the-fold images, `fetchpriority="high"` on hero assets

## Wiring the lead form

`POST /api/get-started` currently validates the submission and logs it to stdout.
Replace the `console.log` in `server.js` with your email provider or CRM call.

## Deploying

Any Node host works (Render, Railway, Fly.io, a VPS with PM2, Docker). Serve the Node app at
the root of the domain and keep WordPress on its existing paths, or run Node on a sub-domain and
point the WordPress homepage to it. Set `NODE_ENV=production` and `WP_BASE_URL`.
