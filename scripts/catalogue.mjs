/**
 * Lecture du catalogue (src/data/products.ts) côté scripts de build, et liste
 * des routes du site. Partagé par prerender.mjs, gen-seo.mjs,
 * gen-products-json.mjs et verifier-catalogue.mjs : UNE source de vérité.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('..', import.meta.url));
export const SITE = 'https://tsenaimprimante.fonenako.mg';
export const SOURCE_PRODUITS = join(ROOT, 'src', 'data', 'products.ts');

/** Routes sans paramètre, dans l'ordre du plan du site. */
export const ROUTES_STATIQUES = ['/', '/conseils', '/faq', '/aide', '/blog', '/privacy', '/terms', '/mentions-legales'];

/** Identifiants des articles du blog (src/pages/ArticleDetail.tsx, clés "1"…"6"). */
export const ARTICLES_BLOG = ['1', '2', '3', '4', '5', '6'];

/**
 * Extrait le tableau littéral `products` de products.ts et l'évalue tel quel
 * (c'est du JS valide : commentaires et virgules finales compris).
 */
export function extraireProduits() {
  const src = readFileSync(SOURCE_PRODUITS, 'utf-8');
  const match = src.match(/export const products\s*:\s*Product\[\]\s*=\s*(\[[\s\S]*?\n\]);/);
  if (!match) {
    throw new Error('Impossible de trouver le tableau `products` dans src/data/products.ts');
  }
  const produits = new Function(`return (${match[1]});`)();
  if (!Array.isArray(produits) || produits.length < 5) {
    throw new Error(`Extraction suspecte : ${produits?.length ?? 0} produits`);
  }
  return produits;
}

export const formatMga = (n) => new Intl.NumberFormat('fr-FR').format(n).replace(/[\s  ]/g, ' ');
