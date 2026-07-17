import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Phone, Mail, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
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
            <Shield className="h-16 w-16 mx-auto text-primary mb-4" />
            <h1 className="text-4xl font-bold text-primary mb-4">
              Politique de Confidentialité
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Nous respectons votre vie privée et protégeons vos données personnelles
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
                <CardTitle>1. Collecte des Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Nous collectons uniquement les informations nécessaires pour vous fournir nos services :
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>Informations de contact :</strong> Nom, téléphone, email, adresse</li>
                  <li>• <strong>Informations de commande :</strong> Produits choisis, quantités, préférences</li>
                  <li>• <strong>Informations de livraison :</strong> Adresse de livraison, instructions spéciales</li>
                  <li>• <strong>Communications :</strong> Messages via formulaires, appels, Facebook</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Utilisation des Données</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Vos données sont utilisées exclusivement pour :
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Traiter vos commandes et demandes de devis</li>
                  <li>• Organiser la livraison et l'installation</li>
                  <li>• Fournir le support technique et le SAV</li>
                  <li>• Vous informer sur nos nouveaux produits (avec votre accord)</li>
                  <li>• Améliorer nos services</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Protection des Données</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Nous prenons la sécurité de vos données au sérieux :
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>Stockage sécurisé :</strong> Vos données sont stockées de manière sécurisée</li>
                  <li>• <strong>Accès limité :</strong> Seul notre personnel autorisé y a accès</li>
                  <li>• <strong>Pas de vente :</strong> Nous ne vendons jamais vos données à des tiers</li>
                  <li>• <strong>Confidentialité :</strong> Respect total de votre vie privée</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Cookies et Technologies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Notre site utilise des technologies simples pour améliorer votre expérience :
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>Cookies techniques :</strong> Pour le bon fonctionnement du site</li>
                  <li>• <strong>Préférences :</strong> Pour mémoriser vos choix (langue, etc.)</li>
                  <li>• <strong>Pas de tracking :</strong> Nous ne vous suivons pas à des fins publicitaires</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Vos Droits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Vous avez le contrôle total sur vos données :
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>Accès :</strong> Demander une copie de vos données</li>
                  <li>• <strong>Rectification :</strong> Corriger des informations incorrectes</li>
                  <li>• <strong>Suppression :</strong> Demander l'effacement de vos données</li>
                  <li>• <strong>Opposition :</strong> Refuser certains traitements</li>
                  <li>• <strong>Portabilité :</strong> Récupérer vos données dans un format lisible</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Contact & Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Pour toute question concernant cette politique ou vos données :
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
              </CardContent>
            </Card>

            <Card className="bg-gradient-subtle">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Notre Engagement</h3>
                  <p className="text-muted-foreground">
                    Chez Tsena Imprimante, votre confiance est primordiale. Nous nous engageons 
                    à traiter vos données avec le plus grand respect et la plus grande transparence.
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

export default Privacy;