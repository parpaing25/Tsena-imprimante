/**
 * Apparition au défilement : UN seul IntersectionObserver pour toute la page (MOUVEMENT.md R7),
 * une animation CSS à remplissage `backwards` (R17), un rang calculé sur le lot qui entre ensemble.
 *
 * 25/10/2026 : `AnimatedSection` posait `opacity-0` par une classe React tant que l'élément
 * n'avait pas été vu. Le pré-rendu capture le DOM : la section Contact entière (6 blocs) était
 * figée à opacité 0 dans `dist/index.html`, invisible sans JavaScript et pour un robot qui ne
 * l'exécute pas.
 *
 * Ici l'état caché n'existe que si TROIS conditions sont réunies (R6) :
 *  - le JavaScript tourne (la classe `apparitions` de <html> est posée par ce module, et le
 *    pré-rendu ne capture que #root : le HTML statique ne la porte jamais) ;
 *  - IntersectionObserver existe et le visiteur n'a pas demandé moins d'animation ;
 *  - l'élément est SOUS l'écran au montage (rien n'apparaît au-dessus de la ligne de flottaison, R3).
 * L'état d'attente vit dans un attribut `data-apparition` que React ne gère pas : un nouveau rendu
 * ne peut pas l'écraser.
 */

const ATTENTE = "attente";
const ENTRE = "entre";

let observateur: IntersectionObserver | null = null;
let ecouteFin = false;

const moinsDAnimation = () =>
  typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function lObservateur(): IntersectionObserver {
  if (!observateur) {
    observateur = new IntersectionObserver(
      (entrees) => {
        // Rang dans le lot qui entre ENSEMBLE, plafonné à 4 (R9 : 60 ms par rang, 240 ms au plus).
        // Un élément qui entre seul après un défilement reçoit le rang 0 : il n'attend jamais.
        let rang = 0;
        for (const entree of entrees) {
          if (!entree.isIntersecting) continue;
          const el = entree.target as HTMLElement;
          el.style.setProperty("--rang", String(Math.min(rang++, 4)));
          el.dataset.apparition = ENTRE;
          observateur?.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    );
  }
  return observateur;
}

/**
 * Recette B bis : une animation CSS rejoue quand un ancêtre repasse de `display: none` à visible.
 * Un seul écouteur pour toute la page retire l'état une fois l'apparition finie.
 */
function ecouterLesFins() {
  if (ecouteFin) return;
  ecouteFin = true;
  document.addEventListener("animationend", (ev) => {
    const el = ev.target as HTMLElement | null;
    if (ev.animationName === "apparait" && el?.dataset?.apparition === ENTRE) {
      delete el.dataset.apparition;
      el.style.removeProperty("--rang");
    }
  });
}

/**
 * Inscrit un élément. À appeler dans un `useLayoutEffect` (avant la première peinture).
 * Rend la fonction de désinscription.
 */
export function apparaitre(el: HTMLElement): () => void {
  if (typeof IntersectionObserver === "undefined" || moinsDAnimation()) return () => {};
  // Déjà dans l'écran (ou au-dessus) : il reste tel quel. Un élément masqué (display: none)
  // a un rectangle nul, donc top = 0 : il reste lui aussi visible, sans animation.
  if (el.getBoundingClientRect().top < window.innerHeight) return () => {};
  document.documentElement.classList.add("apparitions");
  ecouterLesFins();
  el.dataset.apparition = ATTENTE;
  const obs = lObservateur();
  obs.observe(el);
  return () => {
    obs.unobserve(el);
    if (el.dataset.apparition === ATTENTE) delete el.dataset.apparition;
  };
}
