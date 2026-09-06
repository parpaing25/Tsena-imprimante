import { Helmet } from "react-helmet-async";
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
      <Helmet>
        <title>Politique de Confidentialité | Tsena Imprimante Madagascar</title>
        <meta name="description" content="Politique de confidentialité de Tsena Imprimante : comment nous collectons, utilisons et protégeons vos données personnelles à Madagascar." />
        <link rel="canonical" href="https://tsenaimprimante.fonenako.mg/privacy" />
      </Helmet>
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
                <h2 className="text-xl font-semibold leading-none tracking-tight">1. Collecte des Informations</h2>
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
                <h2 className="text-xl font-semibold leading-none tracking-tight">2. Utilisation des Données</h2>
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
                <h2 className="text-xl font-semibold leading-none tracking-tight">3. Protection des Données</h2>
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
                <h2 className="text-xl font-semibold leading-none tracking-tight">4. Cookies et technologies</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Ce site ne dépose <strong>aucun cookie</strong>, ni publicitaire ni de mesure.</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>Mesure d'audience :</strong> une balise anonyme compte les pages vues et les clics (appel, WhatsApp, commande). Aucune adresse IP n'est conservée (elle est hachée avec un sel renouvelé chaque jour), aucun identifiant n'est posé sur votre appareil, et le signal « Do Not Track » de votre navigateur est respecté.</li>
                  <li>• <strong>Stockage local :</strong> le navigateur peut mémoriser vos préférences d'affichage (localStorage). Rien n'est transmis.</li>
                  <li>• <strong>Services tiers :</strong> aucun script tiers n'est chargé. Les liens vers WhatsApp, Messenger et Facebook vous emmènent sur ces services, régis par leurs propres politiques.</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold leading-none tracking-tight">5. Vos Droits</h2>
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
                <h2 className="text-xl font-semibold leading-none tracking-tight">5 bis. Responsable du traitement, base légale et conservation</h2>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <p><strong>Responsable :</strong> Tsena Imprimante, Avaradoha, Antananarivo 101, Madagascar — voir les <a href="/mentions-legales" className="underline">mentions légales</a>.</p>
                <p><strong>Cadre :</strong> loi malgache n° 2014-038 sur la protection des données à caractère personnel ; pour les personnes situées dans l'Union européenne, le RGPD s'applique aussi (base légale : exécution de mesures précontractuelles à votre demande, art. 6.1.b).</p>
                <p><strong>Ce que nous recevons :</strong> uniquement ce que vous saisissez dans un formulaire (nom, téléphone, e-mail, message, produits demandés). Ces demandes sont stockées sur notre hébergement (o2switch, France), transmises par e-mail et par notification à l'équipe.</p>
                <p><strong>Durée :</strong> 24 mois après le dernier échange, puis suppression. Vous pouvez demander la suppression à tout moment par e-mail ou téléphone ; nous répondons sous 30 jours.</p>
                <p><strong>Destinataires :</strong> l'équipe Tsena Imprimante seulement. Aucune vente ni cession.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold leading-none tracking-tight">6. Contact & Questions</h2>
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
                    <strong>Dernière mise à jour :</strong> 6 septembre 2026
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