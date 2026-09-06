#!/usr/bin/env python3
"""Rapport hebdomadaire du site Tsena Imprimante : audience, conversions, erreurs, demandes.

    python outils/rapport_hebdo.py              # affiche + ecrit rapports/site-AAAA-Sxx.md
    python outils/rapport_hebdo.py --telegram   # + envoie sur Telegram
    python outils/rapport_hebdo.py --jours 30

Source : https://tsenaimprimante.fonenako.mg/api/rapport.php (agregats sans donnee personnelle).
Cle : variable TSENA_CLE_RAPPORT, sinon ~/.tsena-secrets/cle_rapport.txt (la meme que
`cle_rapport` dans config.php sur le serveur).
A planifier le samedi 7 h avec le rapport Fonenako (Planificateur de taches Windows ou cron du VPS).
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.path.insert(0, str(Path(__file__).resolve().parent))
from verifier_site import UA, alerter  # noqa: E402

SITE = "https://tsenaimprimante.fonenako.mg"


def cle() -> str:
    c = os.environ.get("TSENA_CLE_RAPPORT", "")
    f = Path.home() / ".tsena-secrets" / "cle_rapport.txt"
    if not c and f.is_file():
        c = f.read_text(encoding="utf-8").strip()
    if not c:
        sys.exit("cle du rapport absente : TSENA_CLE_RAPPORT ou ~/.tsena-secrets/cle_rapport.txt")
    return c


def lire(jours: int) -> dict:
    url = f"{SITE}/api/rapport.php?" + urllib.parse.urlencode({"cle": cle(), "jours": jours})
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read())


def top(d: dict, n: int = 8) -> str:
    return "\n".join(f"  {v:5d}  {k}" for k, v in list(d.items())[:n]) or "  (rien)"


def rediger(d: dict, jours: int) -> str:
    vu = d.get("pages_vues", 0)
    uniques = sum(d.get("visiteurs_uniques_par_jour", {}).values())
    ev = d.get("evenements", {})
    dem = d.get("demandes", {})
    contacts = sum(ev.get(k, 0) for k in ("clic_appel", "clic_whatsapp", "clic_messenger"))
    taux = (dem.get("total", 0) + contacts) / vu * 100 if vu else 0
    app = d.get("appareils", {})
    mobile = app.get("mobile", 0) / max(1, sum(app.values())) * 100
    lignes = [
        f"📊 Tsena Imprimante — site, {jours} derniers jours ({datetime.now():%d/%m/%Y})",
        "",
        f"Pages vues : {vu}   Visiteurs (uniques/jour cumulés) : {uniques}   Mobile : {mobile:.0f} %",
        f"Demandes enregistrées : {dem.get('total', 0)}  ({', '.join(f'{k} {v}' for k, v in dem.get('par_type', {}).items()) or 'aucune'})",
        f"Prises de contact directes : appel {ev.get('clic_appel', 0)} · WhatsApp {ev.get('clic_whatsapp', 0)} · Messenger {ev.get('clic_messenger', 0)}",
        f"Devis PDF générés : {ev.get('devis_pdf', 0)}   Taux de contact : {taux:.1f} % des pages vues",
        "",
        "Pages les plus vues :",
        top(d.get("pages", {})),
        "",
        "D'où viennent les visiteurs :",
        top(d.get("provenances", {})),
    ]
    if ev.get("formulaire_erreur"):
        lignes += ["", f"⚠ Formulaires en erreur : {ev['formulaire_erreur']} (voir api/lead.php, config.php)"]
    if d.get("erreurs"):
        lignes += ["", "Erreurs JavaScript vues par les visiteurs :", top(d["erreurs"], 5)]
    lignes += ["", "Ce que la mesure ne dit PAS : les appels reçus hors site, les ventes conclues (à rapprocher du carnet de commandes), les visiteurs avec Do Not Track."]
    return "\n".join(lignes)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--jours", type=int, default=7)
    ap.add_argument("--telegram", action="store_true")
    args = ap.parse_args()
    d = lire(args.jours)
    if not d.get("ok"):
        sys.exit(f"rapport refuse : {d}")
    texte = rediger(d, args.jours)
    print(texte)
    dossier = Path(__file__).resolve().parents[1] / "rapports"
    dossier.mkdir(exist_ok=True)
    nom = dossier / f"site-{datetime.now():%Y-S%W}.md"
    nom.write_text(texte + "\n\n```json\n" + json.dumps(d, ensure_ascii=False, indent=1) + "\n```\n", encoding="utf-8")
    print(f"\n→ {nom}")
    if args.telegram:
        alerter(texte)
    return 0


if __name__ == "__main__":
    sys.exit(main())
