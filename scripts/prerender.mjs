/**
 * Pré-rendu de la page d'accueil (post-build).
 *
 * Problème visé : SPA à démarrage froid — le HTML initial ne contient qu'un
 * <div id="root"> vide, donc FCP/Speed Index attendent tout le JS React.
 *
 * Méthode : on sert dist/ en local, on ouvre la page dans Chrome headless
 * (puppeteer-core + Chrome installé sur la machine), on capture le HTML rendu
 * de `/` et on l'injecte dans dist/index.html à la place du <div id="root">
 * vide. Les balises <script type="module"> restent intactes : React remonte
 * ensuite par-dessus (createRoot().render remplace le même contenu, pas de
 * mismatch d'hydratation possible).
 *
 * Usage : lancé automatiquement par `npm run build` (hook postbuild),
 * ou à la main : node scripts/prerender.mjs
 */
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const DIST = fileURLToPath(new URL('../dist', import.meta.url));
const PORT = 4939; // port dédié au prerender, pour ne pas gêner `vite preview`
const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
].filter(Boolean);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function startStaticServer() {
  const server = createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split('?')[0]);
    if (urlPath.endsWith('/')) urlPath += 'index.html';
    const filePath = normalize(join(DIST, urlPath));
    if (!filePath.startsWith(normalize(DIST)) || !existsSync(filePath)) {
      // fallback SPA : renvoyer index.html
      const index = readFileSync(join(DIST, 'index.html'));
      res.writeHead(200, { 'Content-Type': MIME['.html'] });
      res.end(index);
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
    res.end(readFileSync(filePath));
  });
  return new Promise((resolve) => server.listen(PORT, '127.0.0.1', () => resolve(server)));
}

async function main() {
  const indexPath = join(DIST, 'index.html');
  const originalHtml = readFileSync(indexPath, 'utf-8');
  if (!/<div id="root"><\/div>/.test(originalHtml)) {
    console.error('[prerender] dist/index.html ne contient pas <div id="root"></div> vide — déjà pré-rendu ? Abandon.');
    process.exit(1);
  }

  const chromePath = CHROME_CANDIDATES.find((p) => existsSync(p));
  if (!chromePath) {
    console.error('[prerender] Chrome introuvable (définir CHROME_PATH). Abandon.');
    process.exit(1);
  }

  const server = await startStaticServer();
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-first-run', '--disable-extensions', '--hide-scrollbars'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });

    await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle0', timeout: 60000 });
    await page.waitForFunction(
      () => (document.getElementById('root')?.children.length ?? 0) > 0,
      { timeout: 30000 }
    );
    // Laisser les chunks lazy (devis, contact, footer) se poser dans le DOM
    await new Promise((r) => setTimeout(r, 1500));

    const rootHtml = await page.evaluate(() => document.getElementById('root').innerHTML);

    if (errors.length) {
      console.error('[prerender] Erreurs JS pendant le rendu :\n' + errors.join('\n'));
      process.exit(1);
    }
    if (rootHtml.length < 5000 || !rootHtml.includes('Tsena Imprimante')) {
      console.error(`[prerender] HTML capturé suspect (${rootHtml.length} caractères). Abandon.`);
      process.exit(1);
    }

    const prerendered = originalHtml.replace(
      '<div id="root"></div>',
      `<div id="root">${rootHtml}</div>`
    );
    writeFileSync(indexPath, prerendered, 'utf-8');
    console.log(`[prerender] OK — accueil pré-rendu injecté dans dist/index.html (${(rootHtml.length / 1024).toFixed(0)} Ko de HTML).`);
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((e) => {
  console.error('[prerender] Échec :', e);
  process.exit(1);
});
