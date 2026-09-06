#!/usr/bin/env python3
"""Verifie le site en ligne apres un deploiement, et chaque nuit.

    python outils/verifier_site.py            # rapport, code 0 si tout va bien
    python outils/verifier_site.py --alerte   # + message Telegram si un controle echoue
    python outils/verifier_site.py --url https://autre.exemple

Ce qui est controle (chaque ligne est un constat de l'audit du 06/09/2026) :
  - la racine repond 200 en HTML, avec UN bundle /assets/index-*.js servi en JavaScript
    (o2switch rend 200 text/html pour un fichier absent : le type MIME est la seule preuve) ;
  - les routes pre-rendues repondent 200 avec leur propre <h1> et UNE canonical ;
  - /faq/ redirige vers /faq ; www. redirige vers le domaine nu ;
  - une URL inconnue repond 404 (plus de « soft 404 ») ;
  - sitemap.xml, robots.txt, products.json, llms.txt existent et sont coherents ;
  - les en-tetes de securite et de cache sont presents ;
  - le certificat TLS est valide plus de 14 jours ;
  - TTFB de la racine < 1,5 s (alerte, pas echec).
Jeton Telegram : variables TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID, sinon ~/.hermes/profiles/imprimante/.env.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import socket
import ssl
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

UA = "Mozilla/5.0 (Linux; Android 13; SM-A135F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
ROUTES = {
    "/": "Tongasoa",
    "/faq": "Questions",
    "/aide": "Aide",
    "/conseils": "Conseils",
    "/blog": "Blog",
    "/blog/1": "EcoTank",
    "/imprimantes/canon-g2470": "Canon PIXMA G2470",
    "/imprimantes/epson-l3260": "Epson EcoTank L3260",
    "/privacy": "Confidentialit",
    "/terms": "Conditions",
    "/mentions-legales": "Mentions",
}
ENTETES_SECURITE = ["strict-transport-security", "content-security-policy", "x-content-type-options", "referrer-policy", "permissions-policy", "x-frame-options"]

constats: list[tuple[str, str, str]] = []  # (niveau, controle, detail)


def note(niveau: str, controle: str, detail: str = "") -> None:
    constats.append((niveau, controle, detail))
    icone = {"ok": "✓", "alerte": "⚠", "echec": "✗"}[niveau]
    print(f"{icone} {controle}{(' — ' + detail) if detail else ''}")


def requete(url: str, suivre: bool = True, methode: str = "GET"):
    class SansRedirection(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, *a, **k):
            return None

    ouvreur = urllib.request.build_opener() if suivre else urllib.request.build_opener(SansRedirection)
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Encoding": "identity"}, method=methode)
    t0 = time.time()
    try:
        with ouvreur.open(req, timeout=30) as r:
            corps = r.read()
            return r.status, {k.lower(): v for k, v in r.headers.items()}, corps, time.time() - t0
    except urllib.error.HTTPError as e:
        return e.code, {k.lower(): v for k, v in e.headers.items()}, e.read(), time.time() - t0
    except Exception as e:  # reseau, TLS
        return 0, {"erreur": str(e)}, b"", time.time() - t0


def verifier(base: str) -> None:
    hote = urllib.parse.urlparse(base).hostname or ""

    # Racine + bundle
    code, h, corps, dt = requete(base + "/")
    if code != 200 or "text/html" not in h.get("content-type", ""):
        note("echec", "racine", f"HTTP {code} {h.get('content-type', h.get('erreur', ''))}")
        return
    note("ok", "racine 200 HTML", f"TTFB+corps {dt:.2f}s")
    if dt > 1.5:
        note("alerte", "racine lente", f"{dt:.2f}s (> 1,5 s)")
    texte = corps.decode("utf-8", "replace")
    m = re.search(r'src="(/assets/index-[A-Za-z0-9_-]+\.js)"', texte)
    if not m:
        note("echec", "bundle reference", "aucun src=\"/assets/index-*.js\" (chemins relatifs ?)")
    else:
        code, hj, _, _ = requete(base + m.group(1))
        if code == 200 and "javascript" in hj.get("content-type", ""):
            note("ok", "bundle en ligne", m.group(1))
        else:
            note("echec", "bundle en ligne", f"{m.group(1)} → HTTP {code} {hj.get('content-type', '')}")
        cc = hj.get("cache-control", "")
        note("ok" if "immutable" in cc else "alerte", "cache des bundles", cc or "absent")
    if texte.count('rel="canonical"') != 1:
        note("echec", "canonical accueil", f"{texte.count('rel=\"canonical\"')} balises")
    if '"@type": ["LocalBusiness"' not in texte and '"LocalBusiness"' not in texte:
        note("alerte", "JSON-LD LocalBusiness", "absent de l'accueil")

    # En-tetes de securite
    manquants = [e for e in ENTETES_SECURITE if e not in h]
    note("ok" if not manquants else "echec", "en-tetes de securite", "tous presents" if not manquants else "manquants : " + ", ".join(manquants))

    # Routes pre-rendues
    for chemin, attendu in ROUTES.items():
        if chemin == "/":
            continue
        code, hr, corps, _ = requete(base + chemin)
        t = corps.decode("utf-8", "replace")
        h1 = re.findall(r"<h1[^>]*>(.*?)</h1>", t, re.S)
        h1txt = re.sub(r"<[^>]+>", "", h1[0]) if h1 else ""
        if code == 200 and attendu.lower() in h1txt.lower() and len(h1) == 1 and t.count('rel="canonical"') == 1:
            note("ok", f"route {chemin}", h1txt.strip()[:40])
        else:
            note("echec", f"route {chemin}", f"HTTP {code}, h1={h1txt.strip()[:40]!r} (x{len(h1)}), canonical x{t.count('rel=\"canonical\"')}")

    # Redirections
    code, hr, _, _ = requete(base + "/faq/", suivre=False)
    note("ok" if code in (301, 308) and hr.get("location", "").rstrip("/").endswith("/faq") else "echec", "/faq/ → /faq", f"HTTP {code} → {hr.get('location', '')}")
    if hote and not hote.startswith("www."):
        code, hr, _, _ = requete(base.replace("://", "://www."), suivre=False)
        note("ok" if code in (301, 308) else "alerte", "www → domaine nu", f"HTTP {code} → {hr.get('location', '')}")
    code, hr, _, _ = requete(base.replace("https://", "http://") + "/", suivre=False)
    note("ok" if code in (301, 308) and hr.get("location", "").startswith("https://") else "echec", "http → https", f"HTTP {code}")

    # 404 reel
    code, _, corps, _ = requete(base + "/verification-page-inexistante-" + str(int(time.time())))
    note("ok" if code == 404 else "echec", "URL inconnue → 404", f"HTTP {code}" + (" (soft 404 : la page d'accueil est servie)" if code == 200 else ""))
    code, hj, _, _ = requete(base + "/assets/fichier-absent.js")
    note("ok" if code == 404 else "echec", "asset absent → 404", f"HTTP {code} {hj.get('content-type', '')}")

    # Decouvrabilite
    code, _, corps, _ = requete(base + "/sitemap.xml")
    urls = re.findall(rb"<loc>([^<]+)</loc>", corps)
    note("ok" if code == 200 and len(urls) >= 25 else "echec", "sitemap.xml", f"HTTP {code}, {len(urls)} URL")
    code, _, corps, _ = requete(base + "/robots.txt")
    note("ok" if code == 200 and b"sitemap.xml" in corps else "echec", "robots.txt", f"HTTP {code}")
    code, hp, corps, _ = requete(base + "/products.json")
    try:
        d = json.loads(corps)
        n = d.get("nombre_produits", 0)
        note("ok" if code == 200 and n >= 12 and n == len(d.get("produits", [])) else "echec", "products.json", f"{n} produits, genere le {d.get('genere_le', '?')[:10]}")
    except ValueError:
        note("echec", "products.json", f"HTTP {code}, pas du JSON ({hp.get('content-type', '')})")
    code, _, corps, _ = requete(base + "/llms.txt")
    note("ok" if code == 200 and b"Tsena Imprimante" in corps else "echec", "llms.txt", f"HTTP {code}")
    code, _, corps, _ = requete(base + "/404.html")
    note("ok" if code in (200, 404) and "Cette page n'existe pas".encode() in corps else "echec", "404.html", f"HTTP {code}")

    # API
    code, ha, corps, _ = requete(base + "/api/lead.php")
    note("ok" if code == 405 and "json" in ha.get("content-type", "") else "echec", "api/lead.php (GET → 405 JSON)", f"HTTP {code} {ha.get('content-type', '')}")

    # Certificat
    try:
        ctx = ssl.create_default_context()
        with ctx.wrap_socket(socket.create_connection((hote, 443), timeout=15), server_hostname=hote) as s:
            cert = s.getpeercert()
        fin = datetime.strptime(cert["notAfter"], "%b %d %H:%M:%S %Y %Z").replace(tzinfo=timezone.utc)
        jours = (fin - datetime.now(timezone.utc)).days
        note("ok" if jours > 14 else "echec", "certificat TLS", f"expire dans {jours} jours ({fin:%d/%m/%Y})")
    except Exception as e:
        note("alerte", "certificat TLS", f"non verifie : {e}")


def jeton_telegram() -> tuple[str, str]:
    tok, chat = os.environ.get("TELEGRAM_BOT_TOKEN", ""), os.environ.get("TELEGRAM_CHAT_ID", "")
    env = Path.home() / ".hermes" / "profiles" / "imprimante" / ".env"
    if (not tok or not chat) and env.is_file():
        for ligne in env.read_text(encoding="utf-8", errors="replace").splitlines():
            if ligne.startswith("TELEGRAM_BOT_TOKEN=") and not tok:
                tok = ligne.split("=", 1)[1].strip().strip('"')
            if ligne.startswith("TELEGRAM_ALLOWED_USERS=") and not chat:
                chat = ligne.split("=", 1)[1].strip().strip('"').split(",")[0]
    return tok, chat


def alerter(texte: str) -> None:
    tok, chat = jeton_telegram()
    if not tok or not chat:
        print("(pas de jeton Telegram : alerte non envoyee)")
        return
    data = urllib.parse.urlencode({"chat_id": chat, "text": texte[:3900], "disable_web_page_preview": "true"}).encode()
    try:
        urllib.request.urlopen(urllib.request.Request(f"https://api.telegram.org/bot{tok}/sendMessage", data=data), timeout=15)
        print("alerte Telegram envoyee")
    except Exception as e:
        print("alerte Telegram impossible :", e)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", default="https://tsenaimprimante.fonenako.mg")
    ap.add_argument("--alerte", action="store_true", help="message Telegram si un controle echoue")
    args = ap.parse_args()
    base = args.url.rstrip("/")
    print(f"Verification de {base} — {datetime.now():%d/%m/%Y %H:%M}")
    verifier(base)
    echecs = [c for c in constats if c[0] == "echec"]
    alertes = [c for c in constats if c[0] == "alerte"]
    print(f"\n{len(constats) - len(echecs) - len(alertes)} ok · {len(alertes)} alerte(s) · {len(echecs)} echec(s)")
    if echecs and args.alerte:
        alerter("⚠️ Tsena Imprimante — " + f"{len(echecs)} controle(s) en echec sur {base}\n" + "\n".join(f"✗ {c} — {d}" for _, c, d in echecs))
    return 1 if echecs else 0


if __name__ == "__main__":
    sys.exit(main())
