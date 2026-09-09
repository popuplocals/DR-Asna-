'use strict';

/**
 * clean-mirror.js
 *
 * Turns the WordPress export of the canxglobal.com homepage (index.html from
 * the "canxglobal-website-clone" mirror) into the EJS view used by this app.
 *
 * The markup, stylesheets, fonts and images of the real homepage are kept
 * exactly as they are. What gets removed is everything that only makes sense
 * on a live WordPress install or that slows the page down:
 *   - analytics / tag manager / Jetpack stats / GoDaddy tracking scripts
 *   - WP Rocket delay-JS, lazy-load and preload-links scripts
 *     (images get native `loading="lazy"` instead)
 *   - WordPress emoji, oEmbed, RSS, REST discovery, pingback links
 *   - Site-Kit, Astra-sites template preview, speculation rules
 *
 * Usage: node tools/clean-mirror.js <path/to/mirror/index.html> [out.ejs]
 */

const fs = require('fs');
const path = require('path');

const src = process.argv[2];
const out = process.argv[3] || path.join(__dirname, '..', 'views', 'index.ejs');
if (!src) {
  console.error('usage: node tools/clean-mirror.js <mirror/index.html> [views/index.ejs]');
  process.exit(1);
}

let html = fs.readFileSync(src, 'utf8');
const before = html.length;

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

const SCRIPT_RE = /<script\b[^>]*>[\s\S]*?<\/script>/gi;

/** Remove every <script> whose opening tag or body matches `test`. */
function dropScripts(test, label) {
  let n = 0;
  html = html.replace(SCRIPT_RE, (tag) => {
    if (test(tag)) {
      n++;
      return '';
    }
    return tag;
  });
  if (n) console.log(`  - removed ${n} script(s): ${label}`);
}

function dropAll(re, label) {
  const n = (html.match(re) || []).length;
  html = html.replace(re, '');
  if (n) console.log(`  - removed ${n}: ${label}`);
}

/* ------------------------------------------------------------------ */
/* 1. Scripts that only serve tracking or the WP admin                 */
/* ------------------------------------------------------------------ */

const EXTERNAL_SCRIPT_BLOCKLIST = [
  'googletagmanager.com',
  'stats.wp.com',
  'traffic-assets/js/tccl',
  'google-site-kit',
  'astra-sites/inc/lib/onboarding',
  'wp-rocket/assets/js/lazyload',
  'mailchimp-for-wp',
  'wpforms/assets/js/integrations/elementor',
];

dropScripts((t) => {
  const m = t.match(/src=["']([^"']+)["']/i);
  return m && EXTERNAL_SCRIPT_BLOCKLIST.some((b) => m[1].includes(b));
}, 'tracking / admin / lazyload script files');

const INLINE_SCRIPT_BLOCKLIST = [
  'RocketLazyLoadScripts',
  'RocketPreloadLinksConfig',
  'RocketPreloadLinks',
  'rocket_lazyload_css_data',
  'window.lazyLoadOptions',
  'rocket_pairs',
  'gtm4wp_datalayer_name',
  'dataLayer_content',
  'gtm.start',
  'gtag("set","linker"',
  'gtag(\'set\'',
  '_stq',
  '_trfq',
  '_trfd',
  'tccl.baseHost',
  'sdui-panel-open',
  'site-designer-ui-panel-open',
  'starter_templates_zip_preview',
  '_wpemojiSettings',
  'wp-emoji-settings',
  'wpEmojiSettingsSupports',
  'MSIE|Internet Explorer',
  '(trident|msie)',
  'wpformsElementorVars',
  'RocketElementorPreload',
];

dropScripts((t) => {
  if (/\ssrc=/i.test(t)) return false;
  return INLINE_SCRIPT_BLOCKLIST.some((b) => t.includes(b));
}, 'inline tracking / rocket / emoji snippets');

// Speculation rules & JSON config blobs only used by the removed scripts.
dropScripts((t) => /type=["']speculationrules["']/i.test(t), 'speculation rules');
dropScripts((t) => /id=["']wp-emoji-settings["']/i.test(t), 'emoji settings');

/* ------------------------------------------------------------------ */
/* 2. Head links WordPress adds for feeds, REST and embeds             */
/* ------------------------------------------------------------------ */

dropAll(/<link[^>]+rel=["'](alternate|EditURI|shortlink|https:\/\/api\.w\.org\/|profile|pingback)["'][^>]*>\s*/gi, 'feed / REST / oEmbed links');
dropAll(/<link[^>]+rel=["']dns-prefetch["'][^>]*>\s*/gi, 'dns-prefetch links');
dropAll(/<link[^>]+rel=["']preconnect["'][^>]*>\s*/gi, 'preconnect links (fonts are self-hosted)');
dropAll(/<meta name=["']generator["'][^>]*>\s*/gi, 'generator meta');
dropAll(/<noscript>\s*<iframe[^>]*googletagmanager[^>]*><\/iframe>\s*<\/noscript>/gi, 'GTM noscript iframes');
dropAll(/<style id=["']rocket-lazyload-nojs-css["']>[\s\S]*?<\/style>/gi, 'rocket nojs style');
dropAll(/<noscript>\s*<style id=["']rocket-lazyload-nojs-css["']>[\s\S]*?<\/style>\s*<\/noscript>/gi, 'rocket nojs noscript');
dropAll(/<style>html\.sdui-panel-open[\s\S]*?<\/style>/gi, 'GoDaddy site designer style');
dropAll(/<style id=["']wp-emoji-styles-inline-css["']>[\s\S]*?<\/style>/gi, 'emoji style');
dropAll(/<link[^>]+href=["'][^"']*emoji[^"']*["'][^>]*>\s*/gi, 'emoji links');

/* ------------------------------------------------------------------ */
/* 3. Images: WP Rocket lazy-load → native lazy loading                */
/* ------------------------------------------------------------------ */

// <img src="data:image/svg+xml,...placeholder" data-lazy-src="real"> → <img src="real" loading="lazy">
let lazyImgs = 0;
html = html.replace(/<img\b[^>]*>/gi, (tag) => {
  if (!/data-lazy-src(set)?=/i.test(tag)) return tag;
  lazyImgs++;
  let t = tag;
  t = t.replace(/\ssrc=["'][^"']*["']/i, '');
  t = t.replace(/\ssrcset=["'][^"']*["']/i, '');
  t = t.replace(/\ssizes=["'][^"']*["']/i, '');
  t = t.replace(/\sdata-lazy-src=/i, ' src=');
  t = t.replace(/\sdata-lazy-srcset=/i, ' srcset=');
  t = t.replace(/\sdata-lazy-sizes=/i, ' sizes=');
  t = t.replace(/\sdata-ll-status=["'][^"']*["']/i, '');
  t = t.replace(/\sclass=["']([^"']*)["']/i, (m, c) => ` class="${c.replace(/\b(lazyloaded|rocket-lazyload)\b/g, '').replace(/\s+/g, ' ').trim()}"`);
  if (!/\sloading=/i.test(t) && !/fetchpriority=["']high["']/i.test(t)) t = t.replace(/<img\b/i, '<img loading="lazy"');
  return t;
});
console.log(`  - converted ${lazyImgs} lazy images to native loading`);

// Drop the <noscript><img …></noscript> fallbacks that duplicated every lazy image.
dropAll(/<noscript>\s*<img\b[^>]*>\s*<\/noscript>/gi, 'noscript image fallbacks');
dropAll(/<noscript>\s*<iframe\b[^>]*>\s*<\/iframe>\s*<\/noscript>/gi, 'noscript iframe fallbacks');

// iframes / videos lazy-loaded by rocket
html = html.replace(/<(iframe|video|source)\b[^>]*\sdata-lazy-src=/gi, (m) => m.replace(/\sdata-lazy-src=/i, ' src='));

// Background images WP Rocket applied lazily: activate the noscript styles directly.
html = html.replace(/<noscript>\s*(<style id=["']wpr-lazyload-bg-nostyle["']>[\s\S]*?<\/style>)\s*<\/noscript>/gi, '$1');
dropAll(/<style id=["']wpr-lazyload-bg-(container|exclusion)["']>[\s\S]*?<\/style>\s*/gi, 'rocket bg lazy helper styles');
dropAll(/<style id=["']rocket-lazyrender-inline-css["']>[\s\S]*?<\/style>\s*/gi, 'rocket lazyrender style');
html = html.replace(/\sdata-wpr-lazyrender=["']1["']/gi, '');
html = html.replace(/\sdata-rocket-preload/gi, '');
html = html.replace(/\sdata-rocket-location-hash=["'][^"']*["']/gi, '');
html = html.replace(/\sdata-minify=["']1["']/gi, '');
html = html.replace(/\sdata-no-optimize=["']1["']/gi, '');
html = html.replace(/\sdata-wpr-hosted-gf-parameters=["'][^"']*["']/gi, '');
html = html.replace(/\sdata-wpr-lazybg-ready=["'][^"']*["']/gi, '');
html = html.replace(/\swpr-lazyload-bg(-container)?\b/g, '');
// Rocket "delay JS" markers: run scripts normally.
html = html.replace(/<script\b([^>]*)\stype=["']rocketlazyloadscript["']/gi, '<script$1');
html = html.replace(/\sdata-rocket-type=["']([^"']+)["']/gi, ' type="$1"');
html = html.replace(/\sdata-rocket-src=/gi, ' src=');

/* ------------------------------------------------------------------ */
/* 4. Make every asset path root-relative so nested routes work        */
/* ------------------------------------------------------------------ */

html = html.replace(/(href|src|srcset|content|poster)=(["'])(?:\.\/)?((?:wp-content|external)\/)/gi, '$1=$2/$3');
html = html.replace(/(srcset=["'][^"']*?)(?:,\s*)(?:\.\/)?((?:wp-content|external)\/)/gi, '$1, /$2');
html = html.replace(/url\((['"]?)(?:\.\/)?((?:wp-content|external)\/)/gi, 'url($1/$2');
html = html.replace(/@import url\((['"]?)\/?external\/fonts\.googleapis\.com[^)]*\);?/gi, '');

/* ------------------------------------------------------------------ */
/* 5. Links: keep them on the WordPress site                           */
/* ------------------------------------------------------------------ */

// The mirror already has absolute https://canxglobal.com links; make the
// homepage link itself point at this app.
html = html.replace(/href=["']https:\/\/canxglobal\.com\/?["']/gi, 'href="/"');
html = html.replace(/<link rel=["']canonical["'][^>]*>/i, '<link rel="canonical" href="<%= wpBaseUrl %>/">');
// Same-origin WordPress endpoints are proxied by server.js; keep them relative.
html = html.replace(/"ajax":\{"url":"\/wp-admin\/admin-ajax\.php"\}/, '"ajax":{"url":"/wp-admin/admin-ajax.php"}');
// Elementor loads its widget handlers (webpack chunks) relative to urls.assets
// and talks to admin-ajax / the REST API. Point all of those at this app so
// server.js can serve them (cached) from the same origin.
html = html.replace(/"assets":"https:\\\/\\\/canxglobal\.com\\\/(wp-content\\\/plugins\\\/[^"]+)"/g, '"assets":"\\/$1"');
html = html.replace(/"ajaxurl":"https:\\\/\\\/canxglobal\.com\\\/wp-admin\\\/admin-ajax\.php"/g, '"ajaxurl":"\\/wp-admin\\/admin-ajax.php"');
html = html.replace(/"rest":"https:\\\/\\\/canxglobal\.com\\\/wp-json\\\/"/g, '"rest":"\\/wp-json\\/"');

/* ------------------------------------------------------------------ */
/* 6. Tidy whitespace left behind                                      */
/* ------------------------------------------------------------------ */

html = html.replace(/\n{3,}/g, '\n\n');
html = html.replace(/<!-- (?:Google Tag|Google Analytics|GTM|Site Kit|Jetpack|Meta Pixel|Facebook Pixel)[^>]*-->\s*/gi, '');

/* ------------------------------------------------------------------ */
/* Write                                                               */
/* ------------------------------------------------------------------ */

const header = '<%# Generated from the canxglobal.com WordPress homepage by tools/clean-mirror.js. Edit the source mirror or the script, not this file. %>\n';
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, header + html);
console.log(`\nwrote ${out}: ${before} → ${html.length} bytes`);
