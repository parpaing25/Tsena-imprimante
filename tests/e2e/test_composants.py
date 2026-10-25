"""Composants du 25/10/2026 (décision d'Andry) : comparateur d'imprimantes et barre d'achat collante.

Aucun test n'écrit chez Andry : ils lisent des pages et ouvrent la fenêtre de commande sans
l'envoyer. Les valeurs attendues viennent de /products.json, généré depuis src/data/products.ts.
"""
import base64
import json
import re
import urllib.request

from conftest import UA

TANK_SANS_KIT = "canon-g2470"
TANK_WIFI = "canon-g3410"
JET_AVEC_KIT = "canon-mg2545s"


def _get(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()


def _catalogue(base_url):
    code, corps = _get(base_url + "/products.json")
    assert code == 200
    return {p["id"]: p for p in json.loads(corps)["produits"]}


def _prix_court(n: int) -> str:
    return f"{n:,}".replace(",", ".") + " Ar"


def _tableau(page):
    """Lignes du tableau : {titre de ligne: [valeurs par colonne]}."""
    return page.evaluate(
        """() => Object.fromEntries([...document.querySelectorAll('table tbody tr')].map(tr => [
             tr.querySelector('th[scope=row]').textContent.trim(),
             [...tr.querySelectorAll('td')].map(td => td.textContent.trim())]))"""
    )


# ── Comparateur ──────────────────────────────────────────────────────────
def test_comparateur_prerendu_lisible_sans_javascript(base_url):
    code, corps = _get(base_url + "/comparer")
    assert code == 200
    html = corps.decode("utf-8")
    assert "Comparer des imprimantes" in html and "<h1" in html
    assert html.count('type="checkbox"') == 15, "les 15 modèles à cocher sont dans le HTML statique"


def test_comparateur_tableau_accessible_et_valeurs_du_catalogue(page_mobile, base_url):
    cat = _catalogue(base_url)
    page_mobile.goto(f"{base_url}/comparer?comparer={TANK_SANS_KIT},{JET_AVEC_KIT}", wait_until="networkidle")
    table = page_mobile.locator("table")
    assert table.locator("caption").count() == 1
    entetes = table.locator("thead th[scope=col]")
    assert entetes.count() == 2
    assert cat[TANK_SANS_KIT]["nom"] in entetes.nth(0).inner_text()
    lignes = table.locator("tbody tr")
    assert lignes.count() >= 8
    for i in range(lignes.count()):
        assert lignes.nth(i).locator("th[scope=row]").count() == 1
        assert lignes.nth(i).locator("td").count() == 2

    t = _tableau(page_mobile)
    assert t["Prix"] == [_prix_court(cat[TANK_SANS_KIT]["prix_min"]), _prix_court(cat[JET_AVEC_KIT]["prix_min"])]
    # Le réservoir n'a ni prix « avec kit » ni kit inclus : donnée absente, dite telle quelle.
    assert t["Avec kit externe"] == ["non précisé", _prix_court(cat[JET_AVEC_KIT]["prix_max"])]
    non_precise = [k for k, v in t.items() if "non précisé" in v]
    assert non_precise == ["Avec kit externe"], f"« non précisé » ailleurs : {non_precise}"

    # 390 px : rien ne déborde de la page, et deux modèles tiennent sans défilement horizontal.
    assert page_mobile.evaluate("document.documentElement.scrollWidth <= window.innerWidth")
    region = page_mobile.get_by_role("region", name=re.compile("^Comparaison de"))
    assert region.evaluate("e => e.scrollWidth <= e.clientWidth + 1")
    assert page_mobile.erreurs_console == []


def test_comparateur_ligne_vide_pour_tous_disparait(page_mobile, base_url):
    page_mobile.goto(f"{base_url}/comparer?comparer={TANK_SANS_KIT},{TANK_WIFI}", wait_until="networkidle")
    t = _tableau(page_mobile)
    assert "Avec kit externe" not in t, "aucun des deux n'a de prix avec kit : la ligne doit disparaître"
    assert "non précisé" not in json.dumps(t, ensure_ascii=False)
    assert t["Wi-Fi"] == ["Non", "Oui"]
    # « N'afficher que les différences » retire les lignes identiques, et y revient.
    identiques = [k for k, v in t.items() if len(set(v)) == 1]
    assert identiques, "deux réservoirs Canon partagent au moins le type"
    page_mobile.get_by_role("button", name="N'afficher que les différences").click()
    t2 = _tableau(page_mobile)
    assert set(t2) == set(t) - set(identiques)
    page_mobile.get_by_role("button", name=re.compile("Afficher aussi")).click()
    assert set(_tableau(page_mobile)) == set(t)


def _part_du_trait(page, png: bytes, x: int, couleur: list) -> float:
    """Part des lignes de la capture où un pixel de x-4 à x+2 a la couleur du trait (± 12 par canal).
    Décodée par le navigateur dans une page vierge : la CI n'installe pas Pillow."""
    vierge = page.context.new_page()
    try:
        return vierge.evaluate(
            """async ([b64, x, c]) => {
                 const octets = Uint8Array.from(atob(b64), ch => ch.charCodeAt(0));
                 const img = await createImageBitmap(new Blob([octets], { type: 'image/png' }));
                 const ctx = new OffscreenCanvas(img.width, img.height).getContext('2d');
                 ctx.drawImage(img, 0, 0);
                 const x0 = Math.max(0, x - 4), l = 7, d = ctx.getImageData(x0, 0, l, img.height).data;
                 let n = 0;
                 for (let y = 0; y < img.height; y++)
                   for (let i = 0; i < l; i++) {
                     const k = (y * l + i) * 4;
                     if (Math.abs(d[k] - c[0]) <= 12 && Math.abs(d[k + 1] - c[1]) <= 12 && Math.abs(d[k + 2] - c[2]) <= 12) { n++; break; }
                   }
                 return n / img.height;
               }""",
            [base64.b64encode(png).decode(), x, couleur],
        )
    finally:
        vierge.close()


def test_comparateur_trait_de_la_colonne_collee_reste_au_glisse(page_mobile, base_url):
    # 25/10/2026 : dans un tableau border-collapse, la bordure d'une cellule sticky est peinte par le
    # tableau et part avec lui au défilement. Mesuré en ligne à df1e8dd, 4 modèles à 390 px : trait sur
    # 100 % des lignes avant un glissé de 150 px, 1 % après. Le trait est une ombre intérieure.
    quatre = f"{TANK_SANS_KIT},{TANK_WIFI},{JET_AVEC_KIT},canon-ts3440"
    page_mobile.goto(f"{base_url}/comparer?comparer={quatre}", wait_until="networkidle")
    region = page_mobile.get_by_role("region", name=re.compile("^Comparaison de"))
    region.scroll_into_view_if_needed()
    assert region.evaluate("e => e.scrollWidth - e.clientWidth") > 150, "quatre modèles doivent faire glisser le tableau"
    x, couleur = region.evaluate(
        """z => { const c = z.querySelector('tbody th[scope=row]');
                  const rgb = getComputedStyle(c).borderRightColor.match(/\\d+/g).slice(0, 3).map(Number);
                  return [Math.round((c.getBoundingClientRect().right - z.getBoundingClientRect().left) * devicePixelRatio), rgb]; }"""
    )
    avant = _part_du_trait(page_mobile, region.screenshot(), x, couleur)
    region.evaluate("e => { e.scrollLeft = 150; }")
    page_mobile.wait_for_timeout(300)
    apres = _part_du_trait(page_mobile, region.screenshot(), x, couleur)
    assert avant >= 0.8, f"trait introuvable avant le glissé ({avant:.0%}) : la mesure ne voit pas le bord"
    assert apres >= 0.8 * avant, f"le trait de la colonne collée disparaît au glissé : {avant:.0%} → {apres:.0%}"


def test_comparateur_selection_dans_l_adresse(page_mobile, base_url):
    page_mobile.goto(f"{base_url}/comparer?comparer=inconnu,{TANK_SANS_KIT},{TANK_SANS_KIT}", wait_until="networkidle")
    assert page_mobile.locator("table").count() == 0, "un identifiant inconnu et un doublon ne font pas deux modèles"
    page_mobile.get_by_role("checkbox", name=re.compile("Canon PIXMA G3410")).check()
    page_mobile.wait_for_url(re.compile(r"comparer=canon-g2470,canon-g3410$"))
    assert page_mobile.locator("thead th[scope=col]").count() == 2
    # Quatre au plus : les autres cases se grisent.
    for nom in ("Canon PIXMA MG2545S", "Canon i-SENSYS MF3010"):
        page_mobile.get_by_role("checkbox", name=re.compile(re.escape(nom), re.I)).check()
    assert page_mobile.locator("thead th[scope=col]").count() == 4
    assert page_mobile.locator("input[type=checkbox]:disabled").count() == 11
    # Retirer depuis l'en-tête de colonne.
    page_mobile.get_by_role("button", name=re.compile("Retirer Canon PIXMA G2470")).click()
    page_mobile.wait_for_url(re.compile(r"comparer=canon-g3410,"))
    assert page_mobile.locator("thead th[scope=col]").count() == 3


def test_comparateur_depuis_la_fiche(page_bureau, base_url):
    page_bureau.goto(f"{base_url}/imprimantes/{TANK_SANS_KIT}", wait_until="networkidle")
    page_bureau.get_by_role("link", name=re.compile("Comparer ces \\d modèles")).click()
    page_bureau.wait_for_url(re.compile(r"/comparer\?comparer=canon-g2470,"))
    # La page du comparateur est chargée à la demande : attendre le tableau, pas seulement l'adresse.
    page_bureau.locator("thead th[scope=col]").first.wait_for()
    assert page_bureau.locator("thead th[scope=col]").count() >= 2


# ── Barre d'achat collante ───────────────────────────────────────────────
def test_barre_achat_parait_quand_le_bloc_d_achat_est_passe(page_mobile, base_url):
    cat = _catalogue(base_url)
    page_mobile.goto(f"{base_url}/imprimantes/{JET_AVEC_KIT}", wait_until="networkidle")
    barre = page_mobile.locator("aside.barre-achat")
    assert barre.count() == 1
    assert not barre.is_visible(), "en haut de fiche, le bloc d'achat est à l'écran : pas de barre"

    # Le bloc d'achat juste au-dessus de l'en-tête collant : la barre ne paraît pas encore.
    haut_bloc = page_mobile.evaluate(
        "() => { const b = [...document.querySelectorAll('main button')].find(x => x.textContent.trim() === 'Commander');"
        " return b.closest('.rounded-lg').getBoundingClientRect().bottom + window.scrollY; }"
    )
    page_mobile.evaluate(f"window.scrollTo(0, {haut_bloc} - 120)")
    page_mobile.wait_for_timeout(400)
    assert not barre.is_visible(), "le bloc d'achat est encore à l'écran"
    # Description en haut de l'écran : le bloc d'achat est passé, la barre paraît.
    page_mobile.evaluate("document.getElementById('titre-details').scrollIntoView({block: 'start'})")
    barre.wait_for(state="visible", timeout=3000)
    page_mobile.wait_for_timeout(450)  # fin de la glissade (0,3 s)
    boite = barre.bounding_box()
    assert abs(boite["y"] + boite["height"] - 844) <= 1, "collée au bas de l'écran"
    assert f"dès {_prix_court(cat[JET_AVEC_KIT]['prix_min'])}" in barre.inner_text()
    for cible in barre.locator("a, button").all():
        b = cible.bounding_box()
        assert b["height"] >= 44 and b["width"] >= 44, "cible tactile de 44 px"

    # MOUVEMENT.md R12 : aucun ancêtre ne porte transform, filter ou perspective.
    ancetres = barre.evaluate(
        """e => { const r = []; for (let a = e.parentElement; a; a = a.parentElement) {
             const s = getComputedStyle(a);
             if (s.transform !== 'none' || s.filter !== 'none' || s.perspective !== 'none') r.push(a.tagName); }
           return r; }"""
    )
    assert ancetres == []

    # Même hauteur que la barre Appeler / WhatsApp qu'elle recouvre : la réserve du pied suffit.
    h_pied = page_mobile.evaluate(
        "() => [...document.querySelectorAll('footer .fixed')].map(e => e.getBoundingClientRect().height)[0]"
    )
    assert abs(boite["height"] - h_pied) <= 1

    # Un champ qui prend le focus (clavier du téléphone) : la barre s'efface le temps de la saisie.
    page_mobile.evaluate(
        "() => { const i = document.createElement('input'); i.id = 'essai-saisie';"
        " i.style.cssText = 'position:fixed;top:80px;left:10px'; document.body.appendChild(i); i.focus(); }"
    )
    barre.wait_for(state="hidden", timeout=2000)
    page_mobile.evaluate("() => { const i = document.getElementById('essai-saisie'); i.blur(); i.remove(); }")
    barre.wait_for(state="visible", timeout=2000)

    # Commander ouvre la fenêtre de commande, et la barre s'efface derrière elle.
    barre.get_by_role("button", name="Commander").click()
    page_mobile.get_by_role("dialog").wait_for()
    barre.wait_for(state="hidden", timeout=2000)
    page_mobile.keyboard.press("Escape")
    page_mobile.get_by_role("dialog").wait_for(state="detached")
    barre.wait_for(state="visible", timeout=2000)

    # En bas de page, le dernier lien du pied reste cliquable (rien ne le recouvre).
    page_mobile.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)")
    page_mobile.wait_for_timeout(500)
    lien = page_mobile.locator("footer a", has_text="Conditions")
    b = lien.bounding_box()
    dessus = page_mobile.evaluate(
        "([x, y]) => { const e = document.elementFromPoint(x, y); return e ? (e.closest('a') || e).textContent.trim() : ''; }",
        [b["x"] + b["width"] / 2, b["y"] + b["height"] / 2],
    )
    assert dessus == "Conditions"
    assert page_mobile.erreurs_console == []


def test_barre_achat_jamais_sur_ordinateur(page_bureau, base_url):
    page_bureau.goto(f"{base_url}/imprimantes/{TANK_SANS_KIT}", wait_until="networkidle")
    page_bureau.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)")
    page_bureau.wait_for_timeout(500)
    assert not page_bureau.locator("aside.barre-achat").is_visible()
