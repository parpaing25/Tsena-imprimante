import { useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductCatalog from "@/components/ProductCatalog";
import ContactSection from "@/components/ContactSection";
import QuoteForm from "@/components/ProformaQuoteForm";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  Calculator, 
  Shield, 
  Truck, 
  Phone, 
  Zap, 
  Printer, 
  Wifi,
  Star,
  CheckCircle
} from "lucide-react";

const Index = () => {
  useEffect(() => {
    // Update page title and meta description for SEO
    document.title = "Tsena Imprimante Madagascar - Canon, HP, Epson | Livraison Province";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Vente d\'imprimantes Canon, HP, Epson, Brother à Madagascar. Jet d\'encre, laser, EcoTank. Livraison province, installation gratuite Tana. Devis gratuit ☎ 033 71 063 34'
      );
    }
  }, []);

  const handleCall = () => {
    window.location.href = "tel:+261337106334";
  };

  const advantages = [
    {
      icon: <Truck className="h-8 w-8 text-primary" />,
      title: "Livraison Province",
      description: "Nous livrons dans toute l'île de Madagascar"
    },
    {
      icon: <Shield className="h-8 w-8 text-success" />,
      title: "Installation Gratuite",
      description: "Service d'installation gratuit à Antananarivo"
    },
    {
      icon: <Phone className="h-8 w-8 text-accent" />,
      title: "Support Technique",
      description: "Assistance et SAV par téléphone"
    },
    {
      icon: <Star className="h-8 w-8 text-warning" />,
      title: "Marques Reconnues",
      description: "Canon, HP, Epson, Brother - Qualité garantie"
    }
  ];

  const printerTypes = [
    {
      icon: <Zap className="h-6 w-6 text-accent" />,
      name: "EcoTank",
      description: "Très économique, idéal pour gros volumes",
      price: "À partir de 690 000 MGA",
      popular: true
    },
    {
      icon: <Printer className="h-6 w-6 text-primary" />,
      name: "Laser",
      description: "Rapide et précis pour bureaux",
      price: "À partir de 1 530 000 MGA"
    },
    {
      icon: <Wifi className="h-6 w-6 text-success" />,
      name: "Jet d'encre Wi-Fi",
      description: "Impression sans fil depuis mobile",
      price: "À partir de 340 000 MGA"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        
        {/* Why Choose Us */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">
                Pourquoi Choisir Tsena Imprimante ?
              </h2>
              <p className="text-lg text-muted-foreground">
                Votre satisfaction, notre engagement depuis des années
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {advantages.map((advantage, index) => (
                <Card key={index} className="text-center hover:shadow-medium transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">
                      {advantage.icon}
                    </div>
                    <h3 className="font-semibold mb-2">{advantage.title}</h3>
                    <p className="text-sm text-muted-foreground">{advantage.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Printer Types */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">
                Quel Type d'Imprimante Choisir ?
              </h2>
              <p className="text-lg text-muted-foreground">
                Nous vous aidons à faire le bon choix selon vos besoins
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {printerTypes.map((type, index) => (
                <Card key={index} className="relative hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                  {type.popular && (
                    <Badge className="absolute -top-2 left-4 bg-accent text-accent-foreground">
                      Populaire
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      {type.icon}
                      {type.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{type.description}</p>
                    <p className="font-semibold text-primary">{type.price}</p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => document.getElementById("catalogue")?.scrollIntoView({ behavior: "smooth" })}
                    >
                      Voir les modèles
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button onClick={handleCall} className="btn-call">
                <Phone className="h-4 w-4 mr-2" />
                Besoin de conseils ? Appelez-nous !
              </Button>
            </div>
          </div>
        </section>

        <ProductCatalog />

        <QuoteForm />

        {/* Quick Tips */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">
                <Lightbulb className="h-8 w-8 mx-auto mb-2" />
                Conseils Pratiques
              </h2>
              <p className="text-lg text-muted-foreground">
                Nos experts vous guident pour faire le meilleur choix
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">💡 Coût par page</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span><strong>EcoTank:</strong> ~0.02 MGA/page couleur</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span><strong>Laser:</strong> ~50-80 MGA/page N&B</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span><strong>Cartouche:</strong> ~200-400 MGA/page</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">📊 Volume recommandé</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span><strong>Domestique:</strong> 50-200 pages/mois</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span><strong>Petit bureau:</strong> 200-800 pages/mois</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span><strong>Entreprise:</strong> 1000+ pages/mois</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">⚡ Fonctionnalités clés</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span><strong>Wi-Fi:</strong> Impression mobile</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span><strong>ADF:</strong> Scan multi-pages auto</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span><strong>Duplex:</strong> Impression R/V auto</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">
                Ce que disent nos clients
              </h2>
              <p className="text-lg text-muted-foreground">
                Plus de 2000 clients satisfaits depuis 2019
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-medium transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="flex text-warning">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    "Service exceptionnel ! Installation rapide à domicile et formation complète. 
                    Mon Canon EcoTank fonctionne parfaitement depuis 6 mois."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">RM</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Rakoto Michel</p>
                      <p className="text-xs text-muted-foreground">Antananarivo</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-medium transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="flex text-warning">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    "Livraison ultra rapide à Antsirabe ! Imprimante laser parfaite pour mon bureau. 
                    Support technique au top quand j'ai eu un souci."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-success/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-success">SA</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Sophie Andriana</p>
                      <p className="text-xs text-muted-foreground">Antsirabe</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-medium transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="flex text-warning">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    "Conseils d'expert pour choisir la bonne imprimante. Prix compétitifs et 
                    garantie respectée. Je recommande vivement !"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-accent/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-accent">JR</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Jean Claude Rasolofo</p>
                      <p className="text-xs text-muted-foreground">Mahajanga</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center mt-8">
              <Button onClick={handleCall} className="btn-hero">
                <Phone className="h-4 w-4 mr-2" />
                Rejoignez nos clients satisfaits !
              </Button>
            </div>
          </div>
        </section>

        {/* Brands Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">
                Nos Partenaires de Confiance
              </h2>
              <p className="text-lg text-muted-foreground">
                Nous travaillons avec les plus grandes marques mondiales
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              <Card className="text-center p-6 hover:shadow-medium transition-all duration-300">
                <div className="h-16 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-red-600">Canon</span>
                </div>
                <p className="text-sm text-muted-foreground">Leader mondial</p>
                <p className="text-xs text-muted-foreground">Qualité professionnelle</p>
              </Card>
              
              <Card className="text-center p-6 hover:shadow-medium transition-all duration-300">
                <div className="h-16 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-blue-600">HP</span>
                </div>
                <p className="text-sm text-muted-foreground">Innovation & Fiabilité</p>
                <p className="text-xs text-muted-foreground">Technologies avancées</p>
              </Card>
              
              <Card className="text-center p-6 hover:shadow-medium transition-all duration-300">
                <div className="h-16 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-blue-800">Epson</span>
                </div>
                <p className="text-sm text-muted-foreground">EcoTank Révolutionnaire</p>
                <p className="text-xs text-muted-foreground">Économies d'encre</p>
              </Card>
              
              <Card className="text-center p-6 hover:shadow-medium transition-all duration-300">
                <div className="h-16 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-gray-800">Brother</span>
                </div>
                <p className="text-sm text-muted-foreground">Robustesse Garantie</p>
                <p className="text-xs text-muted-foreground">Usage intensif</p>
              </Card>
            </div>
            
            <div className="text-center mt-8">
              <div className="bg-gradient-subtle p-6 rounded-lg max-w-4xl mx-auto">
                <h3 className="text-xl font-semibold mb-4">🏆 Distributeur Officiel Agréé</h3>
                <p className="text-muted-foreground">
                  En tant que partenaire officiel, nous garantissons l'authenticité de tous nos produits 
                  et respectons les standards de qualité internationaux. Garantie constructeur complète incluse.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Guarantee */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Notre Engagement Service</h2>
              <p className="text-xl opacity-90">Des garanties qui vous protègent vraiment</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20 transition-all">
                <CardContent className="pt-6 text-center">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-success" />
                  <h3 className="font-semibold mb-2">Garantie 1 An</h3>
                  <p className="text-sm opacity-90">Garantie constructeur complète + support technique gratuit</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20 transition-all">
                <CardContent className="pt-6 text-center">
                  <Truck className="h-12 w-12 mx-auto mb-4 text-accent" />
                  <h3 className="font-semibold mb-2">Livraison Sécurisée</h3>
                  <p className="text-sm opacity-90">Emballage professionnel et assurance transport</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20 transition-all">
                <CardContent className="pt-6 text-center">
                  <Phone className="h-12 w-12 mx-auto mb-4 text-warning" />
                  <h3 className="font-semibold mb-2">Support 24/7</h3>
                  <p className="text-sm opacity-90">Assistance technique par téléphone, même le weekend</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20 transition-all">
                <CardContent className="pt-6 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-success" />
                  <h3 className="font-semibold mb-2">Satisfaction 100%</h3>
                  <p className="text-sm opacity-90">30 jours pour changer d'avis, remboursement intégral</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center mt-12">
              <Button onClick={handleCall} className="btn-call bg-white text-primary hover:bg-gray-100">
                <Phone className="h-4 w-4 mr-2" />
                Découvrez tous nos services
              </Button>
            </div>
          </div>
        </section>

        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
