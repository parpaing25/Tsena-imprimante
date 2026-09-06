/**
 * Vérification du catalogue AVANT build : cohérence interne de products.ts et
 * concordance avec la bible du bot vendeur (bot-imprimante/bible/bible-imprimante.json).
 *
 * Audit 06/09/2026 : le site affichait 410 000 – 410 000 Ar pour la MG2545S
 * (bible : 340 000 / 410 000) et 520 000 pour la TR4640 (bible : 500 000). Le
 * client lisait un prix sur le site, un autre dans Messenger. Ce script fait
 * échouer le build tant que les deux sources ne disent pas la même chose.
 *
 * Usage : node scripts/verifier-catalogue.mjs  (aussi dans `npm run verify` et la CI)
 * Variable : TSENA_BIBLE=<chemin> pour désigner la bible ; absente = comparaison sautée (avertissement).
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { extraireProduits, ROOT } from './catalogue.mjs';

const erreurs = [];
const avertissements = [];
const produits = extraireProduits();

// ── Cohérence interne ──────────────────────────────────────────────────────
const ids = new Set();
for (const p of produits) {
  const ou = `products.ts › ${p.id ?? p.name}`;
  if (!p.id || !/^[a-z0-9-]+$/.test(p.id)) erreurs.push(`${ou} : id manquant ou non URL-safe`);
  if (ids.has(p.id)) erreurs.push(`${ou} : id en double`);
  ids.add(p.id);
  for (const champ of ['name', 'brand', 'model', 'type', 'category', 'description', 'imageUrl', 'monthlyVolume']) {
    if (!p[champ]) erreurs.push(`${ou} : champ ${champ} vide`);
  }
  if (!Number.isInteger(p.priceMin) || p.priceMin < 100000 || p.priceMin > 50000000) erreurs.push(`${ou} : priceMin ${p.priceMin} hors bornes (100 000 – 50 000 000 Ar)`);
  if (p.priceMax !== undefined) {
    if (!Number.isInteger(p.priceMax) || p.priceMax < p.priceMin) erreurs.push(`${ou} : priceMax ${p.priceMax} < priceMin ${p.priceMin}`);
    if (p.priceMax === p.priceMin) erreurs.push(`${ou} : priceMax égal à priceMin — retirer priceMax ou corriger le prix sans kit`);
  }
  if (!(p.weight > 0 && p.weight < 60)) erreurs.push(`${ou} : poids ${p.weight} kg incohérent`);
  if (p.currency !== 'MGA') erreurs.push(`${ou} : devise ${p.currency} (attendu MGA)`);
  if (p.imageUrl && !existsSync(join(ROOT, 'public', p.imageUrl))) erreurs.push(`${ou} : image absente de public/ : ${p.imageUrl}`);
  if (p.description && p.description.length < 80) avertissements.push(`${ou} : description courte (${p.description.length} caractères)`);
  const prixDansTexte = [...p.description.matchAll(/(\d{1,3}(?:[,. ]\d{3})+)\s*MGA/g)].map((m) => Number(m[1].replace(/[,. ]/g, '')));
  for (const prix of prixDansTexte) {
    if (prix !== p.priceMin && prix !== p.priceMax) erreurs.push(`${ou} : la description cite ${prix} MGA, absent de priceMin/priceMax`);
  }
}

// ── Concordance avec la bible du bot ───────────────────────────────────────
const candidats = [process.env.TSENA_BIBLE, join(ROOT, '..', 'bot-imprimante', 'bible', 'bible-imprimante.json')].filter(Boolean);
const cheminBible = candidats.find((c) => existsSync(c));
if (!cheminBible) {
  avertissements.push('bible du bot introuvable (TSENA_BIBLE non défini) — concordance des prix non vérifiée');
} else {
  const bible = JSON.parse(readFileSync(cheminBible, 'utf-8'));
  const parCle = new Map((bible.modeles || []).map((m) => [m.cle, m]));
  for (const p of produits) {
    const m = parCle.get(p.id);
    if (!m) { avertissements.push(`bible : modèle ${p.id} absent (le bot ne saura pas en parler)`); continue; }
    const sansKit = m.prix?.sans_kit ?? null;
    const avecKit = m.prix?.avec_kit ?? null;
    const attenduMin = sansKit ?? avecKit;
    const attenduMax = sansKit !== null && avecKit !== null ? avecKit : undefined;
    if (attenduMin !== p.priceMin) erreurs.push(`prix ${p.id} : site ${p.priceMin} ≠ bible ${attenduMin} (sans kit${sansKit === null ? ' = avec kit inclus' : ''})`);
    if ((attenduMax ?? null) !== (p.priceMax ?? null)) erreurs.push(`prix ${p.id} : site priceMax ${p.priceMax ?? '—'} ≠ bible avec_kit ${attenduMax ?? '—'}`);
    if (m.disponible === false && p.inStock) erreurs.push(`${p.id} : bible = indisponible, site = en stock`);
    if (m.a_confirmer) avertissements.push(`${p.id} : prix marqué « à confirmer » dans la bible`);
  }
  for (const [cle] of parCle) {
    if (!ids.has(cle)) avertissements.push(`bible : ${cle} n'est pas sur le site (le bot le propose, le site non)`);
  }
}

for (const a of avertissements) console.warn(`[verifier-catalogue] ⚠ ${a}`);
if (erreurs.length) {
  for (const e of erreurs) console.error(`[verifier-catalogue] ✗ ${e}`);
  console.error(`[verifier-catalogue] ${erreurs.length} erreur(s) — build refusé.`);
  process.exit(1);
}
console.log(`[verifier-catalogue] OK — ${produits.length} produits cohérents${cheminBible ? ' et alignés sur la bible' : ''}.`);
