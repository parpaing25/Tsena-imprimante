import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Phone, Mail, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const Terms = () => {
  const navigate = useNavigate();

  const handleCall = () => {
    window.location.href = "tel:+261337106334";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <FileText className="h-16 w-16 mx-auto text-primary mb-4" />
            <h1 className="text-4xl font-bold text-primary mb-4">
              Conditions d'Utilisation
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Nos conditions de vente et d'utilisation du service
            </p>
            <Button 
              onClick={() => navigate(-1)} 
              variant="outline" 
              className="mt-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            
            <Card>
              <CardHeader>
                <CardTitle>1. Présentation du Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Tsena Imprimante est une entreprise spécialisée dans la vente d'imprimantes 
                  et de matériel informatique à Madagascar. Nous proposons :
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Vente d'imprimantes neuves de marques Canon, HP, Epson, Brother</li>
                  <li>• Livraison dans toute l'île de Madagascar</li>
                  <li>• Installation et formation gratuite à Antananarivo</li>
                  <li>• Support technique et service après-vente</li>
                  <li>• Vente de consommables et accessoires</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Commandes et Paiement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h4 className="font-semibold">Processus de Commande</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Les commandes peuvent être passées par téléphone, email ou via notre site</li>
                  <li>• Chaque commande fait l'objet d'une confirmation écrite</li>
                  <li>• Les prix sont indiqués en Ariary Malagasy (MGA) TTC</li>
                  <li>• Les prix peuvent varier selon la disponibilité et les fluctuations de change</li>
                </ul>
                
                <h4 className="font-semibold mt-6">Modes de Paiement</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Espèces (à la commande ou à la livraison)</li>
                  <li>• Virement bancaire</li>
                  <li>• Mobile Money (MVola, Orange Money)</li>
                  <li>• Paiement échelonné possible selon conditions</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Livraison et Installation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h4 className="font-semibold">Délais de Livraison</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Antananarivo : 24-48h selon disponibilité stock</li>
                  <li>• Antsirabe : 2-3 jours ouvrés</li>
                  <li>• Autres régions : 3-7 jours selon localisation</li>
                  <li>• Les délais sont donnés à titre indicatif</li>
                </ul>
                
                <h4 className="font-semibold mt-6">Frais de Livraison</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Gratuite sur Antananarivo et environs</li>
                  <li>• Autres régions : selon barème distance/poids</li>
                  <li>• Frais communiqués avant validation commande</li>
                </ul>
                
                <h4 className="font-semibold mt-6">Installation</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Gratuite à domicile sur Antananarivo</li>
                  <li>• Inclut : déballage, branchement, configuration, formation</li>
                  <li>• Autres régions : support téléphonique gratuit</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Garanties et SAV</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h4 className="font-semibold">Garantie Produits</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Tous nos produits bénéficient de la garantie constructeur (1 an)</li>
                  <li>• La garantie couvre les défauts de fabrication uniquement</li>
                  <li>• Exclusions : usure normale, mauvaise utilisation, dommages accidentels</li>
                  <li>• Support technique gratuit pendant toute la durée de vie du produit</li>
                </ul>
                
                <h4 className="font-semibold mt-6">Service Après-Vente</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Diagnostic téléphonique gratuit</li>
                  <li>• Intervention sur site possible (tarif selon distance)</li>
                  <li>• Réparation en atelier agréé si nécessaire</li>
                  <li>• Prêt d'équipement selon disponibilité</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Retours et Remboursements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>Produit défectueux :</strong> Échange gratuit sous 7 jours</li>
                  <li>• <strong>Erreur de commande :</strong> Retour possible sous 48h (frais client)</li>
                  <li>• <strong>Changement d'avis :</strong> Retour sous 30 jours, produit neuf, emballage intact</li>
                  <li>• <strong>Livraison endommagée :</strong> Refus de livraison ou échange immédiat</li>
                  <li>• Les frais de retour sont à la charge du client sauf défaut produit</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Responsabilités</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h4 className="font-semibold">Nos Engagements</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Produits authentiques et conformes aux normes</li>
                  <li>• Service professionnel et conseil personnalisé</li>
                  <li>• Respect des délais dans la mesure du possible</li>
                  <li>• Transparence sur les prix et conditions</li>
                </ul>
                
                <h4 className="font-semibold mt-6">Limitations</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Notre responsabilité est limitée au prix du produit vendu</li>
                  <li>• Nous ne sommes pas responsables des dommages indirects</li>
                  <li>• Les retards de livraison dus à des causes externes ne nous sont pas imputables</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Contact et Litiges</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Pour toute question ou réclamation, contactez-nous :
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={handleCall} className="btn-call">
                    <Phone className="h-4 w-4 mr-2" />
                    033 71 063 34
                  </Button>
                  <Button 
                    onClick={() => window.location.href = "mailto:tsenaimprimante@gmail.com"}
                    variant="outline"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    tsenaimprimante@gmail.com
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  En cas de litige, nous privilégions toujours la résolution amiable. 
                  Les tribunaux de Madagascar sont compétents en cas de conflit non résolu.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-subtle">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Acceptation des Conditions</h3>
                  <p className="text-muted-foreground">
                    En passant commande chez Tsena Imprimante, vous acceptez l'ensemble 
                    de ces conditions d'utilisation. Nous nous réservons le droit de les 
                    modifier à tout moment avec préavis.
                  </p>
                  <p className="text-sm text-muted-foreground mt-4">
                    <strong>Dernière mise à jour :</strong> Janvier 2025
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;