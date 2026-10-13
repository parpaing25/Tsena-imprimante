import { useId } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

/**
 * En-tête commun des pages intérieures : halo animé, fil d'Ariane, titre et sous-titre
 * qui montent à l'arrivée.
 *
 * Audit du 13/10/2026 : aucune page intérieure n'avait d'en-tête travaillé, le fil
 * d'Ariane n'existait que sur la fiche produit, et `prefers-reduced-motion` n'était
 * respecté nulle part. Les classes `entete-*` et la neutralisation des animations
 * vivent dans `src/index.css`.
 *
 * La hauteur est fixée par le padding : rien ne bouge au chargement (pas de décalage
 * de mise en page), seules l'opacité et la translation sont animées.
 */
export interface EnTetePageProps {
  titre: string;
  sousTitre?: string;
  /** Icône lucide déjà instanciée, ex. <LifeBuoy className="h-12 w-12" /> */
  icone?: React.ReactNode;
  /** Fil d'Ariane, sans l'accueil (ajouté d'office). */
  fil?: { libelle: string; lien?: string }[];
  /** Contenu libre sous le sous-titre (boutons, sélecteur de langue…). */
  children?: React.ReactNode;
}

const EnTetePage = ({ titre, sousTitre, icone, fil = [], children }: EnTetePageProps) => {
  const idTitre = useId();
  // Section nommée par son titre = une zone repère : axe signalait le titre hors de toute zone
  // (règle « region », /aide et /tutos, audit en ligne du 13/10/2026).
  return (
  <section aria-labelledby={idTitre} className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent">
    <div
      aria-hidden="true"
      className="entete-halo pointer-events-none absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
    />
    <div className="container relative mx-auto px-4 py-10 sm:py-14">
      <nav aria-label="Fil d'Ariane" className="entete-fil mb-5 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Link to="/" className="inline-flex min-h-[44px] items-center gap-1 rounded px-1 hover:text-primary">
          <Home className="h-4 w-4" aria-hidden="true" />
          Accueil
        </Link>
        {fil.map((etape) => (
          <span key={etape.libelle} className="inline-flex items-center gap-1">
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            {etape.lien ? (
              <Link to={etape.lien} className="inline-flex min-h-[44px] items-center rounded px-1 hover:text-primary">
                {etape.libelle}
              </Link>
            ) : (
              <span className="px-1 text-foreground" aria-current="page">{etape.libelle}</span>
            )}
          </span>
        ))}
      </nav>

      <div className="text-center">
        {icone && <div className="entete-titre mb-4 flex justify-center text-primary">{icone}</div>}
        <h1 id={idTitre} className="entete-titre text-3xl font-bold text-primary sm:text-4xl">{titre}</h1>
        {sousTitre && (
          <p className="entete-sous mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">{sousTitre}</p>
        )}
        {children && <div className="entete-sous mt-5">{children}</div>}
      </div>
    </div>
  </section>
  );
};

export default EnTetePage;
