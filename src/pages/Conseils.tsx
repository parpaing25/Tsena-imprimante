import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  Phone, 
  MessageCircle, 
  Printer, 
  Wifi, 
  Zap, 
  Users, 
  Home, 
  Building2,
  DollarSign,
  CheckCircle
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Conseils = () => {
  const handleCall = () => {
    window.location.href = "tel:+261337106334";
  };

  const handleMessenger = () => {
    window.open("https://m.me/TsenaImprimante", "_blank");
  };

  const handleCommand = (productName: string) => {
    const message = `Bonjour ! Je souhaite commander l'imprimante ${productName}. Pouvez-vous me donner plus d'informations ?`;
    const whatsappUrl = `https://wa.me/261327209033?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleQuote = (productName: string) => {
    const message = `Bonjour ! Je souhaite un devis pour l'imprimante ${productName}. Merci !`;
    const whatsappUrl = `https://wa.me/261327209033?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleStock = (productName: string) => {
    const message = `Bonjour ! Est-ce que l'imprimante ${productName} est disponible en stock ?`;
    const whatsappUrl = `https://wa.me/261327209033?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <Lightbulb className="h-16 w-16 mx-auto text-primary mb-4" />
            <h1 className="text-4xl font-bold text-primary mb-4">
              Conseils d'Experts
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Nos spécialistes vous guident pour choisir l'imprimante parfaite 
              selon vos besoins et votre budget.
            </p>
          </div>

          {/* Guide par Usage */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Choisir selon votre usage</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <Card className="hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <Home className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Usage Domestique</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Pour la maison, documents occasionnels, photos de famille.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Volume : 20-100 pages/mois</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Budget : 400 000 - 900 000 MGA</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="outline">Canon PIXMA TS3640</Badge>
                    <Badge variant="outline">Canon PIXMA MG2545</Badge>
                    <Badge variant="outline">HP DeskJet 2720</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <strong>Notre conseil :</strong> Privilégiez les imprimantes à EcoTank 
                    pour réduire les coûts d'impression si vous imprimez régulièrement.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <Users className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Usage Familial/Étudiant</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Pour familles, étudiants, devoirs, projets scolaires.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Volume : 100-300 pages/mois</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Budget : 600 000 - 1 200 000 MGA</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="outline">Canon PIXMA G2470</Badge>
                    <Badge variant="outline">Canon PIXMA G3410</Badge>
                    <Badge variant="outline">Epson EcoTank L3210</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <strong>Notre conseil :</strong> Les systèmes EcoTank sont idéaux ! 
                    Coût par page très bas, parfait pour les gros volumes.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <Building2 className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Usage Professionnel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Pour bureaux, entreprises, impressions fréquentes.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Volume : 300-1000+ pages/mois</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Budget : 1 000 000+ MGA</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="outline">Canon imageCLASS MF244dw</Badge>
                    <Badge variant="outline">HP LaserJet Pro</Badge>
                    <Badge variant="outline">Brother DCP-L2540DW</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <strong>Notre conseil :</strong> Optez pour le laser ! Vitesse, fiabilité 
                    et coût par page optimal pour les gros volumes.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Technologies Expliquées */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Technologies d'impression</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <Card>
                <CardHeader>
                  <Printer className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle>Jet d'Encre Classique</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Idéal pour photos et couleurs vives
                  </p>
                  <div className="space-y-2">
                    <div className="text-sm"><strong>✅ Avantages :</strong></div>
                    <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                      <li>• Excellent pour les photos</li>
                      <li>• Prix d'achat abordable</li>
                      <li>• Compact et silencieux</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm"><strong>❌ Inconvénients :</strong></div>
                    <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                      <li>• Cartouches coûteuses</li>
                      <li>• Plus lent pour gros volumes</li>
                      <li>• Encre peut sécher</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Zap className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle>Système EcoTank</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Révolutionnaire pour les économies d'encre
                  </p>
                  <div className="space-y-2">
                    <div className="text-sm"><strong>✅ Avantages :</strong></div>
                    <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                      <li>• Coût d'impression très bas</li>
                      <li>• Grande autonomie d'encre</li>
                      <li>• Idéal pour gros volumes</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm"><strong>❌ Inconvénients :</strong></div>
                    <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                      <li>• Prix d'achat plus élevé</li>
                      <li>• Nécessite usage régulier</li>
                      <li>• Encombrement légèrement plus important</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Printer className="h-8 w-8 text-purple-600 mb-2" />
                  <CardTitle>Laser</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Le champion de la vitesse et du volume
                  </p>
                  <div className="space-y-2">
                    <div className="text-sm"><strong>✅ Avantages :</strong></div>
                    <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                      <li>• Très rapide</li>
                      <li>• Texte ultra-net</li>
                      <li>• Toner longue durée</li>
                      <li>• Fiable pour gros volumes</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm"><strong>❌ Inconvénients :</strong></div>
                    <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                      <li>• Prix d'achat élevé</li>
                      <li>• Moins bon pour photos</li>
                      <li>• Plus encombrant</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Critères de Choix */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Critères importants</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Coût Total de Possession
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Ne regardez pas que le prix d'achat !
                  </p>
                  <div className="space-y-2 text-sm">
                    <div><strong>Calculez :</strong></div>
                    <ul className="space-y-1 text-muted-foreground ml-4">
                      <li>• Prix de l'imprimante</li>
                      <li>• Coût par page (encre/toner)</li>
                      <li>• Fréquence de remplacement</li>
                      <li>• Durée de vie estimée</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      <strong>Exemple :</strong> Une imprimante à 400 000 MGA avec cartouches à 50 000 MGA 
                      peut coûter plus cher qu'une EcoTank de 800 000 MGA sur 2 ans !
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wifi className="h-5 w-5 text-blue-600" />
                    Fonctionnalités Essentielles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Identifiez ce dont vous avez vraiment besoin
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Wifi className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">Wi-Fi</div>
                        <div className="text-xs text-muted-foreground">
                          Indispensable si plusieurs utilisateurs ou impression depuis mobile
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">Multifonction</div>
                        <div className="text-xs text-muted-foreground">
                          Scanner + Copieur : économise l'espace et le budget
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">Recto-Verso (Duplex)</div>
                        <div className="text-xs text-muted-foreground">
                          Économise le papier, obligatoire en entreprise
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Nos Recommandations Top */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Nos Recommandations 2025</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <Card className="border-2 border-primary">
                <CardHeader>
                  <Badge className="w-fit mb-2">🏆 MEILLEUR RAPPORT QUALITÉ-PRIX</Badge>
                  <CardTitle>Canon PIXMA G2470</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-2xl font-bold text-primary">860 000 MGA</div>
                  <p className="text-sm text-muted-foreground">
                    Système EcoTank, parfait pour familles et étudiants
                  </p>
                  <ul className="text-xs space-y-1">
                    <li>✅ Très économique à l'usage</li>
                    <li>✅ Qualité photo excellente</li>
                    <li>✅ Facile à utiliser</li>
                    <li>✅ Garantie 1 an</li>
                  </ul>
                  <Button className="w-full btn-hero" onClick={() => handleCommand("Canon PIXMA G2470")}>
                    <Phone className="h-4 w-4 mr-2" />
                    Commander maintenant
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-600">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">💼 PROFESSIONNEL</Badge>
                  <CardTitle>Canon MF244dw</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-2xl font-bold text-primary">1 530 000 MGA</div>
                  <p className="text-sm text-muted-foreground">
                    Laser multifonction, idéal entreprises
                  </p>
                  <ul className="text-xs space-y-1">
                    <li>✅ Ultra rapide (27 ppm)</li>
                    <li>✅ Wi-Fi + Recto-verso auto</li>
                    <li>✅ Scan to email</li>
                    <li>✅ Très fiable</li>
                  </ul>
                  <Button className="w-full btn-hero" onClick={() => handleQuote("Canon MF244dw")}>
                    <Phone className="h-4 w-4 mr-2" />
                    Demander un devis
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-500">
                <CardHeader>
                  <Badge variant="outline" className="w-fit mb-2">💰 PETIT BUDGET</Badge>
                  <CardTitle>Canon MG2545S</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-2xl font-bold text-primary">410 000 MGA</div>
                  <p className="text-sm text-muted-foreground">
                    Parfait pour usage occasionnel
                  </p>
                  <ul className="text-xs space-y-1">
                    <li>✅ Prix d'entrée imbattable</li>
                    <li>✅ Compact et simple</li>
                    <li>✅ Multifonction de base</li>
                    <li>✅ Idéal débutants</li>
                  </ul>
                  <Button className="w-full btn-hero" onClick={() => handleStock("Canon MG2545S")}>
                    <Phone className="h-4 w-4 mr-2" />
                    Vérifier stock
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Call to Action */}
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="text-center py-8">
              <h3 className="text-2xl font-bold mb-4">Besoin d'un conseil personnalisé ?</h3>
              <p className="text-lg mb-6 opacity-90">
                Nos experts analysent vos besoins et vous recommandent 
                l'imprimante parfaite pour votre usage et votre budget.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={handleCall}
                  className="bg-white text-primary hover:bg-white/90"
                  size="lg"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Appelez-nous maintenant
                </Button>
                <Button 
                  onClick={handleMessenger}
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary"
                  size="lg"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Messenger
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Conseils;