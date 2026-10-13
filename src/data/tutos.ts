// Tutos vidéo du site : nos propres reels (voix malgache Abidi, sous-titres incrustés),
// fabriqués pour la page Facebook en septembre 2026 et republiés ici.
// Généré le 13/10/2026 depuis publications-30j/astuces — ne pas éditer à la main.
export interface Tuto {
  slug: string; titre: string; mg: string; etapes: string[]; duree: number; lien: string;
}

export const TUTOS: Tuto[] = [
  { slug: "une-page-par-semaine", titre: "Imprimez au moins une page par semaine", mg: "Pejy iray isan-kerinandro", etapes: ["Sans usage, l'encre sèche dans la tête d'impression", "Une page par semaine suffit, même une page de test", "Moins de buses bouchées, moins de réparations"], duree: 26, lien: "/aide" },
  { slug: "mode-brouillon", titre: "Le mode rapide économise l'encre", mg: "Mitsitsy ranomainty", etapes: ["Documents internes : choisissez « Brouillon » ou « Rapide »", "Le texte reste lisible, l'encre dure plus longtemps", "Gardez la haute qualité pour les documents importants"], duree: 28, lien: "/" },
  { slug: "bourrage-papier", titre: "Bourrage papier : les bons gestes", mg: "Rehefa mihitsoka ny taratasy", etapes: ["Éteignez, puis ouvrez le capot doucement", "Tirez à deux mains, dans le sens du papier", "Vérifiez qu'aucun morceau n'est resté à l'intérieur"], duree: 27, lien: "/aide" },
  { slug: "imprimer-depuis-le-telephone", titre: "Imprimer depuis le téléphone", mg: "Manonta avy amin'ny finday", etapes: ["Imprimante Wi-Fi : installez l'application de la marque", "Téléphone et imprimante sur le même réseau Wi-Fi", "Imprimez photos et documents directement"], duree: 27, lien: "/" },
  { slug: "coupures-de-courant", titre: "Coupures de courant : protégez votre imprimante", mg: "Rehefa tapaka ny jiro", etapes: ["Coupure : débranchez l'imprimante", "Au retour du courant, la surtension peut l'abîmer", "Une multiprise parafoudre la protège pour peu cher"], duree: 32, lien: "/aide" },
  { slug: "test-des-buses", titre: "Des lignes blanches ? Faites d'abord un test des buses", mg: "Misy tsipika fotsy ve ?", etapes: ["Avant tout nettoyage : imprimez le test des buses", "Il se trouve dans les réglages, rubrique Entretien", "Toutes les lignes sont pleines ? Pas de nettoyage, pas d'encre perdue"], duree: 31, lien: "/aide" },
  { slug: "photocopie-sans-ordinateur", titre: "Photocopier sans ordinateur", mg: "Tsy mila solosaina", etapes: ["Document face contre la vitre", "Refermez, appuyez sur Copie noir ou couleur", "C'est prêt en quelques secondes (imprimantes multifonctions)"], duree: 27, lien: "/#catalogue" },
  { slug: "papier-et-humidite", titre: "Protégez le papier de l'humidité", mg: "Tandremo ny hamandoana", etapes: ["Le papier humide gondole et se coince", "Gardez les feuilles dans leur emballage fermé", "Jamais par terre ni près d'une fenêtre"], duree: 26, lien: "/aide" },
  { slug: "nettoyage-des-tetes", titre: "Nettoyage des têtes : pas trop souvent", mg: "Fanadiovana ny lohany", etapes: ["Un nettoyage, puis un nouveau test des buses", "Chaque nettoyage consomme beaucoup d'encre", "Pas mieux après 2 ou 3 ? Laissez reposer quelques heures"], duree: 29, lien: "/aide" },
  { slug: "reservoir-trait-minimum", titre: "Réservoir : jamais sous le trait minimum", mg: "Aza avela ho lany", etapes: ["Surveillez le niveau d'encre régulièrement", "Remplissez avant le trait du bas", "À sec, de l'air peut entrer dans les tuyaux"], duree: 27, lien: "/aide" },
];
