/**
 * Génération SEO / GEO post-build : dist/sitemap.xml, dist/llms.txt, et le
 * JSON-LD « catalogue » (ItemList de Product) de l'accueil, tous dérivés de
 * src/data/products.ts — plus de liste écrite à la main qui dérive.
 *
 * Audit 06/09/2026 : robots.txt pointait vers un sitemap.php inexistant ; le
 * JSON-LD statique de index.html listait des prix différents du catalogue.
 *
 * Usage : `npm run build` (postbuild, APRÈS prerender) ou node scripts/gen-seo.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { extraireProduits, ROUTES_STATIQUES, ARTICLES_BLOG, SITE, ROOT, formatMga } from './catalogue.mjs';

const DIST = join(ROOT, 'dist');
const produits = extraireProduits();
const aujourdhui = new Date().toISOString().slice(0, 10);

// ── sitemap.xml ────────────────────────────────────────────────────────────
const urls = [
  ...ROUTES_STATIQUES.map((r) => ({ loc: r, priorite: r === '/' ? '1.0' : '0.6', freq: r === '/' ? 'weekly' : 'monthly' })),
  ...produits.map((p) => ({ loc: `/imprimantes/${p.id}`, priorite: '0.8', freq: 'weekly' })),
  ...ARTICLES_BLOG.map((id) => ({ loc: `/blog/${id}`, priorite: '0.4', freq: 'yearly' })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${SITE}${u.loc === '/' ? '/' : u.loc}</loc>
    <lastmod>${aujourdhui}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priorite}</priority>
  </url>`).join('\n')}
</urlset>
`;
writeFileSync(join(DIST, 'sitemap.xml'), sitemap, 'utf-8');

// ── llms.txt (moteurs de réponse IA) ───────────────────────────────────────
const TYPE = { inkjet: "jet d'encre", laser: 'laser monochrome', tank: "réservoir d'encre (EcoTank / Smart Tank / série G)" };
const lignesProduits = produits.map((p) => {
  const prix = p.priceMax && p.priceMax !== p.priceMin
    ? `${formatMga(p.priceMin)} Ar sans kit, ${formatMga(p.priceMax)} Ar avec kit externe`
    : `${formatMga(p.priceMin)} Ar${p.kitIncluded ? ' (kit externe inclus)' : ''}`;
  const traits = [p.hasWifi ? 'Wi-Fi' : 'USB', p.isMultifunction ? 'impression, copie, scan' : 'impression seule', p.hasDuplex ? 'recto-verso automatique' : null, p.hasADF ? 'chargeur de documents' : null, p.formats.includes('A3') ? 'format A3' : null].filter(Boolean).join(', ');
  return `- [${p.name}](${SITE}/imprimantes/${p.id}) — ${TYPE[p.type] || p.type}, ${traits}. Prix : ${prix}. ${p.inStock ? 'Disponible.' : 'Sur commande.'}`;
});
const llms = `# Tsena Imprimante

> Vente d'imprimantes neuves Canon, HP et Epson à Madagascar (Antananarivo), avec livraison en province, installation gratuite à Tana et service après-vente. Prix affichés en ariary (Ar / MGA), toutes taxes comprises.

Site : ${SITE}
Téléphone : +261 33 71 063 34 (aussi +261 32 47 041 43) — WhatsApp et appels
Messenger : https://m.me/TsenaImprimante
Adresse : Avaradoha, Antananarivo 101, Madagascar (livraison à domicile ; retrait sur rendez-vous)
Langues : français, malgache

## Conditions
- Imprimantes neuves sous carton, garantie constructeur et SAV.
- Livraison + installation GRATUITES à Antananarivo (branchement, Wi-Fi, pilotes, premier test).
- Livraison en province par taxi-brousse ou avion : frais selon ville et poids, indiqués sur le devis.
- Paiement : espèces à la livraison, virement, Mobile Money (MVola, Orange Money). Aucun paiement en ligne.
- Devis proforma PDF gratuit : ${SITE}/#devis
- « Kit externe » = système d'encre continu monté sur l'imprimante : encre à la bouteille, coût par page très bas.

## Catalogue (${produits.length} modèles, prix du ${aujourdhui})
${lignesProduits.join('\n')}

Catalogue lisible par machine : ${SITE}/products.json

## Pages utiles
- [Conseils pour choisir](${SITE}/conseils) — jet d'encre, laser ou réservoir selon l'usage
- [Questions fréquentes](${SITE}/faq) — commande, paiement, livraison, garantie
- [Aide et dépannage](${SITE}/aide) — kit externe, consommables, problèmes courants
- [Conditions générales](${SITE}/terms) · [Confidentialité](${SITE}/privacy) · [Mentions légales](${SITE}/mentions-legales)
`;
writeFileSync(join(DIST, 'llms.txt'), llms, 'utf-8');

// ── JSON-LD catalogue de l'accueil ─────────────────────────────────────────
const itemList = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: "Catalogue d'imprimantes Tsena Imprimante Madagascar",
  numberOfItems: produits.length,
  itemListElement: produits.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: `${SITE}/imprimantes/${p.id}`,
    item: {
      '@type': 'Product',
      name: p.name,
      url: `${SITE}/imprimantes/${p.id}`,
      image: `${SITE}${p.imageUrl}`,
      brand: { '@type': 'Brand', name: p.brand },
      offers: p.priceMax && p.priceMax !== p.priceMin
        ? { '@type': 'AggregateOffer', lowPrice: p.priceMin, highPrice: p.priceMax, priceCurrency: 'MGA', offerCount: 2, availability: p.inStock ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder' }
        : { '@type': 'Offer', price: p.priceMin, priceCurrency: 'MGA', availability: p.inStock ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder', url: `${SITE}/imprimantes/${p.id}` },
    },
  })),
};
const bloc = `<!-- catalogue-jsonld -->\n    <script type="application/ld+json">${JSON.stringify(itemList)}</script>\n    <!-- /catalogue-jsonld -->`;
const indexPath = join(DIST, 'index.html');
if (existsSync(indexPath)) {
  const html = readFileSync(indexPath, 'utf-8');
  if (!/<!-- catalogue-jsonld -->/.test(html)) {
    console.error('[gen-seo] marqueur <!-- catalogue-jsonld --> absent de dist/index.html. Abandon.');
    process.exit(1);
  }
  writeFileSync(indexPath, html.replace(/<!-- catalogue-jsonld -->[\s\S]*?<!-- \/catalogue-jsonld -->/, bloc), 'utf-8');
}

console.log(`[gen-seo] OK — sitemap.xml (${urls.length} URL), llms.txt, JSON-LD catalogue (${produits.length} produits).`);
