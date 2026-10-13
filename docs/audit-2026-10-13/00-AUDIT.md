# Audit du site tsenaimprimante.fonenako.mg — 13/10/2026

Site en ligne = dépôt (bundle `index-BdIwFaId.js` identique en ligne et dans `dist/`, vérifié par curl).
Branche `audit/prelancement-2026-09`, dernier commit `ab7bc62`.

Tout ce qui suit a été **mesuré** : code lu avec son fichier:ligne, serveur lu par FTP, PDF produit par le
code du site puis regardé, pages lues en ligne avec un agent utilisateur réaliste. Ce qui n'a pas pu être
mesuré est dit tel quel.

---

## 1. Ce qui est cassé, et ce que ça coûte

### 1.1 🔴 Le montant en lettres du devis écrit « undefined »
`src/utils/pdfGenerator.ts:33-46`. Pour les dizaines 70-79 et 90-99, le code fait
`units[unitsDigit + 10]` alors que `units` n'a que 10 entrées : le résultat est toujours `undefined`.

Rejoué sur les vrais montants (`_audit_lettres.mjs`) :
- les 18 prix du catalogue passent (aucun ne tombe sur 71-79 / 91-99) ;
- **tout total qui y tombe casse** : `3 295 000 → « trois million deux cent quatre-vingt-undefined mille »`,
  `1 795 000 → « …quatre-vingt-undefined mille »`, `71 000 → « soixante-undefined mille »`.
  3 295 000 Ar, c'est deux G2470 + une MF3010 + 45 000 Ar de livraison : un panier banal.
- Le pluriel manque aussi : « trois million », « deux million ».

Conséquence : le client reçoit un document commercial qui contient le mot « undefined ».

### 1.2 🟠 Un deuxième numéro WhatsApp vit encore dans le site
`src/pages/Conseils.tsx:32,38,44` : `wa.me/261327209033`, trois fois, alors que tout le reste du site
utilise `CONTACT.whatsapp` = `261337106334` (`src/config/contact.ts:23`). Le 032 72 090 33 est le numéro
que l'audit du 06/09 avait écarté : absent de la page Facebook et de la bible du bot.

### 1.3 🟠 Le devis échoue en silence
`src/components/ProformaQuoteForm.tsx:206-207` : si l'envoi de la demande échoue, le site n'émet qu'un
événement interne. Le client a son PDF, croit la demande partie, et **personne n'est prévenu**.
(Le formulaire de contact et celui d'achat, eux, affichent bien l'erreur.)

### 1.4 🟠 Une animation utilisée mais inexistante
`src/components/Header.tsx:59` applique `animate-fade-in` ; cette classe n'est définie ni dans
`src/index.css` ni dans `tailwind.config.ts` (seule `animate-fade-in-scale` existe, l.230).
`AnimatedSection` accepte le même nom (`src/components/AnimatedSection.tsx:6`). Les éléments concernés
restent donc à `opacity-0` ou n'ont aucune animation, selon le chemin.

### 1.5 ⚪ Compteur écrit en dur
`src/pages/Blog.tsx:90` : la catégorie « Comparatif » annonce `count: 4` en dur. Un article ajouté ou
retiré et le compte ment.

### 1.6 ⚪ Mentions légales incomplètes
`src/pages/MentionsLegales.tsx:39-42` : forme juridique, responsable, NIF et STAT portent encore
« à compléter ». La loi n° 2014-024 les rend obligatoires.

---

## 2. Ce qui ne remonte à personne (mesuré sur le serveur)

| Fait | Mesure |
|---|---|
| **Aucune notification de demande** | `/.tsena-secrets/` **n'existe pas** sur le serveur (listé par FTP). `public/api/_commun.php:31-45` : sans ce fichier, ni e-mail ni Telegram ne partent. |
| **Aucune demande reçue depuis le 07/09** | `/.tsena-donnees/` contient `evenements/` et `limites/`, **pas de dossier de demandes**. |
| **101 visites en 5 semaines** | 17 fichiers `evenements/*.jsonl`, 101 événements du 07/09 au 13/10 (1 à 6 par jour, un pic de 53 le 18/09). |
| **Provenance jamais enregistrée** | `src/lib/mesure.ts` n'envoie ni `utm_source` ni référent (champ `r` vide dans les 101 événements). Impossible de savoir ce que les 73 publications Facebook programmées ont rapporté. |

C'est le point le plus coûteux de l'audit : le site peut recevoir des demandes, mais **rien ne prévient
Andry**, et rien ne mesure d'où viennent les visiteurs.

---

## 3. Le devis proforma, regardé

Produit avec le code du site (`PDFGenerator.generateInvoice`), deux cas : panier Tana (1 page) et panier
province de 7 modèles (2 pages). Captures : `captures/cas1-p1.png`, `cas2-p1.png`, `cas2-p2.png`.

Ce qui va : structure claire (en-tête, « facturé à », tableau, livraison, conditions, encadré total),
pagination correcte, pied de page avec le site et le téléphone, formule malgache finale.

Ce qui ne va pas :
1. **Ce ne sont pas les couleurs de Tsena.** Le PDF est en `#1E6B8C` (`pdfGenerator.ts:110-112`), le bleu
   de Fonenako. Le site est en `#0D59A5` avec l'orange `#AE4B04` (`src/index.css:26,36`).
2. **Pas de logo** : aucun `addImage` dans le fichier, l'en-tête est purement typographique.
3. **Aucune mention légale** : ni NIF, ni STAT, ni forme juridique (0 occurrence).
4. **Pas de zone de signature** ni de « Bon pour accord » : un devis d'entreprise se signe.
5. **Les moyens de paiement sont une ligne de conditions**, pas un bloc utilisable (pas de numéro Mobile
   Money, pas de titulaire).
6. **Le poids du produit** est affiché sous chaque ligne (« 5.8 kg ») : utile à la livraison, pas au client.
7. **Un tiers de page vide** en bas du cas 1 : la place existe pour le paiement, la signature et un QR code.
8. Les prix unitaires n'affichent pas leur unité (seuls les totaux portent « MGA »).

---

## 4. Animations : ce qu'il y a et ce qu'il manque

- `AnimatedSection` (révélation au défilement) n'est utilisé **que** dans `ContactSection.tsx` ; aucun
  en-tête de page n'est animé.
- Les classes `.animate-float`, `.animate-bounce-in`, `.animate-pulse-glow`, `.hover-lift` sont définies
  (`src/index.css:172-232`) et **jamais utilisées**.
- **`prefers-reduced-motion` n'est respecté nulle part** dans `src/index.css` ni dans les composants
  (seule trace : `src/App.css:30`, fichier hérité du modèle Vite). C'est un défaut d'accessibilité.
- Le héros fait défiler des images de fond en `opacity` (`HeroSection.tsx:56`) ; les pages intérieures
  (Aide, Blog, FAQ, Conseils, Mentions) n'ont aucun en-tête travaillé.

---

## 5. Vidéos : zéro sur le site, trente déjà produites à côté

Aucune balise `video`, aucun `iframe` YouTube dans `src` — et aucun JSON-LD `VideoObject`.

Pourtant, `publications-30j/astuces/sortie/` contient **30 reels de 24 à 32 s déjà fabriqués et vérifiés**
(voix malgache Abidi, sous-titres incrustés, ~2,3 Mo chacun), plus 15 reels produits. Ce sont nos propres
vidéos, libres de droits : elles n'attendent qu'une page.

---

## 6. Ce qui est déjà bon (à ne pas casser)

- Site en ligne = dépôt, 30 routes pré-rendues, vrai 404, `base: '/'`.
- SEO : titre, description et canonical uniques par page ; JSON-LD `LocalBusiness`, `Product`, `Offer`,
  `FAQPage`, `BreadcrumbList` sur la fiche ; sitemap et `llms.txt` générés au build.
- Les trois formulaires passent par `/api/lead.php` avec accusé serveur (référence `TS-AAMMJJ-XXXX`),
  piège à robots, limite de débit, écriture avant notification.
- `scripts/verifier-catalogue.mjs` fait échouer le build si le site et la bible du bot divergent.
- 12 tests e2e Playwright, contrôle nocturne, rapport hebdomadaire.

---

## 7. Ce que je ne peux pas mesurer sans Andry

- NIF, STAT, forme juridique, responsable de publication (mentions légales et devis).
- Le numéro WhatsApp officiel, si ce n'est pas le 033 71 063 34.
- L'assujettissement à la TVA : le devis écrit « TTC » partout, sans ligne de taxe.
