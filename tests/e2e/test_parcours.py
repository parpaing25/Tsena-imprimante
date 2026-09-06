"""Parcours critiques (phase 0 de l'audit) : ce qui doit marcher avant d'ouvrir le site.

Chaque test dit ce qu'il verifie dans son nom. Aucun test n'ecrit chez Andry :
en production le piege a robots est rempli et le serveur repond « ok » sans rien garder.
"""
import json
import re
import urllib.request

import pytest
from conftest import UA, remplir_piege


def _get(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, dict(r.headers), r.read()
    except urllib.error.HTTPError as e:
        return e.code, dict(e.headers), e.read()


# ── Accueil ──────────────────────────────────────────────────────────────
def test_accueil_un_seul_h1_et_sans_erreur_console(page_mobile, base_url):
    page_mobile.goto(base_url + "/", wait_until="networkidle")
    page_mobile.wait_for_timeout(800)
    assert page_mobile.locator("h1").count() == 1, "un seul h1 par page"
    assert "Tongasoa" in page_mobile.locator("h1").inner_text()
    assert page_mobile.erreurs_console == []


def test_accueil_mobile_sans_debordement_et_boutons_lisibles(page_mobile, base_url):
    page_mobile.goto(base_url + "/", wait_until="networkidle")
    page_mobile.wait_for_timeout(1500)
    mesures = page_mobile.evaluate(
        """() => {
          const vw = document.documentElement.clientWidth;
          const h1 = document.querySelector('h1').getBoundingClientRect();
          const btn = [...document.querySelectorAll('section button')].find(b => /063 34/.test(b.textContent));
          const r = btn.getBoundingClientRect();
          const carte = document.querySelector('#catalogue .product-card');
          return {scroll: document.documentElement.scrollWidth, vw, h1Right: h1.right, btnRight: r.right, btnW: r.width,
                  hauteurPage: document.body.scrollHeight, vh: window.innerHeight,
                  produitY: carte ? Math.round(carte.getBoundingClientRect().top + window.scrollY) : null};
        }"""
    )
    assert mesures["scroll"] <= mesures["vw"] + 1, "pas de defilement horizontal"
    assert mesures["h1Right"] <= mesures["vw"], "le titre du heros tient dans l'ecran (regression du 06/09/2026 : 1 082 px)"
    assert mesures["btnRight"] <= mesures["vw"], "le bouton Appeler tient dans l'ecran"
    # Refonte du 07/09/2026 : la page mesurait 23 948 px (28,4 ecrans) et le premier
    # produit arrivait a 3 503 px. Ces deux bornes gardent le benefice.
    assert mesures["hauteurPage"] <= 9 * mesures["vh"], f"accueil trop longue : {mesures['hauteurPage']} px"
    assert mesures["produitY"] is not None and mesures["produitY"] <= mesures["vh"], (
        f"le premier produit doit tenir dans le premier ecran, trouve a {mesures['produitY']} px")


def test_catalogue_liste_tous_les_produits(page_bureau, base_url):
    page_bureau.goto(base_url + "/#catalogue", wait_until="networkidle")
    page_bureau.wait_for_timeout(1200)
    cartes = page_bureau.locator("#catalogue .product-card")
    assert cartes.count() == 8, "huit produits d'emblee"
    page_bureau.get_by_role("button", name=re.compile("autres modeles|autres modèles")).click()
    page_bureau.wait_for_timeout(500)
    assert cartes.count() >= 15, "les quinze modeles apres le clic"


def test_grille_deux_colonnes_et_cartes_compactes(page_mobile, base_url):
    """Refonte du 07/09/2026 : la carte mesurait 548 px, une par ligne."""
    page_mobile.goto(base_url + "/#catalogue", wait_until="networkidle")
    page_mobile.wait_for_timeout(1200)
    m = page_mobile.evaluate(
        """() => {
          const c = [...document.querySelectorAll('#catalogue .product-card')];
          const r0 = c[0].getBoundingClientRect(), r1 = c[1].getBoundingClientRect();
          return {n: c.length, h: Math.round(r0.height), memeLigne: Math.abs(r0.top - r1.top) < 4,
                  coupe: c.some(e => e.getBoundingClientRect().right > document.documentElement.clientWidth + 1)};
        }"""
    )
    assert m["n"] == 8
    assert m["memeLigne"], "deux colonnes sur telephone"
    assert m["h"] <= 300, f"carte trop haute : {m['h']} px"
    assert not m["coupe"], "aucune carte ne depasse de l'ecran"


# ── Routes profondes (P0 corrige : base './') ────────────────────────────
@pytest.mark.parametrize("chemin,attendu", [
    ("/faq", "Questions"),
    ("/aide", "Aide"),
    ("/conseils", "Conseils"),
    ("/blog/1", "EcoTank"),
    ("/imprimantes/canon-g2470", "Canon PIXMA G2470"),
    ("/mentions-legales", "Mentions"),
])
def test_route_profonde_chargee_directement(page_mobile, base_url, chemin, attendu):
    page_mobile.goto(base_url + chemin, wait_until="networkidle")
    page_mobile.wait_for_timeout(500)
    assert attendu in page_mobile.locator("h1").first.inner_text()
    assert page_mobile.locator("h1").count() == 1
    assert not [e for e in page_mobile.erreurs_console if "MIME" in e or "Failed to load module" in e]
    canoniques = page_mobile.evaluate("() => [...document.querySelectorAll('link[rel=canonical]')].map(l => l.href)")
    assert len(canoniques) == 1, f"une seule balise canonical, trouve {canoniques}"
    assert canoniques[0].endswith(chemin)


def test_barre_finale_redirigee(base_url):
    code, entetes, _ = _get(base_url + "/faq/")
    # urllib suit les redirections : on retombe sur /faq en 200 avec son contenu
    assert code == 200
    assert b"Questions" in _


def test_page_inexistante_en_404_reel(page_mobile, base_url):
    code, _, corps = _get(base_url + "/cette-page-n-existe-pas")
    assert code == 404, "le serveur doit repondre 404, pas 200 (soft 404)"
    assert "Cette page n'existe pas".encode() in corps
    page_mobile.goto(base_url + "/cette-page-n-existe-pas", wait_until="networkidle")
    assert page_mobile.get_by_role("link", name="Retour à l'accueil").count() == 1


# ── Fichiers de decouvrabilite ───────────────────────────────────────────
def test_sitemap_products_json_et_llms(base_url):
    code, entetes, corps = _get(base_url + "/sitemap.xml")
    assert code == 200 and b"<urlset" in corps
    urls = re.findall(rb"<loc>([^<]+)</loc>", corps)
    assert len(urls) >= 25
    code, entetes, corps = _get(base_url + "/products.json")
    assert code == 200
    d = json.loads(corps)
    assert d["nombre_produits"] == len(d["produits"]) >= 12
    for p in d["produits"]:
        assert p["prix_min"] > 0 and p["url"].endswith("/imprimantes/" + p["id"])
    code, _, corps = _get(base_url + "/llms.txt")
    assert code == 200 and b"Tsena Imprimante" in corps
    code, _, corps = _get(base_url + "/robots.txt")
    assert code == 200 and b"sitemap.xml" in corps and b"sitemap.php" not in corps


# ── Parcours de conversion ───────────────────────────────────────────────
def test_commande_depuis_une_carte(page_mobile, base_url, en_prod):
    page_mobile.goto(base_url + "/#catalogue", wait_until="networkidle")
    page_mobile.wait_for_timeout(800)
    # Sur telephone la carte porte une seule action : la fiche, qui porte la commande.
    page_mobile.get_by_role("link", name="Voir la fiche").first.click()
    page_mobile.wait_for_url(re.compile(r"/imprimantes/"), timeout=15000)
    page_mobile.get_by_role("button", name="Commander").click()
    dlg = page_mobile.get_by_role("dialog")
    dlg.locator("#firstName").fill("Test")
    dlg.locator("#lastName").fill("Automatique")
    dlg.locator("#phone").fill("034 00 000 00")
    if dlg.locator("label[for=simple]").count():
        dlg.locator("label[for=simple]").click()
    dlg.locator("label[for=pickup]").click()
    remplir_piege(page_mobile)
    dlg.get_by_role("button", name="Envoyer la commande").click()
    confirmation = dlg.get_by_role("status")
    confirmation.wait_for(timeout=20000)
    texte = confirmation.inner_text()
    assert "Commande bien reçue" in texte
    assert re.search(r"TS-\w+-\w+", texte), "une reference est affichee"
    lien = dlg.get_by_role("link", name="Continuer sur WhatsApp").get_attribute("href")
    assert lien.startswith("https://api.whatsapp.com/send?phone=261")
    assert "%EF%BF%BD" not in lien, "pas de caractere de remplacement dans le message WhatsApp"


def test_contact_enregistre_et_confirme(page_mobile, base_url):
    page_mobile.goto(base_url + "/#contact", wait_until="networkidle")
    page_mobile.wait_for_timeout(800)
    sec = page_mobile.locator("#contact")
    # Refonte du 07/09/2026 : le formulaire est replie sur telephone.
    ouvrir = sec.get_by_role("button", name="Écrire un message")
    if ouvrir.count():
        ouvrir.click()
        page_mobile.wait_for_timeout(300)
    sec.locator("#name").fill("Test Automatique")
    sec.locator("#message").fill("Message de test du banc automatique — a ignorer.")
    remplir_piege(page_mobile)
    sec.get_by_role("button", name="Envoyer le message").click()
    sec.get_by_role("status").wait_for(timeout=20000)
    assert "Message bien reçu" in sec.get_by_role("status").inner_text()


def test_devis_pdf_genere(page_mobile, base_url):
    page_mobile.goto(base_url + "/#devis", wait_until="networkidle")
    page_mobile.wait_for_timeout(800)
    dv = page_mobile.locator("#devis")
    # Refonte du 07/09/2026 : le formulaire de devis se deplie a la demande.
    creer = dv.get_by_role("button", name="Créer mon devis")
    if creer.count():
        creer.click()
        page_mobile.wait_for_timeout(400)
    dv.locator("button[role=checkbox]").first.click()
    dv.locator("#name").fill("Test Automatique")
    dv.locator("#phone").fill("034 00 000 00")
    dv.locator("button[role=combobox]").first.click()
    page_mobile.get_by_role("option").first.click()
    remplir_piege(page_mobile)
    dv.get_by_role("button", name="Générer la Facture Proforma").click()
    dv.get_by_role("button", name="Télécharger PDF").wait_for(timeout=20000)
    with page_mobile.expect_download(timeout=20000) as dl:
        dv.get_by_role("button", name="Télécharger PDF").click()
    assert dl.value.suggested_filename.endswith(".pdf")
    assert "MGA MGA" not in dv.inner_text(), "double devise corrigee"


# ── Production seulement : en-tetes et cache ─────────────────────────────
def test_entetes_de_securite_en_production(base_url, en_prod):
    if not en_prod:
        pytest.skip("en-tetes Apache : production seulement")
    code, h, _ = _get(base_url + "/")
    h = {k.lower(): v for k, v in h.items()}
    assert code == 200
    for nom in ("strict-transport-security", "content-security-policy", "x-content-type-options", "referrer-policy", "permissions-policy"):
        assert nom in h, f"en-tete {nom} absent"
    code, h, corps = _get(base_url + "/")
    js = re.search(rb'src="(/assets/index-[^"]+\.js)"', corps).group(1).decode()
    code, h, _ = _get(base_url + js)
    h = {k.lower(): v for k, v in h.items()}
    assert code == 200 and "javascript" in h.get("content-type", "")
    assert "immutable" in h.get("cache-control", ""), "les bundles haches doivent etre caches un an"
