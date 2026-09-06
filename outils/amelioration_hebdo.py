#!/usr/bin/env python3
"""Agent d'amelioration hebdomadaire : rassemble les faits de la semaine et demande a
Claude Code une liste de propositions classees, avec les correctifs simples en patch.

    python outils/amelioration_hebdo.py           # ecrit rapports/amelioration-<date>.md
    python outils/amelioration_hebdo.py --claude  # + lance `claude -p` sur le dossier du site

Ce que l'agent recoit (jamais de donnee personnelle) :
  1. le rapport d'audience/conversions (api/rapport.php),
  2. le resultat de verifier_site.py (statuts, en-tetes, 404, hash),
  3. npm audit (dependances vulnerables),
  4. les 20 derniers commits,
  5. les positions Search Console si un export CSV est depose dans rapports/gsc-*.csv.
Ce qu'il doit rendre : 5 a 10 propositions « impact / effort / action precise », et pour
les correctifs de texte, d'alt, de meta ou de dependance, un patch pret a relire. Rien
n'est applique sans relecture d'Andry : l'agent ecrit, un humain valide.
A planifier le lundi 6 h 30 (apres le rapport du samedi).
"""
from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
RACINE = Path(__file__).resolve().parents[1]
RAPPORTS = RACINE / "rapports"
sys.path.insert(0, str(Path(__file__).resolve().parent))


def commande(args: list[str], cwd: Path = RACINE, delai: int = 300) -> str:
    try:
        r = subprocess.run(args, cwd=str(cwd), capture_output=True, text=True, timeout=delai, encoding="utf-8", errors="replace", shell=(sys.platform == "win32"))
        return (r.stdout or "") + (r.stderr or "")
    except Exception as e:
        return f"(indisponible : {e})"


def rassembler() -> str:
    parties = [f"# Semaine du {datetime.now():%d/%m/%Y} — faits pour l'amélioration du site Tsena Imprimante\n"]
    try:
        from rapport_hebdo import lire, rediger
        d = lire(7)
        parties.append("## 1. Audience et conversions (7 jours)\n```\n" + rediger(d, 7) + "\n```\n")
    except SystemExit as e:
        parties.append(f"## 1. Audience\n(non disponible : {e})\n")
    except Exception as e:
        parties.append(f"## 1. Audience\n(erreur : {e})\n")
    parties.append("## 2. Vérification du site en ligne\n```\n" + commande([sys.executable, "outils/verifier_site.py"]) + "\n```\n")
    audit = commande(["npm", "audit", "--json"])
    try:
        meta = json.loads(audit).get("metadata", {}).get("vulnerabilities", {})
        parties.append(f"## 3. Dépendances\n{meta}\n")
    except ValueError:
        parties.append("## 3. Dépendances\n```\n" + audit[:2000] + "\n```\n")
    parties.append("## 4. Derniers commits\n```\n" + commande(["git", "log", "--oneline", "-20"]) + "\n```\n")
    gsc = sorted(RAPPORTS.glob("gsc-*.csv")) if RAPPORTS.is_dir() else []
    if gsc:
        parties.append(f"## 5. Search Console (export {gsc[-1].name})\n```\n" + gsc[-1].read_text(encoding="utf-8", errors="replace")[:4000] + "\n```\n")
    else:
        parties.append("## 5. Search Console\n(pas d'export : déposer rapports/gsc-AAAA-MM-JJ.csv depuis Performance → Exporter)\n")
    return "\n".join(parties)


PROMPT = """Tu es l'agent d'amélioration continue du site tsenaimprimante.fonenako.mg (Vite/React, catalogue dans src/data/products.ts, textes dans src/pages).
Lis le fichier {fichier} : audience, conversions, vérifications, dépendances, commits, positions.
Rends, en français, dans rapports/propositions-{date}.md :
1. Un tableau de 5 à 10 propositions classées par impact/effort : constat (chiffre + source), action précise (fichier), effort en heures, gain attendu.
2. Pour chaque correctif SIMPLE (texte, alt, meta, dépendance mineure, lien cassé), le diff prêt à relire — sans l'appliquer.
3. Une ligne « À demander à Andry » pour ce qui engage un prix, une promesse commerciale ou un numéro.
Règles : ne pas inventer de chiffre ; ce que la mesure ne dit pas se dit « non mesuré » ; ne jamais toucher aux prix sans la bible du bot (../bot-imprimante/bible/bible-imprimante.json)."""


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--claude", action="store_true", help="lancer Claude Code sur le dossier de faits")
    a = ap.parse_args()
    RAPPORTS.mkdir(exist_ok=True)
    date = datetime.now().strftime("%Y-%m-%d")
    fichier = RAPPORTS / f"amelioration-{date}.md"
    fichier.write_text(rassembler(), encoding="utf-8")
    print("faits →", fichier)
    if a.claude:
        if not shutil.which("claude"):
            print("claude introuvable dans le PATH : ouvrir Claude Code et coller le prompt ci-dessous")
            print(PROMPT.format(fichier=fichier.relative_to(RACINE), date=date))
            return 1
        print(commande(["claude", "-p", PROMPT.format(fichier=fichier.relative_to(RACINE), date=date), "--allowedTools", "Read,Grep,Glob,Write"], delai=900)[-3000:])
    else:
        print("\nPrompt pour Claude Code :\n" + PROMPT.format(fichier=fichier.relative_to(RACINE), date=date))
    return 0


if __name__ == "__main__":
    sys.exit(main())
