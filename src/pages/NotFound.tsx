import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Phone, Printer, HelpCircle, Home, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CONTACT, appeler, ouvrirMessenger } from "@/config/contact";

/**
 * Page 404. Audit 06/09/2026 : l'ancienne page était en anglais (« Oops! Page
 * not found »), sans en-tête ni pied de page, et le serveur répondait 200.
 * Elle est maintenant pré-rendue en dist/404.html et servie avec le code 404
 * (ErrorDocument dans .htaccess).
 */
const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Page introuvable (404) | Tsena Imprimante Madagascar</title>
        <meta name="description" content="Cette page n'existe pas ou plus. Retrouvez le catalogue d'imprimantes, la FAQ et le contact de Tsena Imprimante." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Header />
      <main className="container mx-auto px-4 py-16 sm:py-24">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Erreur 404</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">Cette page n'existe pas</h1>
          <p className="text-lg text-muted-foreground">
            L'adresse <code className="rounded bg-muted px-1.5 py-0.5 text-sm">{location.pathname}</code> ne correspond
            à aucune page du site. Le lien est peut-être ancien ou mal recopié.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            <Button asChild className="btn-hero">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/#catalogue">
                <Printer className="h-4 w-4 mr-2" />
                Voir les imprimantes
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/faq">
                <HelpCircle className="h-4 w-4 mr-2" />
                Questions fréquentes
              </Link>
            </Button>
            <Button variant="outline" onClick={ouvrirMessenger}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Nous écrire sur Messenger
            </Button>
          </div>
          <p className="text-sm text-muted-foreground pt-6">
            Vous cherchiez un modèle précis ? Appelez-nous :
          </p>
          <Button onClick={appeler} className="btn-call">
            <Phone className="h-4 w-4 mr-2" />
            {CONTACT.telephonePrincipal.affichage}
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
