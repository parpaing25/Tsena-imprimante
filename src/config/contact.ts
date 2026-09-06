/**
 * Coordonnées de Tsena Imprimante — UNE seule source pour tout le site.
 *
 * Avant l'audit du 06/09/2026, trois numéros différents vivaient dans le code :
 * 033 71 063 34 (appels, 40 occurrences), 032 72 090 33 (WhatsApp des commandes
 * et devis — un numéro absent de la page Facebook et de la bible du bot) et un
 * identifiant de profil Facebook personnel (61557419549913) pour le formulaire de
 * contact. Ici, on ne touche qu'à un endroit.
 *
 * Sources : page Facebook 735810209962613 (téléphone déclaré 032 47 041 43),
 * bible du bot vendeur (bot-imprimante/bible/bible-imprimante.json : WhatsApp
 * wa.me/261337106334).
 *
 * ⚠ À CONFIRMER par Andry : le numéro WhatsApp. Hypothèse retenue : le même
 * numéro que celui affiché pour les appels (033 71 063 34), comme dans la bible.
 */
export const CONTACT = {
  nom: "Tsena Imprimante",
  slogan: "Votre partenaire imprimante à Madagascar",
  telephonePrincipal: { affichage: "033 71 063 34", e164: "+261337106334" },
  telephoneSecondaire: { affichage: "032 47 041 43", e164: "+261324704143" },
  /** Numéro WhatsApp au format international sans « + » (exigé par l'API WhatsApp). */
  whatsapp: "261337106334",
  email: "tsenaimprimante@gmail.com",
  messenger: "https://m.me/TsenaImprimante",
  facebook: "https://www.facebook.com/TsenaImprimante",
  adresse: "Avaradoha, Antananarivo 101, Madagascar",
  ville: "Antananarivo",
  site: "https://tsenaimprimante.fonenako.mg",
  horaires: [
    { jours: "Lundi – Vendredi", heures: "8h00 – 18h00" },
    { jours: "Samedi", heures: "8h00 – 13h00" },
    { jours: "Dimanche", heures: "Fermé (messages lus)" },
  ],
} as const;

export const lienTel = () => `tel:${CONTACT.telephonePrincipal.e164}`;

/**
 * Lien WhatsApp avec message pré-rempli.
 * On passe par api.whatsapp.com directement : la redirection wa.me réencodait
 * les emojis en « � » (constaté au banc du 06/09/2026). Les messages restent
 * sans emoji pour la même raison.
 */
export const lienWhatsApp = (texte: string) =>
  `https://api.whatsapp.com/send?phone=${CONTACT.whatsapp}&text=${encodeURIComponent(texte)}`;

export const lienMail = (sujet: string, corps: string) =>
  `mailto:${CONTACT.email}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;

export const appeler = () => {
  window.location.href = lienTel();
};

export const ouvrirMessenger = () => {
  window.open(CONTACT.messenger, "_blank", "noopener");
};

export const ouvrirFacebook = () => {
  window.open(CONTACT.facebook, "_blank", "noopener");
};
