import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Menu, X, Facebook, FileText } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import tsenaLogo from "@/assets/tsena-logo.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Accueil", href: "/" },
    { name: "Catalogue", href: "/#catalogue" },
    { name: "Conseils", href: "/conseils" },
    { name: "Blog", href: "/blog" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/#contact" },
  ];

  const handleCall = () => {
    window.location.href = "tel:+261337106334";
  };

  const handleProforma = () => {
    document.getElementById('devis')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMessenger = () => {
    window.open("https://m.me/TsenaImprimante", "_blank");
  };

  const handleFacebook = () => {
    window.open("https://www.facebook.com/TsenaImprimante", "_blank");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2">
          {/* Logo */}
          <div className="flex items-center space-x-1 sm:space-x-2 min-w-0 flex-shrink-0">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg overflow-hidden bg-white flex-shrink-0">
              <img src="/lovable-uploads/d87be83d-c5c5-45b5-9c31-80ebeffe32a4.png" alt="Tsena Imprimante" className="h-6 w-6 sm:h-8 sm:w-8 object-contain" />
            </div>
            <div className="hidden sm:block min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent truncate hover:scale-105 transition-transform duration-300">
                Tsena Imprimante
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">eto Madagasikara</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 flex-1 justify-center">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-base font-semibold transition-all duration-300 hover:text-primary whitespace-nowrap px-4 py-2 rounded-lg border border-border hover:border-primary hover:bg-accent/10 hover:shadow-lg hover-scale animate-fade-in relative overflow-hidden group"
              >
                <span className="relative z-10">{item.name}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <Button 
              onClick={handleProforma}
              className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-accent-foreground text-xs px-2 py-1 h-8 shadow-medium"
              size="sm"
            >
              <FileText className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Proforma</span>
              <span className="sm:hidden">PDF</span>
            </Button>
            
            <Button 
              onClick={handleCall}
              className="btn-call text-xs px-2 py-1 h-8"
              size="sm"
            >
              <Phone className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">033 71 063 34</span>
              <span className="sm:hidden">Tel</span>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden h-8 w-8 p-0">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium transition-colors hover:text-primary py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                  <div className="pt-4 border-t space-y-3">
                    <Button onClick={handleProforma} className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-accent-foreground w-full shadow-medium">
                      <FileText className="h-4 w-4 mr-2" />
                      Demander Proforma PDF
                    </Button>
                    <Button onClick={handleCall} className="btn-call w-full">
                      <Phone className="h-4 w-4 mr-2" />
                      Appeler 033 71 063 34
                    </Button>
                    <Button onClick={handleMessenger} variant="outline" className="w-full">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Facebook Messenger
                    </Button>
                    <Button onClick={handleFacebook} variant="outline" className="w-full bg-[#1877f2] text-white border-[#1877f2] hover:bg-[#166fe5]">
                      <Facebook className="h-4 w-4 mr-2" />
                      Page Facebook
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;