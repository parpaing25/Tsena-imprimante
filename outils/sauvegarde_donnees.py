#!/usr/bin/env python3
"""Sauvegarde des donnees du site (demandes clients, mesure d'audience) depuis o2switch.

Le code est dans git ; ce qui n'y est pas, c'est <home>/.tsena-donnees/ sur le serveur
(leads/*.jsonl, evenements/*.jsonl). Ce script les rapatrie par FTP dans
~/.fonenako-releases/tsena/donnees/<date>/ et garde 12 sauvegardes.

    python outils/sauvegarde_donnees.py            # sauvegarde
    python outils/sauvegarde_donnees.py --tester   # verifie la derniere sauvegarde (relecture + comptage)

Identifiants FTP : variables FTP_HOTE / FTP_UTILISATEUR / FTP_MDP, sinon le fichier
~/.deploy-sites/ftp.json ({"hote":..., "utilisateur":..., "mdp":...}) — jamais dans le depot.
A planifier chaque dimanche 6 h. Une sauvegarde n'est bonne que RELUE : --tester chaque mois.
"""
from __future__ import annotations

import argparse
import ftplib
import json
import os
import shutil
import sys
from datetime import datetime
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
DEST = Path.home() / ".fonenako-releases" / "tsena" / "donnees"
DISTANT = ".tsena-donnees"
GARDER = 12


def identifiants() -> tuple[str, str, str]:
    h, u, m = os.environ.get("FTP_HOTE", ""), os.environ.get("FTP_UTILISATEUR", ""), os.environ.get("FTP_MDP", "")
    f = Path.home() / ".deploy-sites" / "ftp.json"
    if not (h and u and m) and f.is_file():
        d = json.loads(f.read_text(encoding="utf-8"))
        h, u, m = d.get("hote", h), d.get("utilisateur", u), d.get("mdp", m)
    if not (h and u and m):
        sys.exit("identifiants FTP absents (FTP_HOTE/FTP_UTILISATEUR/FTP_MDP ou ~/.deploy-sites/ftp.json)")
    return h, u, m


def rapatrier(ftp: ftplib.FTP, distant: str, local: Path) -> int:
    local.mkdir(parents=True, exist_ok=True)
    n = 0
    for nom, infos in ftp.mlsd(distant):
        if nom in (".", ".."):
            continue
        if infos.get("type") == "dir":
            n += rapatrier(ftp, f"{distant}/{nom}", local / nom)
        elif infos.get("type") == "file":
            with open(local / nom, "wb") as f:
                ftp.retrbinary(f"RETR {distant}/{nom}", f.write)
            n += 1
    return n


def sauvegarder() -> int:
    h, u, m = identifiants()
    cible = DEST / datetime.now().strftime("%Y-%m-%d")
    with ftplib.FTP_TLS(h, timeout=60) as ftp:
        ftp.login(u, m)
        ftp.prot_p()
        n = rapatrier(ftp, DISTANT, cible)
    print(f"{n} fichier(s) → {cible}")
    anciennes = sorted(p for p in DEST.iterdir() if p.is_dir())
    for vieille in anciennes[:-GARDER]:
        shutil.rmtree(vieille)
        print("supprimee :", vieille.name)
    return 0 if n else 1


def tester() -> int:
    anciennes = sorted(p for p in DEST.iterdir() if p.is_dir()) if DEST.is_dir() else []
    if not anciennes:
        print("aucune sauvegarde")
        return 1
    derniere = anciennes[-1]
    leads = 0
    fichiers = 0
    for f in derniere.rglob("*.jsonl"):
        fichiers += 1
        for ligne in f.read_text(encoding="utf-8", errors="replace").splitlines():
            try:
                d = json.loads(ligne)
            except ValueError:
                print("ligne illisible dans", f)
                return 1
            if "leads" in f.parts and d.get("id"):
                leads += 1
    print(f"derniere sauvegarde {derniere.name} : {fichiers} fichier(s) JSONL relus, {leads} demande(s) client")
    return 0 if fichiers else 1


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--tester", action="store_true")
    a = ap.parse_args()
    sys.exit(tester() if a.tester else sauvegarder())
