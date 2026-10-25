import { useEffect, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { MessageCircle, Phone, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface BarreAchatProps {
  /** Bloc d'achat de la fiche : la barre paraît quand il est passé AU-DESSUS de l'écran. */
  cible: RefObject<HTMLElement>;
  nom: string;
  /** Prix déjà mis en forme (« 860.000 Ar », « dès 340.000 Ar »). */
  prix: string;
  lienWhatsApp: string;
  telephone: string;
  commandeDisponible: boolean;
  /** Vrai quand une fenêtre est ouverte (commande, photo) : la barre s'efface. */
  masquee?: boolean;
  onCommander: () => void;
  onAppeler: () => void;
  onWhatsApp?: () => void;
}

/**
 * Barre d'achat collante de la fiche produit, au téléphone (25/10/2026, décision d'Andry,
 * composant C n°2).
 *
 * - Elle prend EXACTEMENT la place de la barre « Appeler / WhatsApp » du pied de page (même
 *   hauteur, mêmes marges, zone de sécurité comprise) et la recouvre : la réserve de bas de page
 *   déjà posée par Footer.tsx suffit, rien de plus n'est masqué. Elle garde les deux conversions
 *   de cette barre (appel, WhatsApp) et y ajoute « Commander ».
 * - Rendue dans <body> par un portail : aucun ancêtre ne peut lui imposer un `transform` ou un
 *   `filter` qui casserait `position: fixed` (MOUVEMENT.md R12).
 * - Un seul IntersectionObserver ; cibles de 44 px ; cachée = `visibility: hidden`, donc absente
 *   du clavier et des lecteurs d'écran ; glisse sur `transform` seul, instantanée sous
 *   « réduire les animations » (règle globale de index.css).
 * - S'efface quand une fenêtre est ouverte (`masquee`) et pendant une saisie (un champ a le focus).
 * - Absente du HTML pré-rendu : le portail vit hors de #root, seul contenu que capture le pré-rendu.
 */
const BarreAchat = ({
  cible,
  nom,
  prix,
  lienWhatsApp,
  telephone,
  commandeDisponible,
  masquee = false,
  onCommander,
  onAppeler,
  onWhatsApp,
}: BarreAchatProps) => {
  const [depassee, setDepassee] = useState(false);

  useEffect(() => {
    const el = cible.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    // Marge haute = l'en-tête collant du téléphone (h-14, 56 px) : un bloc caché derrière lui est
    // déjà sorti de la vue pour la personne.
    const obs = new IntersectionObserver(
      ([entree]) => {
        setDepassee(!entree.isIntersecting && entree.boundingClientRect.top < 56);
      },
      { rootMargin: "-56px 0px 0px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [cible]);

  // Un champ qui a le focus ouvre le clavier du téléphone : une barre fixe en bas remonterait
  // au-dessus de lui et cacherait la saisie. Elle s'efface le temps de la saisie.
  const [saisie, setSaisie] = useState(false);
  useEffect(() => {
    const estChamp = (el: EventTarget | null) =>
      el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
    const entre = (e: FocusEvent) => setSaisie(estChamp(e.target));
    const sort = () => setSaisie(false);
    document.addEventListener("focusin", entre);
    document.addEventListener("focusout", sort);
    return () => {
      document.removeEventListener("focusin", entre);
      document.removeEventListener("focusout", sort);
    };
  }, []);

  if (typeof document === "undefined") return null;
  const visible = depassee && !masquee && !saisie;

  return createPortal(
    <aside
      aria-label={`Achat rapide : ${nom}`}
      data-visible={visible ? "oui" : "non"}
      className="barre-achat fixed inset-x-0 bottom-0 z-50 grid grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-2 border-t border-border bg-background px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] md:hidden"
    >
      <div className="min-w-0 leading-tight">
        <p className="truncate text-[12px] font-semibold text-muted-foreground">{nom}</p>
        <p className="truncate text-[15px] font-extrabold text-primary">{prix}</p>
      </div>
      <Button
        type="button"
        variant="outline"
        className="h-11 w-11 p-0"
        onClick={onAppeler}
        aria-label={`Appeler le ${telephone}`}
      >
        <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
      </Button>
      <Button asChild variant="outline" className="h-11 w-11 border-[1.5px] border-success p-0 text-[#075e54]">
        <a href={lienWhatsApp} target="_blank" rel="noopener noreferrer" onClick={onWhatsApp} aria-label="Demander sur WhatsApp">
          <MessageCircle className="h-[18px] w-[18px]" aria-hidden="true" />
        </a>
      </Button>
      <Button
        type="button"
        className="h-11 gap-1.5 bg-success px-3.5 text-[14px] font-bold text-success-foreground hover:bg-success/90"
        onClick={onCommander}
        disabled={!commandeDisponible}
      >
        <ShoppingCart className="h-4 w-4" aria-hidden="true" />
        Commander
      </Button>
    </aside>,
    document.body,
  );
};

export default BarreAchat;
