"""Banc bout en bout du site Tsena Imprimante (pytest + Playwright).

Deux cibles :
  - par defaut, dist/ servi localement avec les MEMES regles que .htaccess
    (/faq -> faq/index.html, inconnu -> 404.html en 404, /api/* -> faux serveur) ;
  - `--base-url https://tsenaimprimante.fonenako.mg` pour la production. Dans ce
    cas les formulaires remplissent le champ piege (site_web) : le serveur repond
    « ok » sans rien enregistrer, aucune fausse demande n'atteint Andry.

Agent utilisateur realiste obligatoire : o2switch renvoie une page de blocage
(HTTP 429, « tiger ») a un Chromium headless nu.
"""
from __future__ import annotations

import http.server
import json
import os
import socketserver
import sys
import threading
from pathlib import Path

import pytest

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

RACINE = Path(__file__).resolve().parents[2]
DIST = RACINE / "dist"
UA = "Mozilla/5.0 (Linux; Android 13; SM-A135F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"


def pytest_addoption(parser):
    parser.addoption("--base-url", action="store", default="", help="URL du site a tester (vide = dist/ local)")


class _Serveur(http.server.SimpleHTTPRequestHandler):
    """Reproduit .htaccess : pre-rendu par dossier, 404 reel, API simulee."""

    def __init__(self, *a, **kw):
        super().__init__(*a, directory=str(DIST), **kw)

    def log_message(self, *a):  # silence
        pass

    def do_POST(self):
        n = int(self.headers.get("Content-Length") or 0)
        corps = self.rfile.read(n) if n else b""
        if self.path.startswith("/api/lead.php"):
            try:
                d = json.loads(corps or b"{}")
            except ValueError:
                d = {}
            ok = bool(d.get("nom")) and d.get("type") in ("contact", "commande", "devis")
            rep = json.dumps({"ok": ok, "id": "TS-TEST-0001"} if ok else {"ok": False, "erreur": "invalide"}).encode()
            self.send_response(200 if ok else 400)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(rep)))
            self.end_headers()
            self.wfile.write(rep)
            return
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        chemin = self.path.split("?")[0]
        if chemin != "/" and chemin.endswith("/"):
            self.send_response(301)
            self.send_header("Location", chemin.rstrip("/"))
            self.end_headers()
            return
        cible = DIST / chemin.lstrip("/")
        if chemin == "/":
            return super().do_GET()
        if cible.is_dir() and (cible / "index.html").is_file():
            self.path = chemin + "/index.html"
            return super().do_GET()
        if cible.is_file():
            return super().do_GET()
        page = (DIST / "404.html").read_bytes() if (DIST / "404.html").is_file() else b"404"
        self.send_response(404)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(page)))
        self.end_headers()
        self.wfile.write(page)


@pytest.fixture(scope="session")
def base_url(request):
    url = request.config.getoption("--base-url").rstrip("/")
    if url:
        yield url
        return
    if not (DIST / "index.html").is_file():
        pytest.exit("dist/ absent : lancer `npm run build` d'abord, ou passer --base-url", returncode=2)
    socketserver.TCPServer.allow_reuse_address = True
    srv = socketserver.ThreadingTCPServer(("127.0.0.1", 0), _Serveur)
    port = srv.server_address[1]
    th = threading.Thread(target=srv.serve_forever, daemon=True)
    th.start()
    yield f"http://127.0.0.1:{port}"
    srv.shutdown()


@pytest.fixture(scope="session")
def en_prod(base_url):
    return base_url.startswith("https://")


@pytest.fixture(scope="session")
def navigateur():
    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        yield b
        b.close()


@pytest.fixture
def page_mobile(navigateur):
    ctx = navigateur.new_context(user_agent=UA, viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True, has_touch=True, locale="fr-FR", accept_downloads=True)
    page = ctx.new_page()
    page.erreurs_console = []
    page.on("console", lambda m: page.erreurs_console.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: page.erreurs_console.append(str(e)))
    yield page
    ctx.close()


@pytest.fixture
def page_bureau(navigateur):
    ctx = navigateur.new_context(user_agent=UA.replace("Mobile ", "").replace("Linux; Android 13; SM-A135F", "Windows NT 10.0; Win64; x64"), viewport={"width": 1280, "height": 800}, locale="fr-FR")
    page = ctx.new_page()
    page.erreurs_console = []
    page.on("console", lambda m: page.erreurs_console.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: page.erreurs_console.append(str(e)))
    yield page
    ctx.close()


def remplir_piege(page):
    """En production : rendre la demande inoffensive (le serveur la jette et repond ok)."""
    page.evaluate("() => { for (const i of document.querySelectorAll('input[name=site_web]')) { i.value = 'test-automatique'; i.dispatchEvent(new Event('input', {bubbles: true})); } }")


os.environ.setdefault("PYTHONIOENCODING", "utf-8")
