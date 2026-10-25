import { products, formatPriceCourt, type Product } from "@/data/products";

/**
 * Comparateur d'imprimantes (/comparer) : la sélection vit dans l'adresse, `?comparer=a,b`,
 * pour qu'un lien partagé sur Messenger ou WhatsApp ouvre la même comparaison.
 *
 * Règle du 25/10/2026 (décision d'Andry) : rien que les données de src/data/products.ts. Un champ
 * absent s'affiche « non précisé » ; une ligne qu'aucun modèle comparé ne remplit disparaît. Les
 * libellés suivent la donnée telle qu'elle est : « Wi-Fi : Non » et non « USB », que le catalogue
 * ne dit pas.
 */

export const PARAM_COMPARER = "comparer";
export const MIN_MODELES = 2;
export const MAX_MODELES = 4;
export const NON_PRECISE = "non précisé";

const PAR_ID = new Map(products.map((p) => [p.id, p]));

/** Identifiants valides, sans doublon, dans l'ordre de l'adresse, 4 au plus. */
export function lireSelection(valeur: string | null | undefined): string[] {
  if (!valeur) return [];
  const vus = new Set<string>();
  for (const brut of valeur.split(",")) {
    const id = brut.trim().toLowerCase();
    if (id && PAR_ID.has(id) && !vus.has(id)) vus.add(id);
    if (vus.size === MAX_MODELES) break;
  }
  return [...vus];
}

export const modelesDe = (ids: string[]): Product[] => ids.map((id) => PAR_ID.get(id)).filter((p): p is Product => Boolean(p));

/** Chemin à partager. Les virgules restent lisibles : les identifiants n'ont que [a-z0-9-]. */
export const lienComparaison = (ids: string[]) =>
  ids.length ? `/comparer?${PARAM_COMPARER}=${ids.join(",")}` : "/comparer";

const TYPE: Record<Product["type"], string> = {
  inkjet: "Jet d'encre",
  laser: "Laser",
  tank: "Réservoir d'encre",
};

const ouiNon = (v: boolean) => (v ? "Oui" : "Non");

export interface LigneComparaison {
  titre: string;
  /** Une valeur par modèle, dans l'ordre des colonnes ; null = donnée absente du catalogue. */
  valeurs: (string | null)[];
}

const DEFINITIONS: { titre: string; valeur: (p: Product) => string | null }[] = [
  { titre: "Prix", valeur: (p) => formatPriceCourt(p.priceMin) },
  {
    titre: "Avec kit externe",
    valeur: (p) => {
      if (p.kitIncluded) return "Kit inclus dans le prix";
      if (p.priceMax && p.priceMax !== p.priceMin) return formatPriceCourt(p.priceMax);
      return null;
    },
  },
  { titre: "Type", valeur: (p) => TYPE[p.type] },
  { titre: "Fonctions", valeur: (p) => (p.isMultifunction ? "Impression, copie, scan" : "Impression seule") },
  { titre: "Couleur", valeur: (p) => (p.colorPrint ? "Oui" : "Noir et blanc") },
  { titre: "Wi-Fi", valeur: (p) => ouiNon(p.hasWifi) },
  { titre: "Recto-verso auto", valeur: (p) => ouiNon(p.hasDuplex) },
  { titre: "Chargeur auto (ADF)", valeur: (p) => ouiNon(p.hasADF) },
  { titre: "Formats", valeur: (p) => (p.formats.length ? p.formats.join(", ") : null) },
  { titre: "Volume conseillé", valeur: (p) => p.monthlyVolume?.trim() || null },
  { titre: "Poids", valeur: (p) => (p.weight > 0 ? `${String(p.weight).replace(".", ",")} kg` : null) },
  { titre: "Disponibilité", valeur: (p) => (p.inStock ? "Disponible" : "Sur commande") },
];

/** Lignes du tableau ; celles qu'aucun modèle ne remplit sont retirées. */
export function lignesComparaison(modeles: Product[]): LigneComparaison[] {
  return DEFINITIONS.map((d) => ({ titre: d.titre, valeurs: modeles.map((p) => d.valeur(p)) })).filter((l) =>
    l.valeurs.some((v) => v !== null),
  );
}

/** Une ligne dont toutes les valeurs sont identiques ne départage pas : on la signale, discrètement. */
export const ligneIdentique = (l: LigneComparaison) => l.valeurs.every((v) => v === l.valeurs[0]);

export interface Suggestion {
  libelle: string;
  ids: string[];
}

const moinsChers = (filtre: (p: Product) => boolean, n = 3) =>
  products
    .filter(filtre)
    .sort((a, b) => a.priceMin - b.priceMin)
    .slice(0, n)
    .map((p) => p.id);

/** Comparaisons prêtes, calculées sur le catalogue (jamais écrites à la main). */
export function suggestions(): Suggestion[] {
  const liste: Suggestion[] = [
    { libelle: "Réservoir d'encre : les 3 moins chers", ids: moinsChers((p) => p.type === "tank") },
    { libelle: "Jet d'encre : les 3 moins chers", ids: moinsChers((p) => p.type === "inkjet") },
    { libelle: "Wi-Fi : les 3 moins chers", ids: moinsChers((p) => p.hasWifi) },
    { libelle: "Grand format A3", ids: moinsChers((p) => p.formats.some((f) => /^A3/.test(f)), MAX_MODELES) },
  ];
  return liste.filter((s) => s.ids.length >= MIN_MODELES);
}
