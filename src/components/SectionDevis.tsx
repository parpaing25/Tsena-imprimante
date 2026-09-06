import { lazy, Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, ChevronDown } from "lucide-react";

const ProformaQuoteForm = lazy(() => import("@/components/ProformaQuoteForm"));

/**
 * Devis proforma. Refonte mobile du 07/09/2026.
 *
 * Le formulaire déroulé mesurait 1 788 px sur un téléphone — douze champs et
 * la liste des quinze produits à cocher, traversés au doigt par tous ceux qui
 * ne voulaient qu'appeler. Il est maintenant replié derrière une carte qui dit
 * ce qu'il fait ; il s'ouvre au clic, et tout seul quand un visiteur demande un
 * devis depuis une carte produit (événement `tsena:devis`). Sur `sm:` et
 * au-dessus, il reste déplié comme avant.
 */
const SectionDevis = () => {
  const [ouvert, setOuvert] = useState(false);

  useEffect(() => {
    const ouvrir = () => setOuvert(true);
    window.addEventListener("tsena:devis", ouvrir);
    if (window.location.hash === "#devis") setOuvert(true);
    return () => window.removeEventListener("tsena:devis", ouvrir);
  }, []);

  return (
    <section id="devis" className="scroll-mt-16">
      {/* Téléphone : la carte d'appel, le formulaire ne se déplie qu'à la demande */}
      <div className={ouvert ? "hidden" : "px-4 py-5 sm:hidden"}>
        <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-4 text-primary-foreground">
          <h2 className="flex items-center gap-2 text-lg font-extrabold">
            <FileText className="h-5 w-5 text-accent-light" aria-hidden="true" />
            Facture proforma en PDF
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-primary-foreground/85">
            Au nom de votre société, avec les frais de livraison calculés selon la ville et le poids.
            Gratuit, immédiat.
          </p>
          <Button
            onClick={() => setOuvert(true)}
            className="mt-3.5 h-12 w-full bg-accent text-[14.5px] font-bold text-accent-foreground hover:bg-accent/90"
          >
            Créer mon devis
            <ChevronDown className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className={ouvert ? "block" : "hidden sm:block"}>
        <Suspense fallback={<div className="h-64" aria-hidden="true" />}>
          <ProformaQuoteForm />
        </Suspense>
      </div>
    </section>
  );
};

export default SectionDevis;
