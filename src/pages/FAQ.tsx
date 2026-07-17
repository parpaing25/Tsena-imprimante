import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, HelpCircle, Wrench, Truck, CreditCard } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const FAQ = () => {
  const handleCall = () => {
    window.location.href = "tel:+261337106334";
  };

  const handleMessenger = () => {
    window.open("https://m.me/TsenaImprimante", "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <HelpCircle className="h-16 w-16 mx-auto text-primary mb-4" />
            <h1 className="text-4xl font-bold text-primary mb-4">
              Questions Fréquentes
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Retrouvez toutes les réponses à vos questions sur nos imprimantes, 
              nos services et notre support technique.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* FAQ Content */}
            <div className="lg:col-span-2">
              <Accordion type="single" collapsible className="space-y-4">
                
                {/* Commandes et Achats */}
                <Card>
                  <AccordionItem value="commande" className="border-none">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <span className="text-lg font-semibold">Commandes & Achats</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Comment passer commande ?</h4>
                          <p className="text-muted-foreground">
                            Vous pouvez commander directement sur le site via le bouton "Acheter", 
                            nous contacter par téléphone au 033 71 063 34, ou via Facebook Messenger. 
                            Chaque commande est traitée personnellement.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Quels sont les modes de paiement ?</h4>
                          <p className="text-muted-foreground">
                            Nous acceptons les paiements en espèces (à la livraison ou au retrait), 
                            virement bancaire, et Mobile Money (MVola, Orange Money). 
                            Le paiement peut se faire à la commande ou à la livraison.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Y a-t-il des frais de livraison ?</h4>
                          <p className="text-muted-foreground">
                            La livraison est gratuite à Antananarivo. Pour les autres régions, 
                            les frais varient selon la distance. Contactez-nous pour un devis précis.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Card>

                {/* Livraison */}
                <Card>
                  <AccordionItem value="livraison" className="border-none">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5 text-primary" />
                        <span className="text-lg font-semibold">Livraison & Installation</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Délais de livraison</h4>
                          <p className="text-muted-foreground">
                            • Antananarivo : 24-48h selon disponibilité<br/>
                            • Antsirabe : 2-3 jours<br/>
                            • Autres régions : 3-7 jours selon la localisation<br/>
                            Les délais peuvent varier selon le stock disponible.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Installation et configuration</h4>
                          <p className="text-muted-foreground">
                            Installation gratuite sur Antananarivo ! Nous configurons votre imprimante, 
                            installons les drivers, et vous formons à son utilisation. 
                            Pour les autres régions, support téléphonique gratuit.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Que faire si l'imprimante arrive endommagée ?</h4>
                          <p className="text-muted-foreground">
                            Contactez-nous immédiatement ! Nous remplaçons gratuitement tout produit 
                            endommagé pendant le transport. Photos requises pour traitement rapide.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Card>

                {/* Support Technique */}
                <Card>
                  <AccordionItem value="support" className="border-none">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Wrench className="h-5 w-5 text-primary" />
                        <span className="text-lg font-semibold">Support Technique & SAV</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Garantie des produits</h4>
                          <p className="text-muted-foreground">
                            • Canon, HP, Epson : 1 an garantie constructeur<br/>
                            • Brother : 1 an garantie constructeur<br/>
                            • Support technique gratuit pendant toute la durée de vie du produit<br/>
                            La garantie couvre les défauts de fabrication, pas l'usure normale.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Mon imprimante ne fonctionne plus, que faire ?</h4>
                          <p className="text-muted-foreground">
                            1. Vérifiez les branchements et l'alimentation<br/>
                            2. Redémarrez l'imprimante et l'ordinateur<br/>
                            3. Vérifiez les niveaux d'encre<br/>
                            4. Si le problème persiste, appelez-nous au 033 71 063 34
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Problèmes d'impression courants</h4>
                          <p className="text-muted-foreground">
                            • <strong>Impression pâle :</strong> Vérifiez les niveaux d'encre<br/>
                            • <strong>Bourrages papier :</strong> Utilisez du papier de qualité, vérifiez les guides<br/>
                            • <strong>Taches :</strong> Nettoyez les têtes d'impression<br/>
                            • <strong>Wi-Fi :</strong> Reconnectez l'imprimante au réseau
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Card>

                {/* Consommables */}
                <Card>
                  <AccordionItem value="consommables" className="border-none">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center gap-3">
                        <HelpCircle className="h-5 w-5 text-primary" />
                        <span className="text-lg font-semibold">Encres & Consommables</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Où acheter les cartouches et encres ?</h4>
                          <p className="text-muted-foreground">
                            Nous vendons toutes les cartouches et encres compatibles avec nos imprimantes. 
                            Contactez-nous pour vérifier la disponibilité et les prix. 
                            Livraison possible dans toute l'île.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Cartouches originales vs compatibles ?</h4>
                          <p className="text-muted-foreground">
                            • <strong>Originales :</strong> Garantie constructeur, qualité optimale, prix plus élevé<br/>
                            • <strong>Compatibles :</strong> Qualité correcte, prix réduit, garantie limitée<br/>
                            Nous recommandons les originales pour un usage professionnel intensif.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Quand changer les cartouches ?</h4>
                          <p className="text-muted-foreground">
                            Changez dès que l'imprimante indique un niveau bas ou que la qualité 
                            d'impression diminue. Ne laissez jamais l'imprimante sans encre longtemps, 
                            cela peut endommager les têtes d'impression.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Card>

              </Accordion>
            </div>

            {/* Contact Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Besoin d'aide ?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Notre équipe est là pour vous aider ! Contactez-nous directement.
                  </p>
                  <Button onClick={handleCall} className="w-full btn-call">
                    <Phone className="h-4 w-4 mr-2" />
                    033 71 063 34
                  </Button>
                  <Button onClick={handleMessenger} variant="outline" className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Facebook Messenger
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Horaires de Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Lun - Ven :</span>
                      <span>8h - 18h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Samedi :</span>
                      <span>8h - 16h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dimanche :</span>
                      <span>Urgences uniquement</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;