# Tsena imprimante — règles de travail

tsenaimprimante.fonenako.mg : vente d'imprimantes. Vite 5 + React 18 + TypeScript + Tailwind 3.4 +
shadcn/ui, **sans base de données** : le catalogue vit dans `src/data/products.ts`, et le build
pré-rend toutes les routes. `README.md` fait foi pour tout ce qui n'est pas ici.

## Ce qui ne se discute pas

- **Dépôt PUBLIC** (`parpaing25/Tsena-imprimante`) : aucun secret, aucun code de composant payant ou
  sous licence restrictive.
- **Branche de production : `audit/prelancement-2026-09`**. Commit par chemins explicites, puis push de
  la branche.
- **Avant tout envoi** : `npm run verify`, `npm run build` (pré-rendu, Chrome requis ; refuse de partir
  si un prix diffère de la bible du bot `../bot-imprimante/bible/bible-imprimante.json`), puis
  `npm run test:e2e`.
- **Déploiement** : `bash "$HOME/.deploy-sites/redeploy.sh" tsena`, puis `python outils/verifier_site.py`
  (skill `deploy-site-o2switch`).
- **CSP** : rien d'externe ; `unsafe-inline` sur `style-src` seulement (attributs style de React, feuille
  de Sonner) ; `blob:` pour le PDF (jsPDF).
- `html2canvas` reste un alias vers un module vide (200 Ko épargnés, `vite.config.ts`).
- **Aucune caractéristique d'imprimante inventée** : ce qui n'est pas dans `products.ts` ne s'affiche pas.

## Design et mouvement (25/10/2026)

- Règles du mouvement : **`MOUVEMENT.md`** (décision du site, puis R1 à R17). Une seule bibliothèque
  autorisée : `@formkit/auto-animate` 0.10.0, pour la grille du catalogue. Motion seulement pour un
  geste, et sur décision d'Andry.
- **Avant de dessiner** : skill `frontend-design` (un agent sans l'outil Skill lit
  `~/.claude/plugins/marketplaces/claude-plugins-official/plugins/frontend-design/skills/frontend-design/SKILL.md`).
- **Passe de finition au téléphone** : `.claude/skills/mobile-native/SKILL.md`, toujours. S'il y a du
  mouvement : `.claude/skills/animation-performance/SKILL.md` et `.claude/skills/emil-design-eng/SKILL.md`.
  Ces trois skills (Emil Kowalski, MIT) sont posés en local, hors git : sur un clone neuf, les recopier
  depuis `~/Desktop/SITES-VITRINES/.claude/skills/`. Ils disent COMMENT animer, jamais SI ; quand ils
  proposent une bibliothèque, un CDN ou une police externe, la réponse est non.
- `ui-ux-pro-max` : grille de relecture UX seulement (`references/quick-reference.md`), jamais pour
  choisir un style. Pour React et shadcn : `vercel:react-best-practices`, `vercel:shadcn`.
- **Banque de composants** : `~/Desktop/BANQUE-COMPOSANTS`. Avant de copier un composant : licence
  compatible avec un dépôt public, écrit pour Tailwind 3.4 (un composant Tailwind v4 casse ici sans
  erreur), sans React 19, sans ressource externe, mouvement réduit respecté, poids mesuré.
- **Aspect « généré »** : `node ~/Desktop/SITES-VITRINES/outils/externe/taste-lint.mjs src`. Ses FAIL sont
  des preuves à examiner, pas un verdict : ses règles sont plus dures que les nôtres.
- Toute modification visuelle se regarde : captures à la taille de l'écran d'Andry et à 390 px, et le
  test « mouvement réduit » (aucun élément laissé à opacité 0).
