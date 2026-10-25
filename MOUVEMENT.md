# Mouvement et design — Tsena imprimante

Posées le 25/10/2026 après la veille « Framer Motion, skill design, banque de composants » et quatre
rapports de recherche (A skills, B mouvement, C composants, D état des sites), hors dépôt, dans
`~/veille-video/synthese/recherche-2026-10-25/`. Plan approuvé par Andry le 25/10/2026.
Les recettes de code (ressorts `linear()`, cascade par lot, test « mouvement réduit ») sont dans
`B-motion.md` §7.

## Décision pour ce site

- **Une seule bibliothèque : `@formkit/auto-animate` 0.10.0**, en version exacte (`--save-exact`), pour
  la grille du catalogue quand on filtre ou cherche (environ 3,1 Ko gz). Rien d'autre sans Andry (R14).
- **Motion (ex-Framer Motion) : pas maintenant.** Il ne se justifie que pour un geste (glisser, balayer,
  tiroir, sortie animée d'un composant démonté). Une seule photo par produit : aucun geste à servir.
  S'il entre un jour : `m` + `LazyMotion strict` + `MotionConfig reducedMotion="user"` (le défaut est
  `"never"`), version exacte, poids remesuré.
- **Chantiers retenus** : remplacer l'état `opacity-0` d'`AnimatedSection` (figé dans le HTML pré-rendu)
  par une apparition CSS visible sans JS ; ressorts sur `transform` à la place de
  `transition-all ... hover:scale-105` ; comparateur d'imprimantes et barre d'achat collante sur la fiche
  produit, avec les seules données de `src/data/products.ts`.
- **Composant repris d'une banque** : licence compatible avec un dépôt PUBLIC, écrit pour Tailwind 3.4
  (un composant Tailwind v4 casse ici sans aucune erreur), sans dépendance à React 19, sans ressource
  externe (CSP), mouvement réduit respecté.

## Règles communes (les mêmes sur Hourdis, Tsena et Diako)

Sources entre crochets : `B-motion.md` §13.

- **R1. CSS d'abord.** Un effet faisable en CSS (transition, `@keyframes`, `animation-timeline`, `@starting-style`, `linear()`, View Transitions) ne passe jamais par du JS.
- **R2. Propriétés autorisées en mouvement** : `transform` et `opacity` (plus `filter` et `clip-path` si nécessaire). Jamais `width`, `height`, `top`, `left`, `margin` ; éviter `box-shadow` et `background-position` en boucle. Jamais `transition: all`. [D S11 S29]
- **R3. Rien sur l'élément LCP au chargement** : ni `.reveal`, ni `initial={{ opacity: 0 }}`, ni `AnimatedSection` au-dessus de la ligne de flottaison. Un `@keyframes` CSS de ≤ 300 ms démarré au premier rendu est toléré ; mieux : rien. [D S29]
- **R4. Zéro décalage de mise en page** : dimensions réservées (`width`/`height`, `aspect-ratio`, `min-height`) avant toute animation ; une liste filtrée garde sa hauteur ; une entrée part d'un état qui occupe déjà sa place.
- **R5. Mouvement réduit, à trois niveaux** : (a) CSS sous `@media (prefers-reduced-motion: reduce)` ; (b) tout `animate()` de Motion est précédé d'un test `matchMedia`, et écoute son changement ; AutoAnimate lit la préférence une seule fois, à l'initialisation de chaque parent, et ne l'écoute pas ensuite : ne jamais lui passer `disrespectUserMotionPreference` [D S35] ; (c) en React, `<MotionConfig reducedMotion="user">` (le défaut est `"never"`). « Réduit » ne veut pas dire « rien » : garder les fondus courts. Test Playwright obligatoire (§7 G).
- **R6. Le contenu est visible sans JS ni animation.** L'état caché n'est posé que sous `html.js` ; si `IntersectionObserver` manque, tout est montré. Une section qui reste à opacité 0 est un défaut bloquant (`CONSIGNE-MAQUETTE.md`).
- **R7. Un seul observateur par page et par réglage**, `unobserve` après passage. Un observateur par carte est interdit (leçon de `useReveal`).
- **R8. `will-change` jamais permanent, jamais sur une liste** : seulement le temps du mouvement (une couche GPU par élément) [D S11].
- **R9. Durées** : retour d'interaction 120 à 200 ms ; apparition 400 à 600 ms ; décalage de cascade 60 ms par rang, plafonné à 4 ; sortie plus courte que l'entrée (principe du preset 10 de `ui-ux-pro-max`).
- **R10. Boucles infinies** : lentes (12 s et plus), compositeur seul, en pause hors écran et onglet masqué, coupées sous `reduce`.
- **R11. Pas de défilement adouci (Lenis) ni de section épinglée au tactile** (`CONSIGNE-MOBILE.md:37`).
- **R12. Ancêtre de `position: fixed`** : aucun `transform`, `filter`, `perspective`, ni `will-change` de ces propriétés, y compris à l'état final. Une identité (`translateY(0)`, `matrix(1, 0, 0, 1, 0, 0)`) n'est PAS `none` et suffit à créer le bloc conteneur (incident de Diako, `index.css:884-902`). **Mesuré par l'agent D** (Chromium, `animate` hybride de Motion 14.6.0, image-clés `["translateY(14px)", "none"]`, source `motion-test\entrees\g_csp_page.js`) : l'attribut `style` final contient `transform: translateY(0px)`, pas `none` [D L8]. Parades : n'animer que l'opacité sur un ancêtre d'élément fixe ; ou, une fois l'animation finie, poser `el.style.transform = 'none'` (propriété CSSOM, permise par la CSP) ; test : `getComputedStyle(el).transform === 'none'` après la fin. Avec `motion/mini` (WAAPI direct), l'état final écrit devrait être la dernière image-clé telle quelle [N : non mesuré]. Pour une apparition en CSS, `animation-fill-mode: backwards` (recette B), jamais `both` ni `forwards` : à la fin, le style normal revient sans `transform` résiduel (`transform` calculé = `none` après l'animation, mesuré) [D].
- **R13. Toute bibliothèque se mesure avant et après** : build, octets gz et br, comparaison au budget du site, Lighthouse en médiane de 3 passes. Sans mesure, pas de fusion. Un nouveau morceau doit être ajouté à la somme du budget (sinon la CI reste verte à tort).
- **R14. Aucune dépendance d'animation sans décision d'Andry**, avec son coût en kB gz dans la demande.
- **R15. Test sur le matériel visé** : capture à 390 px, processeur ralenti 4 fois, et si possible un vrai Android d'entrée de gamme ; sur iPhone pour tout ce qui touche à Safari (`commitStyles`, View Transitions, `animation-timeline`).
- **R16. Version exacte** : `--save-exact`, pas de `^` sur une bibliothèque d'animation (Motion a changé deux fois de version majeure en moins de trois mois : 13.0.0 le 05/08, 14.0.0 le 02/10).
- **R17. Une apparition est une animation, pas une transition.** `@keyframes` avec seulement `from`, `animation-fill-mode: backwards`, délai de cascade en variable `--rang`. Une transition garde son `transition-delay` pour toute la vie de l'élément, et une autre règle `transition` sur le même élément la remplace en entier (mesuré chez Diako : fondu perdu sur 15 emplacements, survol retardé de 240 ms). Un état visible qui écrit `transform: none` bat aussi, par sa spécificité (0,3,1 contre 0,2,0 pour `.carte:hover`), le survol du même élément. Si l'élément peut être caché puis réaffiché (onglet, accordéon), retirer ses classes à `animationend` (recette B bis).
