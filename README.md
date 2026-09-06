# Tsena Imprimante — site vitrine et catalogue

Site de vente d'imprimantes (Canon, HP, Epson) à Madagascar : https://tsenaimprimante.fonenako.mg
Catalogue avec prix en ariary, devis proforma PDF, commande transmise par e-mail + Telegram, page Facebook
« Tsena Imprimante » (bot vendeur séparé : `../bot-imprimante`).

Stack : Vite 5 + React 18 + TypeScript + Tailwind/shadcn. Aucune base de données : le catalogue vit dans
`src/data/products.ts`. Hébergement mutualisé o2switch (Apache + PHP) ; les formulaires parlent à
`public/api/*.php`. Audit pre-lancement du 06/09/2026 : voir `../audit-prelancement-2026-09-06/`.

## Installation

```powershell
npm ci
npm run dev          # http://localhost:8080
```

## Vérifier avant tout envoi

```powershell
npm run verify       # typecheck + lint + cohérence catalogue (prix = bible du bot)
npm run build        # build Vite, pré-rendu de TOUTES les routes (Chrome requis), products.json, sitemap.xml, llms.txt
npm run test:e2e     # parcours critiques (Playwright Python) sur dist/ servi localement
```

`npm run build` refuse de partir si `scripts/verifier-catalogue.mjs` trouve un prix incohérent avec
`../bot-imprimante/bible/bible-imprimante.json` (variable `TSENA_BIBLE` pour un autre chemin).

## Déployer (o2switch, FTP atomique)

```powershell
bash "$HOME/.deploy-sites/redeploy.sh" tsena
python outils/verifier_site.py           # statut, 404 réel, en-têtes, hash du bundle en ligne
```

`redeploy.sh` construit puis appelle `ftp_deploy_atomique.py` : envoi de tous les fichiers, bascule de
`index.html` en dernier, `.htaccess` en dernier, orphelins effacés après, vérification du hash en ligne.
Un déploiement n'est fini que quand `verifier_site.py` sort en code 0.

### Une seule fois sur le serveur

1. Créer `/home/<compte>/.tsena-secrets/config.php` à partir de `public/api/config.exemple.php`
   (destinataire e-mail, jeton Telegram, identifiant Telegram, clé du rapport). `chmod 600`.
2. Le dossier `/home/<compte>/.tsena-donnees/` (demandes, mesure d'audience) est créé par PHP au premier envoi.
3. Envoyer un message de test depuis le site : il doit arriver par e-mail ET sur Telegram.

## Où sont les choses

| Quoi | Où |
|---|---|
| Catalogue, prix | `src/data/products.ts` (source unique : site, products.json, JSON-LD, llms.txt, sitemap) |
| Coordonnées (téléphones, WhatsApp, e-mail, adresse) | `src/config/contact.ts` |
| Envoi des formulaires | `src/lib/leads.ts` → `public/api/lead.php` |
| Mesure d'audience (sans cookie) et erreurs JS | `src/lib/mesure.ts` → `public/api/evenement.php` ; lecture `public/api/rapport.php?cle=…` |
| Apache : en-têtes de sécurité, cache, 404 réel, redirections | `public/.htaccess` |
| Pages | `src/pages/*` ; fiche produit `/imprimantes/:id`, aide `/aide`, mentions légales |
| Réponses aide (= bible du bot) | `src/data/aide.ts` |
| Pré-rendu / SEO | `scripts/prerender.mjs`, `scripts/gen-seo.mjs`, `scripts/catalogue.mjs` |
| Tests bout en bout | `tests/e2e/` (pytest + Playwright, `pip install -r tests/requirements.txt`) |
| Exploitation | `outils/verifier_site.py`, `outils/rapport_hebdo.py`, `outils/sauvegarde_donnees.py`, `outils/amelioration_hebdo.py` |
| CI | `.github/workflows/ci.yml` (PR), `.github/workflows/nuit.yml` (prod chaque nuit) |

## Changer un prix

1. Modifier `src/data/products.ts` ET `../bot-imprimante/bible/bible-imprimante.json` (même chiffre).
2. `npm run verify` puis `npm run build` puis déployer. Le JSON-LD, `products.json` et `llms.txt` suivent.

## Incident

- Site blanc / 404 partout : `python outils/verifier_site.py` dit quoi ; retour arrière =
  `bash ~/.deploy-sites/redeploy.sh tsena` depuis le dernier commit sain (`git checkout <tag>`).
- Formulaires en erreur : ouvrir `https://tsenaimprimante.fonenako.mg/api/lead.php` (doit répondre 405 en JSON) ;
  vérifier `.tsena-secrets/config.php` et les droits de `.tsena-donnees/`.
- Aucune notification Telegram : le jeton dans `config.php` ; le bot doit avoir déjà reçu un message de l'utilisateur.
- Page Facebook / Messenger : ce dépôt n'y touche pas ; voir `../bot-imprimante` et `~/.hermes/profiles/imprimante`.
