import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Phone, MessageCircle, MapPin, Clock, Printer, Facebook, Mail } from "lucide-react";
import { CONTACT, appeler, lienWhatsApp, ouvrirMessenger, ouvrirFacebook } from "@/config/contact";
import { evenement } from "@/lib/mesure";

/**
 * Pied de page + barre d'action mobile. Refonte du 07/09/2026.
 *
 * Avant : 1 241 px de pied sur un téléphone (quatre colonnes empilées), et une
 * pastille flottante d'appel qui masquait le coin bas droit de chaque page.
 *
 * Après : sur téléphone, l'essentiel en deux colonnes, et une barre fixe qui
 * porte les deux conversions réelles de l'activité — appeler et WhatsApp —
 * toujours sous le pouce. L'espace qu'elle occupe est rendu au bas de page
 * (`pb-[68px]`) pour qu'elle ne recouvre jamais un lien.
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleCall = () => {
    evenement("clic_appel", { ou: "pied" });
    appeler();
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-7 sm:py-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Identité */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 sm:h-10 sm:w-10">
                <Printer className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-lg font-bold sm:text-xl">Tsena Imprimante</p>
                <p className="text-xs opacity-80 sm:text-sm">Madagascar</p>
              </div>
            </div>
            <p className="hidden text-sm leading-relaxed opacity-80 sm:block">
              Votre partenaire de confiance pour tous vos besoins d'impression à Madagascar.
              Canon, HP, Epson — neuf sous carton, garantie constructeur.
            </p>
            <Button onClick={handleCall} className="btn-call hidden bg-success hover:bg-success/90 sm:inline-flex">
              <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
              {CONTACT.telephonePrincipal.affichage}
            </Button>
          </div>

          {/* Produits + services : deux colonnes serrées sur téléphone */}
          <div className="grid grid-cols-2 gap-6 md:col-span-1 md:grid-cols-1 lg:col-span-2 lg:grid-cols-2">
            <div className="space-y-2 sm:space-y-4">
              <h2 className="text-base font-semibold sm:text-lg">Nos produits</h2>
              <ul className="space-y-0.5 text-[13px] opacity-80 sm:space-y-2 sm:text-sm">
                <li><a href="/#catalogue" className="inline-block py-1 transition-colors hover:text-accent-light">Jet d'encre</a></li>
                <li><a href="/#catalogue" className="inline-block py-1 transition-colors hover:text-accent-light">Laser</a></li>
                <li><a href="/#catalogue" className="inline-block py-1 transition-colors hover:text-accent-light">Réservoir d'encre</a></li>
                <li><a href="/#catalogue" className="inline-block py-1 transition-colors hover:text-accent-light">Multifonctions</a></li>
                <li><Link to="/aide#consommables" className="inline-block py-1 transition-colors hover:text-accent-light">Encres et toners</Link></li>
              </ul>
            </div>

            <div className="space-y-2 sm:space-y-4">
              <h2 className="text-base font-semibold sm:text-lg">Nos services</h2>
              <ul className="space-y-0.5 text-[13px] opacity-80 sm:space-y-2 sm:text-sm">
                <li className="flex items-center gap-2 py-1">
                  <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                  Livraison toute l'île
                </li>
                <li className="flex items-center gap-2 py-1">
                  <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
                  Installation gratuite Tana
                </li>
                <li><Link to="/conseils" className="inline-block py-1 transition-colors hover:text-accent-light">Conseils d'achat</Link></li>
                <li><Link to="/aide" className="inline-block py-1 transition-colors hover:text-accent-light">Aide &amp; dépannage</Link></li>
                <li><Link to="/faq" className="inline-block py-1 transition-colors hover:text-accent-light">SAV &amp; garantie</Link></li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-2 sm:space-y-4">
            <h2 className="text-base font-semibold sm:text-lg">Contact</h2>
            <div className="space-y-1 text-[13px] sm:space-y-3 sm:text-sm">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                <a href={`tel:${CONTACT.telephonePrincipal.e164}`} className="inline-block py-1 transition-colors hover:text-accent-light">
                  {CONTACT.telephonePrincipal.affichage}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                <a href={`mailto:${CONTACT.email}`} className="inline-block break-all py-1 transition-colors hover:text-accent-light">
                  {CONTACT.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Facebook className="h-4 w-4 shrink-0" aria-hidden="true" />
                <a
                  href={CONTACT.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-1 transition-colors hover:text-accent-light"
                >
                  @TsenaImprimante
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <button
                  onClick={() => { evenement("clic_messenger", { ou: "pied" }); ouvrirMessenger(); }}
                  className="inline-block py-1 text-left transition-colors hover:text-accent-light"
                >
                  Facebook Messenger
                </button>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                <span>Avaradoha, Antananarivo 101</span>
              </div>
            </div>

            <div className="hidden gap-2 pt-2 sm:flex">
              <Button
                onClick={ouvrirFacebook}
                variant="outline"
                size="sm"
                className="border-[#1565c0] bg-[#1565c0] text-white hover:bg-[#0d47a1]"
              >
                <Facebook className="mr-2 h-4 w-4" aria-hidden="true" />
                Facebook
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-white/10" />

      <div className="container mx-auto px-4 py-5 pb-[76px] sm:py-6 sm:pb-6">
        <div className="flex flex-col items-center justify-between gap-3 text-[12.5px] opacity-80 sm:flex-row sm:gap-4 sm:text-sm">
          <p className="order-2 text-center sm:order-1 sm:text-left">
            &copy; {currentYear} Tsena Imprimante sy ny tontolony eto Madagasikara. Misaotra.
          </p>
          <div className="order-1 flex flex-wrap justify-center gap-x-5 gap-y-1 sm:order-2 sm:gap-x-6 sm:gap-y-2">
            <Link to="/blog" className="inline-block py-1 transition-colors hover:text-accent-light">Blog</Link>
            <Link to="/mentions-legales" className="inline-block py-1 transition-colors hover:text-accent-light">Mentions légales</Link>
            <Link to="/privacy" className="inline-block py-1 transition-colors hover:text-accent-light">Confidentialité</Link>
            <Link to="/terms" className="inline-block py-1 transition-colors hover:text-accent-light">Conditions</Link>
          </div>
        </div>
      </div>

      {/* Barre d'action mobile : les deux conversions réelles, toujours sous le pouce */}
      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t border-border bg-background/95 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden">
        <Button
          onClick={handleCall}
          className="h-11 gap-2 bg-success text-[14px] font-bold text-success-foreground hover:bg-success/90"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          Appeler
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-11 gap-2 border-[1.5px] border-success bg-background text-[14px] font-bold text-[#075e54]"
        >
          <a
            href={lienWhatsApp("Bonjour Tsena Imprimante, je cherche une imprimante.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => evenement("clic_whatsapp", { ou: "barre" })}
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            WhatsApp
          </a>
        </Button>
      </div>
    </footer>
  );
};

export default Footer;
