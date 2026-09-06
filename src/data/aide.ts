/**
 * Contenu de la page Aide & dépannage — les MÊMES réponses que le bot vendeur
 * de la page Facebook (bot-imprimante/bible/bible-imprimante.json, version du
 * 06/09/2026), en français et en malgache. Quand une réponse change, la changer
 * ici ET dans la bible : un client doit lire la même chose partout.
 */
export interface EntreeAide {
  cle: string;
  question: string;
  fr: string;
  mg: string;
}

export const AIDE_FAQ: EntreeAide[] = [
  {
    cle: "kit_externe",
    question: "C'est quoi le « kit externe » ?",
    fr: "Le kit externe (système d'encre continu) : des réservoirs posés à côté de l'imprimante, reliés aux cartouches. On remplit à la bouteille au lieu de racheter des cartouches, l'encre revient beaucoup moins cher par page. Nous le fournissons monté sur les modèles « avec kit ».",
    mg: "Ny kit externe (système d'encre continu) : réservoir apetraka eo akaikin'ny imprimante, mifandray amin'ny cartouche. Fenoina tavoahangy fotsiny fa tsy mividy cartouche vaovao — tena mora kokoa ny encre isaky ny pejy. Efa apetrakay vita ho anao amin'ny modely « avec kit ».",
  },
  {
    cle: "jet_vs_laser",
    question: "Jet d'encre ou laser ?",
    fr: "Jet d'encre : moins cher à l'achat, couleur et photo, parfait pour de petits volumes. Laser (MF3010) : rapide, noir & blanc, toner qui dure — c'est le bon choix pour la photocopie et les gros volumes. Entre les deux, le réservoir (G3410, G2470, EcoTank) : couleur ET coût par page très bas.",
    mg: "Jet d'encre : mora kokoa ny vidiny, miloko sy sary, mety amin'ny pejy vitsy. Laser (MF3010) : haingana, mainty sy fotsy, maharitra ny toner — izy no mety amin'ny photocopie sy pejy betsaka. Eo anelanelany ny réservoir (G3410, G2470, EcoTank) : miloko NEFA mora be ny vidin'ny pejy iray.",
  },
  {
    cle: "reservoir",
    question: "Une imprimante « à réservoir », c'est quoi ?",
    fr: "Imprimante à réservoir (série G Canon, EcoTank Epson) : on verse l'encre à la bouteille, environ 6 000 pages en noir avec les bouteilles fournies sur la G3410 / G2470. C'est le coût par page le plus bas en couleur.",
    mg: "Imprimante réservoir (Canon série G, Epson EcoTank) : arotsaka tavoahangy ny encre, tokony ho 6 000 pejy mainty amin'ny tavoahangy omena miaraka amin'ny G3410 / G2470. Izy no mora indrindra isaky ny pejy raha miloko.",
  },
  {
    cle: "livraison",
    question: "Livrez-vous ? À quel prix ?",
    fr: "Livraison + installation GRATUITE à Tana Ville. Livraison en province possible (frais et délai selon la ville, indiqués sur le devis avant validation).",
    mg: "Livraison + installation MAIMAIM-POANA ao Tana Ville. Azo atao ny livraison any amin'ny faritra (ny saran-dalana sy ny fotoana dia arakaraka ny tanàna, hita ao amin'ny devis).",
  },
  {
    cle: "garantie",
    question: "Les imprimantes sont-elles garanties ?",
    fr: "Toutes nos imprimantes sont neuves sous carton, avec garantie & SAV. Pour la durée exacte de garantie du modèle qui vous intéresse, demandez-nous : elle figure sur le devis.",
    mg: "Vaovao ao anaty carton daholo ny imprimante, misy garantie & SAV. Ho an'ny faharetan'ny garantie amin'ny modely tianao, anontanio izahay : voasoratra ao amin'ny devis.",
  },
  {
    cle: "installation",
    question: "Qui installe l'imprimante ?",
    fr: "À Tana Ville, nous livrons ET nous installons gratuitement : branchement, Wi-Fi, pilotes sur votre ordinateur ou votre téléphone, premier test d'impression.",
    mg: "Ao Tana Ville dia manatitra sy manao installation maimaim-poana izahay : fampidirana, WiFi, pilote amin'ny ordinateur na finday, test impression voalohany.",
  },
  {
    cle: "consommables",
    question: "Vendez-vous les encres, bouteilles et toners ?",
    fr: "Oui, nous vendons aussi les encres, bouteilles et toners de nos imprimantes. Dites-nous le modèle, on vous donne la référence et le prix.",
    mg: "Eny, mivarotra encre, tavoahangy encre ary toner ho an'ny imprimante izahay. Lazao anay ny modely, omenay anao ny référence sy ny vidiny.",
  },
  {
    cle: "paiement",
    question: "Comment payer ?",
    fr: "Espèces à la livraison ou au retrait, virement bancaire, Mobile Money (MVola, Orange Money). Aucun paiement en ligne sur le site : écrivez-nous ou appelez-nous, on vous confirme tout de suite.",
    mg: "Vola an-tanana rehefa tonga na rehefa alaina, virement, Mobile Money (MVola, Orange Money). Tsy misy fandoavam-bola an-tserasera eto : soraty anay na antsoy izahay, hamarininay avy hatrany.",
  },
  {
    cle: "adresse",
    question: "Où êtes-vous ? Peut-on venir voir un modèle ?",
    fr: "Nous livrons et installons gratuitement à Tana Ville : nous venons chez vous. Pour un retrait ou pour voir le modèle, écrivez-nous, on vous indique où et quand.",
    mg: "Manatitra sy manao installation maimaim-poana ao Tana Ville izahay : tonga any aminao. Raha te haka na hijery ny modely ianao, soraty anay, lazainay anao ny toerana sy ny fotoana.",
  },
  {
    cle: "devis",
    question: "Faites-vous des devis au nom d'une société ?",
    fr: "Oui. Utilisez le formulaire de facture proforma du site (PDF immédiat) ou envoyez-nous le nom de la société et le(s) modèle(s) souhaité(s), vous le recevez rapidement.",
    mg: "Eny. Ampiasao ny formulaire facture proforma eto amin'ny site (PDF avy hatrany) na alefaso anay ny anaran'ny orinasa sy ny modely tianao, dia ho azonao haingana.",
  },
];

export interface ConseilUsage {
  cle: string;
  titre: string;
  fr: string;
  mg: string;
  modeles: string[];
}

export const AIDE_CONSEILS: ConseilUsage[] = [
  { cle: "maison", titre: "Maison et devoirs", fr: "Une jet d'encre compacte suffit.", mg: "Imprimante jet d'encre kely dia ampy.", modeles: ["canon-ts3640", "canon-mg2545s", "canon-ts3440"] },
  { cle: "etudiant", titre: "Étudiant", fr: "Compacte, pas chère, et le kit externe fait baisser le coût de l'encre.", mg: "Kely, mora vidy, ary ny kit externe no mampidina ny vidin'ny encre.", modeles: ["canon-ts3640", "canon-mg2545s", "epson-l3211"] },
  { cle: "bureau", titre: "Bureau", fr: "Réservoir (G3410) ou laser (MF3010) selon le volume.", mg: "Réservoir (G3410) na laser (MF3010) arakaraka ny habetsaky ny impression.", modeles: ["canon-g3410", "canon-tr4640", "canon-mf3010"] },
  { cle: "pme", titre: "PME", fr: "Le coût par page compte plus que le prix d'achat : réservoir ou laser.", mg: "Ny vidin'ny pejy iray no zava-dehibe : réservoir na laser.", modeles: ["canon-g3410", "canon-g2470", "canon-mf3010"] },
  { cle: "cyber", titre: "Cyber et photocopie", fr: "Gros volume, donc réservoir ou laser.", mg: "Betsaka ny pejy, ka réservoir na laser.", modeles: ["canon-g3410", "canon-g2470", "canon-mf3010"] },
  { cle: "ecole", titre: "École", fr: "Réservoir rechargeable, l'encre revient très peu cher.", mg: "Réservoir rechargeable, tena mora ny encre.", modeles: ["canon-g3410", "canon-g2470", "canon-ts3640"] },
  { cle: "photo", titre: "Photo", fr: "5 ou 6 encres (TS9540, Epson L805).", mg: "Encre 5 na 6 (TS9540, Epson L805).", modeles: ["epson-l805", "canon-ts9540", "epson-l4260"] },
  { cle: "a3", titre: "Format A3", fr: "Canon TS9540.", mg: "Canon TS9540.", modeles: ["canon-ts9540"] },
  { cle: "gros_volume", titre: "Gros volume", fr: "En noir : laser MF3010 ; en couleur : réservoir G2470 / G3410.", mg: "Mainty : laser MF3010 ; miloko : réservoir G2470 / G3410.", modeles: ["canon-mf3010", "canon-g2470", "canon-g3410"] },
];

export interface Panne {
  symptome: string;
  etapes: string[];
}

export const AIDE_PANNES: Panne[] = [
  { symptome: "L'imprimante ne répond plus", etapes: ["Vérifiez le câble d'alimentation et l'interrupteur.", "Éteignez l'imprimante 30 secondes, rallumez-la, puis redémarrez l'ordinateur ou le téléphone.", "En USB : changez de port ; en Wi-Fi : vérifiez que l'imprimante et l'appareil sont sur le même réseau.", "Si rien ne change, appelez-nous : le diagnostic par téléphone est gratuit."] },
  { symptome: "Impression pâle ou lignes blanches", etapes: ["Vérifiez le niveau d'encre (réservoir ou cartouche).", "Lancez un nettoyage des têtes depuis le menu de l'imprimante ou le pilote (2 fois maximum).", "Imprimez une page de test ; si les lignes persistent après 24 h de repos, contactez-nous."] },
  { symptome: "Bourrage papier", etapes: ["Éteignez l'imprimante avant de retirer le papier, doucement, dans le sens de la sortie.", "Vérifiez qu'il ne reste aucun morceau ; utilisez du papier 70–80 g, non humide, bien aligné avec les guides.", "Ne chargez pas plus que la capacité du bac (60 à 150 feuilles selon le modèle)."] },
  { symptome: "Wi-Fi perdu", etapes: ["Redémarrez la box ou le partage de connexion, puis l'imprimante.", "Relancez la connexion depuis l'application Canon PRINT, Epson Smart Panel ou HP Smart.", "À Tana, nous pouvons reconfigurer à distance ou passer chez vous."] },
  { symptome: "Le kit externe n'alimente plus", etapes: ["Vérifiez que les bouchons d'aération des réservoirs sont ouverts.", "Placez les réservoirs au même niveau que l'imprimante, jamais plus haut.", "Contrôlez le tuyau : pas de pli, pas de bulle d'air longue. Sinon, écrivez-nous avec une photo."] },
];
