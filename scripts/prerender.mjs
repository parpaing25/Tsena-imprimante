/**
 * Pré-rendu de TOUTES les routes (post-build).
 *
 * Avant l'audit du 06/09/2026, seul `/` était pré-rendu ; les autres pages
 * n'existaient que par la réécriture Apache « tout vers index.html », qui
 * répondait 200 pour n'importe quelle URL (soft 404) et cassait les routes à
 * deux segments (chemins d'assets relatifs).
 *
 * Méthode : on sert dist/ en local, on ouvre chaque route dans Chrome headless
 * (puppeteer-core + Chrome de la machine), on capture le HTML rendu de #root ET
 * les balises <head> gérées par react-helmet-async (attribut data-rh), puis on
 * écrit dist/<route>/index.html. React remonte ensuite par-dessus (createRoot
 * remplace le contenu, pas d'hydratation, donc pas de mismatch possible).
 *
 * Sorties :
 *   dist/index.html, dist/faq/index.html, dist/imprimantes/<id>/index.html, …
 *   dist/404.html (servi par ErrorDocument 404 dans .htaccess)
 *
 * Usage : `npm run build` (hook postbuild) ou `node scripts/prerender.mjs`.
 */
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { extname, join, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { extraireProduits, ARTICLES_BLOG, ROUTES_STATIQUES } from './catalogue.mjs';

const DIST = fileURLToPath(new URL('../dist', import.meta.url));
const PORT = 4939;
const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
].filter(Boolean);

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.txt': 'text/plain', '.xml': 'application/xml',
};

function startStaticServer(indexHtml) {
  const server = createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    // Les balises de mesure (sendBeacon) et les API n'ont pas de serveur ici : 204.
    if (urlPath.startsWith('/api/')) { res.writeHead(204); res.end(); return; }
    const filePath = normalize(join(DIST, urlPath === '/' ? 'index.html' : urlPath));
    // Fichier réel (bundle, image, JSON) : servi tel quel. Un dossier (route déjà
    // pré-rendue) ou un .html : toujours le gabarit vide, pour que React rende la page.
    if (filePath.startsWith(normalize(DIST)) && existsSync(filePath) && statSync(filePath).isFile() && !filePath.endsWith('.html')) {
      res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
      res.end(readFileSync(filePath));
      return;
    }
    // Toute route -> le gabarit vide : c'est React qui rend la page.
    res.writeHead(200, { 'Content-Type': MIME['.html'] });
    res.end(indexHtml);
  });
  return new Promise((resolve) => server.listen(PORT, '127.0.0.1', () => resolve(server)));
}

const echapper = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** Construit le HTML final d'une route à partir du gabarit et de ce que la page a rendu. */
function assembler(gabarit, { rootHtml, titre, description, canonical, robots, ogImage, ogType, autresHead }, estAccueil) {
  let html = gabarit;
  // 1. Balises statiques remplacées par celles de la page. Elles portent data-rh :
  //    react-helmet-async les reconnaît au montage et les REMPLACE au lieu d'en
  //    ajouter une seconde (sinon : deux canonical, deux descriptions à l'exécution).
  const rh = ' data-rh="true"';
  html = html.replace(/<title>[^<]*<\/title>/, `<title${rh}>${echapper(titre)}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${echapper(description)}"${rh} />`);
  // Une page d'erreur n'a pas d'adresse canonique (elle est servie sous n'importe quelle URL)
  html = html.replace(/<link rel="canonical" href="[^"]*" \/>\n?/, canonical ? `<link rel="canonical" href="${echapper(canonical)}"${rh} />\n` : '');
  html = html.replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${echapper(titre)}"${rh} />`);
  html = html.replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${echapper(description)}"${rh} />`);
  html = html.replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${echapper(canonical)}"${rh} />`);
  html = html.replace(/<meta property="og:type" content="[^"]*" \/>/, `<meta property="og:type" content="${echapper(ogType || 'website')}"${rh} />`);
  if (ogImage) html = html.replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${echapper(ogImage)}"${rh} />`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${echapper(titre)}"${rh} />`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${echapper(description)}"${rh} />`);
  // 2. Le JSON-LD « catalogue » (ItemList) n'a de sens que sur l'accueil
  if (!estAccueil) {
    html = html.replace(/<!-- catalogue-jsonld -->[\s\S]*?<!-- \/catalogue-jsonld -->/, '');
  }
  // 3. Robots + autres balises Helmet (JSON-LD de la page, etc.)
  const supplement = [robots ? `<meta name="robots" content="${echapper(robots)}" data-rh="true" />` : '', ...autresHead].filter(Boolean).join('\n    ');
  if (supplement) html = html.replace('</head>', `    ${supplement}\n  </head>`);
  // 4. Contenu rendu
  html = html.replace('<div id="root"></div>', `<div id="root">${rootHtml}</div>`);
  return html;
}

async function main() {
  const gabarit = readFileSync(join(DIST, 'index.html'), 'utf-8');
  if (!/<div id="root"><\/div>/.test(gabarit)) {
    console.error('[prerender] dist/index.html ne contient pas <div id="root"></div> vide — déjà pré-rendu ? Abandon.');
    process.exit(1);
  }
  const chromePath = CHROME_CANDIDATES.find((p) => existsSync(p));
  if (!chromePath) {
    console.error('[prerender] Chrome introuvable (définir CHROME_PATH). Abandon.');
    process.exit(1);
  }

  const produits = extraireProduits();
  const routes = [
    ...ROUTES_STATIQUES,
    ...ARTICLES_BLOG.map((id) => `/blog/${id}`),
    ...produits.map((p) => `/imprimantes/${p.id}`),
  ];

  const server = await startStaticServer(gabarit);
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-first-run', '--disable-extensions', '--hide-scrollbars', '--no-sandbox'],
  });

  let ecrits = 0;
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    const erreurs = [];
    page.on('pageerror', (e) => erreurs.push(String(e)));
    page.on('console', (msg) => { if (msg.type() === 'error') erreurs.push(msg.text()); });

    const rendre = async (route, fichierSortie) => {
      erreurs.length = 0;
      await page.goto(`http://127.0.0.1:${PORT}${route}`, { waitUntil: 'networkidle0', timeout: 60000 });
      try {
        await page.waitForFunction(() => (document.getElementById('root')?.children.length ?? 0) > 0, { timeout: 30000 });
      } catch (e) {
        const etat = await page.evaluate(() => ({ titre: document.title, root: (document.getElementById('root')?.innerHTML || '').slice(0, 300), url: location.href }));
        console.error(`[prerender] ${route} : React n'a rien monté en 30 s.`, JSON.stringify(etat), '\nErreurs :', erreurs.join('\n') || '(aucune)');
        throw e;
      }
      await new Promise((r) => setTimeout(r, 1200)); // chunks paresseux + rendu progressif du catalogue

      const capture = await page.evaluate(() => {
        const q = (sel) => document.querySelector(sel);
        const attr = (sel, a) => q(sel)?.getAttribute(a) || '';
        const helmet = [...document.head.querySelectorAll('[data-rh]')];
        const gere = (el) => el.tagName === 'TITLE'
          || (el.tagName === 'META' && ['description', 'robots'].includes(el.getAttribute('name')))
          || (el.tagName === 'LINK' && el.getAttribute('rel') === 'canonical')
          || (el.tagName === 'META' && ['og:title', 'og:description', 'og:url', 'og:type', 'og:image'].includes(el.getAttribute('property') || ''));
        const autres = helmet.filter((el) => !gere(el)).map((el) => el.outerHTML);
        return {
          rootHtml: document.getElementById('root').innerHTML,
          titre: document.title,
          description: attr('meta[name="description"][data-rh]', 'content') || attr('meta[name="description"]', 'content'),
          canonical: attr('link[rel="canonical"][data-rh]', 'href') || (location.origin + location.pathname),
          robots: attr('meta[name="robots"][data-rh]', 'content'),
          ogImage: attr('meta[property="og:image"][data-rh]', 'content'),
          ogType: attr('meta[property="og:type"][data-rh]', 'content'),
          autresHead: autres,
        };
      });

      if (erreurs.length) {
        console.error(`[prerender] ${route} : erreurs JS pendant le rendu :\n` + erreurs.join('\n'));
        process.exit(1);
      }
      if (capture.rootHtml.length < 2000 || !capture.rootHtml.includes('Tsena Imprimante')) {
        console.error(`[prerender] ${route} : HTML capturé suspect (${capture.rootHtml.length} caractères). Abandon.`);
        process.exit(1);
      }
      // Le canonical capturé sur le serveur local porte 127.0.0.1 : on le remet sur le vrai domaine
      capture.canonical = route.startsWith('/__') ? '' : capture.canonical.replace(/^http:\/\/127\.0\.0\.1:\d+/, 'https://tsenaimprimante.fonenako.mg');
      if (!capture.canonical) capture.robots = capture.robots || 'noindex, follow';
      const html = assembler(gabarit, capture, route === '/');
      mkdirSync(dirname(fichierSortie), { recursive: true });
      writeFileSync(fichierSortie, html, 'utf-8');
      ecrits++;
      console.log(`[prerender] ${route.padEnd(32)} → ${fichierSortie.slice(DIST.length)} (${(html.length / 1024).toFixed(0)} Ko)`);
    };

    for (const route of routes) {
      const sortie = route === '/' ? join(DIST, 'index.html') : join(DIST, route.replace(/^\//, ''), 'index.html');
      await rendre(route, sortie);
    }
    // Page 404 : une route qui n'existe pas, rendue par NotFound
    await rendre('/__introuvable__', join(DIST, '404.html'));
  } finally {
    await browser.close();
    server.close();
  }
  console.log(`[prerender] OK — ${ecrits} pages écrites.`);
}

main().catch((e) => {
  console.error('[prerender] Échec :', e);
  process.exit(1);
});
