/**
 * Envoi d'une demande (contact, commande, devis) au serveur.
 *
 * Avant l'audit du 06/09/2026, aucun formulaire n'envoyait quoi que ce soit :
 * le contact ouvrait un mailto: puis un profil Facebook derrière un mur de
 * connexion, la commande ouvrait WhatsApp, et le site affichait « Message
 * envoyé ! » dans tous les cas. Une demande dont le client fermait l'onglet
 * était perdue sans trace.
 *
 * Désormais : POST /api/lead.php (PHP sur o2switch) → enregistrement
 * serveur + e-mail + notification Telegram. WhatsApp reste proposé ENSUITE,
 * comme second canal explicite, jamais comme unique preuve d'envoi.
 */
export type TypeLead = "contact" | "commande" | "devis";

export interface LigneProduit {
  id: string;
  nom: string;
  quantite: number;
  prix: number;
  option?: string;
}

export interface Lead {
  type: TypeLead;
  nom: string;
  telephone?: string;
  email?: string;
  entreprise?: string;
  region?: string;
  sujet?: string;
  message?: string;
  produits?: LigneProduit[];
  livraison?: string;
  total?: number;
}

export interface ResultatLead {
  ok: boolean;
  id?: string;
  erreur?: string;
}

const DELAI_MS = 12000;

export async function envoyerLead(lead: Lead, pieges = ""): Promise<ResultatLead> {
  const controleur = new AbortController();
  const minuteur = window.setTimeout(() => controleur.abort(), DELAI_MS);
  try {
    const reponse = await fetch("/api/lead.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lead, page: window.location.pathname, site_web: pieges }),
      signal: controleur.signal,
    });
    const donnees = (await reponse.json().catch(() => ({}))) as Partial<ResultatLead>;
    if (!reponse.ok || !donnees.ok) {
      return { ok: false, erreur: donnees.erreur || `HTTP ${reponse.status}` };
    }
    return { ok: true, id: donnees.id };
  } catch (e) {
    return { ok: false, erreur: e instanceof Error ? e.message : "réseau" };
  } finally {
    window.clearTimeout(minuteur);
  }
}

/** Numéro malgache : 032/033/034/037/038 + 7 chiffres, espaces tolérés. */
export const telephoneValide = (telephone: string) =>
  /^(03[2-4]|03[7-8])\d{7}$/.test(telephone.replace(/[\s.-]/g, ""));
