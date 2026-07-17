import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Phone, MessageCircle, MapPin, Clock, Printer, Facebook, Mail } from "lucide-react";

const Footer = () => {
  const handleCall = () => {
    window.location.href = "tel:+261337106334";
  };

  const handleFacebook = () => {
    window.open("https://www.facebook.com/TsenaImprimante", "_blank");
  };

  const handleMessenger = () => {
    window.open("https://m.me/TsenaImprimante", "_blank");
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <Printer className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Tsena Imprimante</h3>
                <p className="text-sm opacity-80">Madagascar</p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Votre partenaire de confiance pour tous vos besoins d'impression à Madagascar. 
              Canon, HP, Epson, Brother - Qualité garantie.
            </p>
            <Button onClick={handleCall} className="btn-call bg-success hover:bg-success/90">
              <Phone className="h-4 w-4 mr-2" />
              033 71 063 34
            </Button>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Nos Produits</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#catalogue" className="hover:text-accent-light transition-colors">Imprimantes Jet d'encre</a></li>
              <li><a href="#catalogue" className="hover:text-accent-light transition-colors">Imprimantes Laser</a></li>
              <li><a href="#catalogue" className="hover:text-accent-light transition-colors">Système EcoTank</a></li>
              <li><a href="#catalogue" className="hover:text-accent-light transition-colors">Multifonctions</a></li>
              <li><a href="#catalogue" className="hover:text-accent-light transition-colors">Consommables</a></li>
              <li><a href="#catalogue" className="hover:text-accent-light transition-colors">Accessoires</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Nos Services</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                Livraison toute l'île
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                Installation gratuite Tana
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3 w-3" />
                Support technique
              </li>
              <li><a href="/conseils" className="hover:text-accent-light transition-colors">Conseils d'achat</a></li>
              <li><a href="/faq" className="hover:text-accent-light transition-colors">SAV & Garantie</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-success" />
                <a href="tel:+261337106334" className="hover:text-accent-light transition-colors">
                  033 71 063 34
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-accent" />
                <a 
                  href="mailto:tsenaimprimante@gmail.com" 
                  className="hover:text-accent-light transition-colors"
                >
                  tsenaimprimante@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Facebook className="h-4 w-4 text-[#1877f2]" />
                <a 
                  href="https://www.facebook.com/TsenaImprimante" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-accent-light transition-colors"
                >
                  @TsenaImprimante
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MessageCircle className="h-4 w-4 text-[#00d856]" />
                <button 
                  onClick={handleMessenger}
                  className="hover:text-accent-light transition-colors text-left"
                >
                  Facebook Messenger
                </button>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-accent" />
                <span>Madagascar</span>
              </div>
            </div>
            
            <div className="pt-2 flex gap-2">
              <Button 
                onClick={handleMessenger}
                variant="outline" 
                size="sm"
                className="border-white/20 text-white hover:bg-white hover:text-primary"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Messenger
              </Button>
              <Button 
                onClick={handleFacebook}
                variant="outline" 
                size="sm"
                className="border-[#1877f2] bg-[#1877f2] text-white hover:bg-[#166fe5]"
              >
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-white/10" />
      
      {/* Bottom Footer */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-80">
          <div className="flex flex-col md:flex-row gap-4">
            <p>&copy; {currentYear} Tsena Imprimante sy ny tontolony eto Madagasikara. Misaotra.</p>
          </div>
          <div className="flex gap-6">
            <a href="/blog" className="hover:text-accent-light transition-colors">
              Blog & Actualités
            </a>
            <a href="/privacy" className="hover:text-accent-light transition-colors">
              Politique de confidentialité
            </a>
            <a href="/terms" className="hover:text-accent-light transition-colors">
              Conditions d'utilisation
            </a>
          </div>
        </div>
      </div>

      {/* Floating Call Button (Mobile) */}
      <div className="fixed bottom-6 right-6 md:hidden z-50">
        <Button 
          onClick={handleCall}
          className="btn-call h-14 w-14 rounded-full shadow-glow animate-pulse"
          size="sm"
        >
          <Phone className="h-6 w-6" />
        </Button>
      </div>
    </footer>
  );
};

export default Footer;