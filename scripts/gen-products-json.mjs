/**
 * Génération du catalogue public dist/products.json (post-build).
 *
 * But : exposer les VRAIS prix du site aux outils externes (bot vendeur
 * imprimante notamment) — le bot fait `curl https://tsenaimprimante.fonenako.mg/products.json`
 * et répond aux clients avec ces données, jamais des prix de mémoire.
 *
 * Source de vérité : src/data/products.ts (le même fichier que le site).
 * On extrait le tableau littéral `products` et on l'évalue tel quel (c'est du
 * JS valide), donc aucune duplication de données à maintenir.
 *
 * Sortie volontairement légère : id, nom, marque, modèle, type, prix, dispo…
 * (pas de descriptions longues ni d'URLs d'images).
 *
 * Usage : lancé automatiquement par `npm run build` (hook postbuild, APRÈS
 * scripts/prerender.mjs), ou à la main : node scripts/gen-products-json.mjs
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SOURCE = join(ROOT, 'src', 'data', 'products.ts');
const DIST = join(ROOT, 'dist');
const OUT = join(DIST, 'products.json');

const TYPE_LABELS = { inkjet: 'jet d’encre', laser: 'laser', tank: 'réservoir (EcoTank/SmartTank)' };
const CATEGORY_LABELS = { multifunction: 'multifonction', printer: 'imprimante simple' };

const formatMga = (n) => new Intl.NumberFormat('fr-FR').format(n).replace(/[\s  ]/g, '.');

function extractProducts() {
  const src = readFileSync(SOURCE, 'utf-8');
  // Le tableau se termine par `];` en début de ligne (les crochets imbriqués
  // features/formats sont sur une seule ligne, donc pas d'ambiguïté).
  const match = src.match(/export const products\s*:\s*Product\[\]\s*=\s*(\[[\s\S]*?\n\]);/);
  if (!match) {
    console.error('[products.json] Impossible de trouver le tableau `products` dans src/data/products.ts. Abandon.');
    process.exit(1);
  }
  // Littéral JS valide (commentaires et virgules finales inclus) → évaluation directe.
  return new Function(`return (${match[1]});`)();
}

function main() {
  const products = extractProducts();
  if (!Array.isArray(products) || products.length < 5) {
    console.error(`[products.json] Extraction suspecte (${products?.length ?? 0} produits). Abandon.`);
    process.exit(1);
  }

  const produits = products.map((p) => {
    const bad = ['id', 'name', 'brand', 'type', 'priceMin'].filter((k) => p[k] === undefined || p[k] === '');
    if (bad.length) {
      console.error(`[products.json] Produit incomplet (${p.id ?? p.name ?? '?'}) — champs manquants : ${bad.join(', ')}. Abandon.`);
      process.exit(1);
    }
    const devise = p.currency || 'MGA';
    const prix = p.priceMax && p.priceMax !== p.priceMin
      ? `${formatMga(p.priceMin)} à ${formatMga(p.priceMax)} ${devise}`
      : `${formatMga(p.priceMin)} ${devise}`;
    const item = {
      id: p.id,
      nom: p.name,
      marque: p.brand,
      modele: p.model,
      type: TYPE_LABELS[p.type] || p.type,
      categorie: CATEGORY_LABELS[p.category] || p.category,
      prix_min: p.priceMin,
      devise,
      prix,
      dispo: p.inStock === true,
    };
    if (p.priceMax !== undefined) item.prix_max = p.priceMax;
    if (p.kitIncluded !== undefined) item.kit_inclus = p.kitIncluded;
    return item;
  });

  const payload = {
    source: 'https://tsenaimprimante.fonenako.mg',
    genere_le: new Date().toISOString(),
    devise_par_defaut: 'MGA',
    nombre_produits: produits.length,
    produits,
  };

  if (!existsSync(DIST)) mkdirSync(DIST, { recursive: true });
  writeFileSync(OUT, JSON.stringify(payload, null, 2) + '\n', 'utf-8');
  console.log(`[products.json] OK — ${produits.length} produits exportés dans dist/products.json.`);
}

main();
