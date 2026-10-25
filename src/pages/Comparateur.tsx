import { useId, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { MessageCircle, Scale, Share2, X } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EnTetePage from "@/components/EnTetePage";
import { Button } from "@/components/ui/button";
import { products, formatPriceCourt } from "@/data/products";
import { lienWhatsApp } from "@/config/contact";
import { evenement } from "@/lib/mesure";
import {
  PARAM_COMPARER,
  MIN_MODELES,
  MAX_MODELES,
  NON_PRECISE,
  lireSelection,
  modelesDe,
  lienComparaison,
  lignesComparaison,
  ligneIdentique,
  suggestions,
} from "@/lib/comparateur";

const SITE = "https://tsenaimprimante.fonenako.mg";
const SUGGESTIONS = suggestions();

/**
 * Comparateur d'imprimantes, 25/10/2026 (décision d'Andry, composant C n°1).
 *
 * La sélection est lue dans l'adresse à chaque rendu : pas d'état caché, un lien partagé ouvre
 * la même comparaison, et la page pré-rendue (/comparer, sans paramètre) est exactement celle
 * que React affiche au premier rendu. Le tableau : colonnes = modèles (`th scope="col"`),
 * lignes = caractéristiques (`th scope="row"`), première colonne collée au défilement
 * horizontal. Structure de table inspirée de HyperUI (MIT), styles du site.
 */
const Comparateur = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const idTableau = useId();
  const ids = lireSelection(params.get(PARAM_COMPARER));
  const modeles = modelesDe(ids);
  const toutesLesLignes = lignesComparaison(modeles);
  const nbIdentiques = toutesLesLignes.filter(ligneIdentique).length;
  // Faux au premier rendu, comme dans la page pré-rendue : aucun écart entre le HTML statique et React.
  const [differencesSeules, setDifferencesSeules] = useState(false);
  const lignes = differencesSeules ? toutesLesLignes.filter((l) => !ligneIdentique(l)) : toutesLesLignes;
  const assez = modeles.length >= MIN_MODELES;
  const plein = ids.length >= MAX_MODELES;
  const noms = modeles.map((p) => p.name);

  // Remplace l'entrée d'historique : cocher quatre cases ne doit pas coûter quatre « retour ».
  const choisir = (suivants: string[]) => navigate(lienComparaison(suivants), { replace: true });

  // Le lien partagé ouvre la même comparaison. Partage natif au téléphone, sinon copie.
  const partager = async () => {
    const url = `${SITE}${lienComparaison(ids)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `Comparer ${noms.join(", ")}`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("Lien de la comparaison copié");
    } catch (e) {
      // Partage annulé par la personne : rien à dire. Copie refusée : on montre l'adresse.
      if (e instanceof DOMException && e.name === "AbortError") return;
      toast.message("Adresse de la comparaison", { description: url });
    }
  };
  const basculer = (id: string) =>
    choisir(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id].slice(0, MAX_MODELES));

  const titre = assez
    ? `Comparer ${noms.join(", ")} | Tsena Imprimante`
    : "Comparer des imprimantes : prix et caractéristiques | Tsena Imprimante";
  const description =
    "Comparez de 2 à 4 imprimantes Canon, HP et Epson côte à côte : prix en ariary, type, Wi-Fi, recto-verso, formats, volume conseillé.";
  const enumeration = noms.length > 1 ? `${noms.slice(0, -1).join(", ")} et ${noms[noms.length - 1]}` : noms.join("");
  const messageWhatsApp = `Bonjour Tsena Imprimante, j'hésite entre ${enumeration}. Pouvez-vous me conseiller ?`;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{titre}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${SITE}/comparer`} />
        <meta property="og:title" content={titre} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${SITE}/comparer`} />
      </Helmet>
      <Header />
      <main>
        <EnTetePage
          titre="Comparer des imprimantes"
          sousTitre="De 2 à 4 modèles côte à côte, avec les seules données de notre catalogue."
          icone={<Scale className="h-12 w-12" aria-hidden="true" />}
          fil={[{ libelle: "Imprimantes", lien: "/#catalogue" }, { libelle: "Comparer" }]}
        />

        <div className="container mx-auto px-4 py-6 sm:py-10">
          {assez ? (
            <section aria-labelledby={`${idTableau}-titre`}>
              <h2 id={`${idTableau}-titre`} className="text-xl font-bold text-primary sm:text-2xl">
                {modeles.length} modèles comparés
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                <p className="text-[13px] text-muted-foreground sm:text-sm">
                  {nbIdentiques > 0 && !differencesSeules && "Les lignes grisées sont identiques pour tous les modèles choisis."}
                  {modeles.length > 2 && <span className="sm:hidden"> Faites glisser le tableau pour voir chaque colonne.</span>}
                </p>
                {nbIdentiques > 0 && (
                  <button
                    type="button"
                    onClick={() => setDifferencesSeules((v) => !v)}
                    className="inline-flex min-h-[44px] items-center rounded-md px-1 text-[13px] font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-sm"
                  >
                    {!differencesSeules
                      ? "N'afficher que les différences"
                      : nbIdentiques === 1
                        ? "Afficher aussi la ligne identique"
                        : `Afficher aussi les ${nbIdentiques} lignes identiques`}
                  </button>
                )}
              </div>

              <div
                className="mt-3 overflow-x-auto rounded-xl border border-border bg-card shadow-soft sm:mt-5"
                role="region"
                aria-labelledby={`${idTableau}-legende`}
                tabIndex={0}
              >
                <table className="w-full border-collapse text-left text-[13px] sm:text-sm">
                  <caption id={`${idTableau}-legende`} className="sr-only">
                    Comparaison de {noms.join(", ")}
                  </caption>
                  <thead>
                    <tr className="align-top">
                      <td className="sticky left-0 z-10 w-24 min-w-[6rem] border-r border-border bg-card p-2 sm:w-44 sm:p-4" />
                      {modeles.map((p) => (
                        <th key={p.id} scope="col" className="min-w-[7.5rem] p-2 font-normal sm:min-w-[11rem] sm:p-4">
                          <img
                            src={p.imageUrl}
                            alt=""
                            width={160}
                            height={90}
                            loading="lazy"
                            decoding="async"
                            className="aspect-video w-full max-w-[10rem] rounded-md bg-muted object-contain"
                          />
                          <Link
                            to={`/imprimantes/${p.id}`}
                            className="mt-2 block min-h-[44px] py-1 text-[13px] font-bold leading-snug text-foreground hover:text-primary sm:text-base"
                          >
                            {p.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => basculer(p.id)}
                            className="mt-1 inline-flex min-h-[44px] items-center gap-1 rounded-md px-1 text-[12.5px] text-muted-foreground transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label={`Retirer ${p.name} de la comparaison`}
                          >
                            <X className="h-4 w-4" aria-hidden="true" />
                            Retirer
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {lignes.map((l) => {
                      const identique = ligneIdentique(l);
                      return (
                        <tr key={l.titre} className="border-t border-border align-top">
                          <th
                            scope="row"
                            className="sticky left-0 z-10 border-r border-border bg-card p-2 text-[12.5px] font-semibold text-foreground sm:p-4 sm:text-sm"
                          >
                            {l.titre}
                          </th>
                          {l.valeurs.map((v, i) => (
                            <td
                              key={modeles[i].id}
                              className={`p-2 sm:p-4 ${
                                v === null
                                  ? "italic text-muted-foreground"
                                  : identique
                                    ? "text-muted-foreground"
                                    : l.titre === "Prix"
                                      ? "font-bold text-primary"
                                      : "text-foreground"
                              }`}
                            >
                              {v ?? NON_PRECISE}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <Button asChild className="h-11 gap-2 bg-success font-bold text-success-foreground hover:bg-success/90">
                  <a
                    href={lienWhatsApp(messageWhatsApp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => evenement("clic_whatsapp", { ou: "comparateur", produits: ids.join(",") })}
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    Demander conseil sur WhatsApp
                  </a>
                </Button>
                <Button type="button" variant="outline" className="h-11 gap-2" onClick={partager}>
                  <Share2 className="h-4 w-4" aria-hidden="true" />
                  Partager cette comparaison
                </Button>
              </div>
            </section>
          ) : (
            <section aria-labelledby={`${idTableau}-vide`} className="rounded-xl border border-dashed border-border bg-muted/30 p-4 sm:p-6">
              <h2 id={`${idTableau}-vide`} className="text-lg font-bold text-primary sm:text-xl">
                {modeles.length === 1 ? `${modeles[0].name} : choisissez un autre modèle` : "Choisissez au moins deux imprimantes"}
              </h2>
              <p className="mt-1 text-[13px] text-muted-foreground sm:text-sm">
                Le tableau apparaît dès deux modèles cochés ci-dessous. Ou partez d'une comparaison prête :
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <li key={s.libelle}>
                    <Link
                      to={lienComparaison(s.ids)}
                      replace
                      className="inline-flex min-h-[44px] items-center rounded-full border border-border bg-card px-3.5 text-[13px] font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      {s.libelle}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <fieldset className="mt-8">
            <legend className="text-lg font-bold text-primary sm:text-xl">
              {assez ? "Modifier la sélection" : "Les imprimantes du catalogue"}
            </legend>
            <p className="mt-1 text-[13px] text-muted-foreground sm:text-sm" aria-live="polite">
              {ids.length} sur {MAX_MODELES} choisies
              {plein ? " : retirez-en une pour en ajouter une autre." : "."}
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => {
                const coche = ids.includes(p.id);
                return (
                  <label
                    key={p.id}
                    className={`flex min-h-[48px] cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition-colors ${
                      coche ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/60"
                    } ${plein && !coche ? "cursor-not-allowed opacity-60" : ""}`}
                  >
                    <input
                      type="checkbox"
                      className="h-5 w-5 shrink-0 accent-primary"
                      checked={coche}
                      disabled={plein && !coche}
                      onChange={() => basculer(p.id)}
                    />
                    <span className="min-w-0 flex-1 text-[13.5px] font-semibold leading-snug text-foreground">{p.name}</span>
                    <span className="shrink-0 text-[12.5px] font-bold text-primary">{formatPriceCourt(p.priceMin)}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Comparateur;
