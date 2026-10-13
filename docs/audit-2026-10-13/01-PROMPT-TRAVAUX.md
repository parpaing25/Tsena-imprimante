# Prompt de travaux — site Tsena Imprimante (suite de l'audit du 13/10/2026)

> Dépôt : `C:\Users\ANDRIANIRINA\Desktop\Site tsena imprimante\tsena-imprimante-mg-main`, branche
> `audit/prelancement-2026-09`. Site en ligne chez o2switch. Chaque lot se termine par sa vérification ;
> rien n'est annoncé « fait » sans mesure. Déploiement atomique à la fin, hash vérifié en ligne.

## Lot 1 — Réparer ce qui est cassé

1. **Montant en lettres** (`src/utils/pdfGenerator.ts`) : corriger les dizaines 70-79 et 90-99
   (`units[unitsDigit + 10]` → `teens[unitsDigit]`), poser les pluriels (millions, milliards,
   « quatre-vingts » sans unité), et écrire un banc Node qui vérifie 1 → 9 999 999 sans jamais produire
   « undefined », plus les cas 71 000, 95 000, 1 795 000, 3 295 000, 80 000, 100 000.
2. **WhatsApp** : `src/pages/Conseils.tsx:32,38,44` doivent passer par `lienWhatsApp()` de
   `src/config/contact.ts`. Plus aucun numéro en dur dans `src/` (contrôle par grep).
3. **Devis silencieux** : `ProformaQuoteForm.tsx` doit afficher une erreur visible si `/api/lead.php`
   échoue, proposer WhatsApp en repli, et garder le PDF déjà téléchargé.
4. **Animations fantômes** : définir `.animate-fade-in` (ou retirer son usage) et ajouter un bloc
   `@media (prefers-reduced-motion: reduce)` qui neutralise animations et transitions.
5. **Compteur du blog** : `Blog.tsx:90` calcule ses catégories au lieu du `count: 4` en dur.
6. **Mesure de provenance** : `src/lib/mesure.ts` envoie `utm_source`, `utm_medium`, `utm_campaign`,
   `utm_content` et le référent ; `public/api/evenement.php` les enregistre. Sans ça, on ne saura jamais
   ce que les publications Facebook rapportent.
7. **Notifications des demandes** : poser `/.tsena-secrets/config.php` sur le serveur (e-mail +
   Telegram du bot `@TsenaImprimante_bot`, clé de rapport aléatoire), puis **prouver** qu'une demande
   déclenche bien la notification.

## Lot 2 — Le devis proforma, refait

8. Charte Tsena (`#0D59A5` primaire, `#AE4B04` accent) au lieu du bleu Fonenako, **logo** en en-tête.
9. Bloc **paiement** (espèces, Mobile Money, virement) et **zone de signature** « Bon pour accord »
   avec date et cachet.
10. Ligne produit : référence du modèle à la place du poids ; unité « Ar » sur les prix unitaires.
11. **Mentions légales** en pied : NIF, STAT et forme juridique s'ils sont fournis, sinon une ligne
    neutre, jamais « à compléter ».
12. **QR code** vers la fiche du produit ou le site, en bas du devis.
13. Alléger : ne pas embarquer `html2canvas` (200 Ko) si le devis ne s'en sert pas.
14. Vérification : produire 3 devis (Tana, province, 7 lignes sur 2 pages), les **regarder**, et
    contrôler qu'aucun ne contient « undefined » ni « à compléter ».

## Lot 3 — Animations d'en-tête

15. Un composant `EnTetePage` (titre, sous-titre, fil d'Ariane) animé à l'arrivée, utilisé par Aide,
    Blog, FAQ, Conseils, Mentions légales et la fiche produit.
16. Héros : entrée douce du titre et des boutons, sans décalage de mise en page (CLS).
17. Tout respecte `prefers-reduced-motion`, et le contenu reste visible sans JavaScript.

## Lot 4 — Tutos vidéo

18. Page `/tutos` alimentée par **nos propres reels** (`publications-30j/astuces/sortie/*/reel.mp4`,
    voix malgache, sous-titres incrustés) : affiche verticale, lecture à la demande (`preload="none"`),
    titre et résumé français sous chaque vidéo.
19. Héberger les fichiers sur o2switch (`/videos/`), 8 à 10 vidéos pour commencer (~25 Mo), les autres
    ensuite.
20. JSON-LD `VideoObject` par vidéo, lien depuis le menu et depuis `/aide`.

## Lot 5 — Vérifier et déployer

21. `npm run verify` (typecheck + lint + catalogue), puis `npm run build`.
22. Audit navigateur `audit-2026-10-13/audit_site.py` : bureau et 390 px, console à zéro erreur,
    cibles tactiles ≥ 44 px, axe sans violation grave, parcours de devis réel avec PDF téléchargé.
23. Lighthouse mobile, 5 passages, médiane, en écartant les passages où une requête a rendu 429.
24. Déploiement atomique (`bash ~/.deploy-sites/redeploy.sh tsena`) puis **vérification du hash en
    ligne** et des pages clés.
25. Commit et push sur la branche, avec le rapport d'audit et les mesures d'après.

## Ce qui reste à Andry (à lui demander, pas à inventer)

- NIF, STAT, forme juridique, responsable de publication.
- Confirmation du numéro WhatsApp officiel.
- Assujettissement à la TVA (le devis écrit « TTC » sans ligne de taxe).
