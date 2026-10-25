"""Mouvement (MOUVEMENT.md, 25/10/2026) : rien ne reste caché, et « réduire les animations » est respecté.

Recette G de la recherche B (B-motion.md §7), adaptée : sous `reduced_motion="reduce"`, aucune
animation JavaScript (Web Animations, AutoAnimate) ne tourne, et après un défilement complet aucun
élément de contenu ne reste à opacité 0. Sans JavaScript, la section Contact (autrefois figée à
opacité 0 dans le HTML pré-rendu) est lisible.
"""
import pytest

from conftest import UA

# Éléments décoratifs qui PEUVENT être à opacité 0 : calques de survol des liens du menu,
# diapositives du héros qui ne sont pas à l'écran (aria-hidden).
CONTENU_A_OPACITE_ZERO = """() => [...document.querySelectorAll('main *')]
  .filter(e => !e.closest('[aria-hidden="true"]'))
  .filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; })
  .filter(e => getComputedStyle(e).opacity === '0')
  .map(e => e.tagName + '.' + String(e.className).slice(0, 60))"""

ANIMATIONS_JS = """() => document.getAnimations()
  .filter(a => !(a instanceof CSSAnimation) && !(a instanceof CSSTransition))
  .map(a => (a.effect && a.effect.target ? a.effect.target.tagName : '?') + ' ' + a.playState)"""

DEFILER_TOUT = """async () => {
  for (let y = 0; y <= document.documentElement.scrollHeight; y += 300) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 40));
  }
}"""


@pytest.fixture
def page_reduite(navigateur):
    ctx = navigateur.new_context(user_agent=UA, viewport={"width": 390, "height": 844}, is_mobile=True,
                                 has_touch=True, locale="fr-FR", reduced_motion="reduce")
    page = ctx.new_page()
    yield page
    ctx.close()


@pytest.fixture
def page_sans_js(navigateur):
    ctx = navigateur.new_context(user_agent=UA, viewport={"width": 390, "height": 844}, locale="fr-FR",
                                 java_script_enabled=False)
    page = ctx.new_page()
    yield page
    ctx.close()


def test_mouvement_reduit_aucune_animation_js_et_rien_de_cache(page_reduite, base_url):
    page_reduite.goto(base_url + "/", wait_until="load")
    page_reduite.wait_for_timeout(150)
    assert page_reduite.evaluate(ANIMATIONS_JS) == []

    # Filtrer la grille : AutoAnimate lit la préférence à l'initialisation et ne doit rien animer.
    page_reduite.get_by_role("button", name="Laser", exact=True).click()
    page_reduite.wait_for_timeout(30)
    assert page_reduite.evaluate(ANIMATIONS_JS) == [], "AutoAnimate anime malgré « réduire les animations »"
    page_reduite.get_by_role("button", name="Toutes", exact=True).click()

    page_reduite.evaluate(DEFILER_TOUT)
    page_reduite.wait_for_timeout(300)
    assert page_reduite.evaluate(ANIMATIONS_JS) == []
    assert page_reduite.evaluate(CONTENU_A_OPACITE_ZERO) == []
    assert page_reduite.locator("[data-apparition]").count() == 0, "aucun bloc mis en attente sous « réduire »"


def test_mouvement_normal_rien_ne_reste_cache_apres_defilement(page_mobile, base_url):
    page_mobile.goto(base_url + "/", wait_until="networkidle")
    page_mobile.evaluate(DEFILER_TOUT)
    page_mobile.wait_for_timeout(1200)  # apparition 0,5 s + cascade 4 x 60 ms
    assert page_mobile.evaluate(CONTENU_A_OPACITE_ZERO) == []
    # Fin d'apparition : l'état est retiré (recette B bis), plus aucun bloc en attente.
    assert page_mobile.locator('[data-apparition="attente"]').count() == 0
    # Aucun transform résiduel sur les blocs apparus (MOUVEMENT.md R12, R17).
    assert page_mobile.evaluate(
        "() => [...document.querySelectorAll('#contact *')].filter(e => getComputedStyle(e).transform !== 'none').length"
    ) == 0


def test_sans_javascript_la_section_contact_est_lisible(page_sans_js, base_url):
    page_sans_js.goto(base_url + "/", wait_until="load")
    contact = page_sans_js.locator("#contact")
    contact.scroll_into_view_if_needed()
    assert contact.locator("h2").is_visible()
    assert page_sans_js.evaluate(CONTENU_A_OPACITE_ZERO) == []
