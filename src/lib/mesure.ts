/**
 * Mesure d'audience et d'erreurs — première partie, sans cookie, sans tiers.
 *
 * Le site n'avait AUCUNE mesure (audit du 06/09/2026 : 27 requêtes, toutes
 * vers le même domaine, zéro analytics, zéro suivi d'erreurs). Ici : une
 * balise POST vers /api/evenement.php qui enregistre la page vue, l'événement
 * de conversion (appel, WhatsApp, commande, devis, contact) ou l'erreur JS.
 *
 * Ce qui n'est PAS envoyé : identifiant, cookie, adresse IP (le serveur la
 * hache avec un sel quotidien et ne garde que le haché), contenu des
 * formulaires. Le signal « Do Not Track » coupe la mesure d'audience ; les
 * erreurs restent remontées (elles ne décrivent pas la personne).
 */
const POINT = "/api/evenement.php";

type Charge = Record<string, unknown>;

const estRobot = () =>
  typeof navigator === "undefined" || navigator.webdriver === true || /bot|crawl|spider|headless/i.test(navigator.userAgent);

const dntActif = () => navigator.doNotTrack === "1" || (window as unknown as { doNotTrack?: string }).doNotTrack === "1";

function expedier(charge: Charge) {
  if (estRobot()) return;
  try {
    const corps = JSON.stringify({ ...charge, h: new Date().toISOString() });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(POINT, new Blob([corps], { type: "application/json" }));
      return;
    }
    fetch(POINT, { method: "POST", body: corps, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(() => undefined);
  } catch {
    /* la mesure ne doit jamais casser la page */
  }
}

let dernierChemin = "";

export function pageVue(chemin: string) {
  if (dntActif() || chemin === dernierChemin) return;
  dernierChemin = chemin;
  let provenance = "";
  try {
    provenance = document.referrer ? new URL(document.referrer).hostname : "";
  } catch {
    provenance = "";
  }
  if (provenance === window.location.hostname) provenance = "";
  expedier({ t: "page", p: chemin, r: provenance, l: navigator.language, w: window.innerWidth });
}

export type NomEvenement =
  | "clic_appel"
  | "clic_whatsapp"
  | "clic_messenger"
  | "commande_envoyee"
  | "devis_pdf"
  | "devis_envoye"
  | "contact_envoye"
  | "formulaire_erreur";

export function evenement(nom: NomEvenement, details?: Charge) {
  if (dntActif()) return;
  expedier({ t: "evt", n: nom, p: window.location.pathname, d: details });
}

let erreursInstallees = false;

export function installerSuiviErreurs() {
  if (erreursInstallees) return;
  erreursInstallees = true;
  window.addEventListener("error", (e) => {
    expedier({ t: "err", m: String(e.message || "").slice(0, 200), s: `${(e.filename || "").slice(-80)}:${e.lineno || 0}`, p: window.location.pathname });
  });
  window.addEventListener("unhandledrejection", (e) => {
    const raison = e.reason instanceof Error ? e.reason.message : String(e.reason);
    expedier({ t: "err", m: raison.slice(0, 200), p: window.location.pathname });
  });
}
