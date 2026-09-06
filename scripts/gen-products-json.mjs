/**
 * Génération du catalogue public dist/products.json (post-build).
 *
 * But : exposer les VRAIS prix du site aux outils externes (bot vendeur
 * imprimante notamment) — le bot fait `curl https://tsenaimprimante.fonenako.mg/products.json`
 * et répond aux clients avec ces données, jamais des prix de mémoire.
 *
 * Source de vérité : src/data/products.ts, lu par scripts/catalogue.mjs.
 * Sortie volontairement légère : id, nom, marque, modèle, type, prix, dispo, URL de la fiche.
 */
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { extraireProduits, ROOT, SITE, formatMga } from './catalogue.mjs';

const DIST = join(ROOT, 'dist');
const OUT = join(DIST, 'products.json');
const TYPE_LABELS = { inkjet: 'jet d’encre', laser: 'laser', tank: 'réservoir (EcoTank/SmartTank)' };
const CATEGORY_LABELS = { multifunction: 'multifonction', printer: 'imprimante simple' };

const products = extraireProduits();
const produits = products.map((p) => {
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
    url: `${SITE}/imprimantes/${p.id}`,
  };
  if (p.priceMax !== undefined) item.prix_max = p.priceMax;
  if (p.kitIncluded !== undefined) item.kit_inclus = p.kitIncluded;
  return item;
});

const payload = {
  source: SITE,
  genere_le: new Date().toISOString(),
  devise_par_defaut: 'MGA',
  nombre_produits: produits.length,
  produits,
};

if (!existsSync(DIST)) mkdirSync(DIST, { recursive: true });
writeFileSync(OUT, JSON.stringify(payload, null, 2) + '\n', 'utf-8');
console.log(`[products.json] OK — ${produits.length} produits exportés dans dist/products.json.`);
