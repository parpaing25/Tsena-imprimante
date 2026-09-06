import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CONTACT } from "@/config/contact";

/**
 * Mentions légales. Audit 06/09/2026 : page absente. À Madagascar, la loi
 * n° 2014-024 sur les transactions électroniques impose au vendeur en ligne
 * d'afficher son identité, son adresse, ses coordonnées et ses identifiants
 * fiscaux ; la loi n° 2014-038 encadre les données personnelles.
 *
 * Les champs marqués « à compléter » attendent les identifiants officiels
 * d'Andry (NIF, STAT, forme juridique, nom du responsable).
 */
const A_COMPLETER = "à compléter";

const MentionsLegales = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Mentions légales | Tsena Imprimante Madagascar</title>
      <meta name="description" content="Identité de l'éditeur du site tsenaimprimante.fonenako.mg, hébergeur, propriété intellectuelle, données personnelles et droit applicable." />
      <link rel="canonical" href="https://tsenaimprimante.fonenako.mg/mentions-legales" />
    </Helmet>
    <Header />
    <main className="container mx-auto px-4 py-10 sm:py-14">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-3">Mentions légales</h1>
          <p className="text-muted-foreground">Informations sur l'éditeur du site et vos droits. Dernière mise à jour : 6 septembre 2026.</p>
        </div>

        <Card>
          <CardHeader><h2 className="text-xl font-semibold leading-none tracking-tight">1. Éditeur du site</h2></CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm">
              <dt className="font-medium">Enseigne</dt><dd className="sm:col-span-2">{CONTACT.nom}</dd>
              <dt className="font-medium">Forme juridique</dt><dd className="sm:col-span-2">Entreprise individuelle — <em>{A_COMPLETER}</em></dd>
              <dt className="font-medium">Responsable de publication</dt><dd className="sm:col-span-2"><em>{A_COMPLETER} (nom du gérant)</em></dd>
              <dt className="font-medium">NIF</dt><dd className="sm:col-span-2"><em>{A_COMPLETER}</em></dd>
              <dt className="font-medium">STAT</dt><dd className="sm:col-span-2"><em>{A_COMPLETER}</em></dd>
              <dt className="font-medium">Adresse</dt><dd className="sm:col-span-2">{CONTACT.adresse}</dd>
              <dt className="font-medium">Téléphone</dt><dd className="sm:col-span-2">{CONTACT.telephonePrincipal.affichage} · {CONTACT.telephoneSecondaire.affichage}</dd>
              <dt className="font-medium">E-mail</dt><dd className="sm:col-span-2"><a href={`mailto:${CONTACT.email}`} className="inline-block py-1 underline">{CONTACT.email}</a></dd>
              <dt className="font-medium">Page Facebook</dt><dd className="sm:col-span-2"><a href={CONTACT.facebook} className="underline" target="_blank" rel="noopener noreferrer">Tsena Imprimante sy ny Tontolony eto Madagascar</a></dd>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><h2 className="text-xl font-semibold leading-none tracking-tight">2. Hébergement</h2></CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>o2switch SAS — Chemin des Pardiaux, 63000 Clermont-Ferrand, France — +33 4 44 44 60 40 — <a href="https://www.o2switch.fr" className="underline" target="_blank" rel="noopener noreferrer">o2switch.fr</a>.</p>
            <p>Le nom de domaine <code>fonenako.mg</code> est enregistré auprès du NIC-MG.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><h2 className="text-xl font-semibold leading-none tracking-tight">3. Nature du site et des offres</h2></CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Ce site présente les imprimantes et consommables vendus par {CONTACT.nom}, avec leurs prix en ariary toutes taxes comprises. Il ne réalise aucun paiement en ligne : une commande passée sur le site est une demande, confirmée ensuite par téléphone (disponibilité, délai, mode de paiement). Les <Link to="/terms" className="underline">conditions générales de vente</Link> s'appliquent.</p>
            <p>Les prix et disponibilités sont mis à jour régulièrement mais peuvent varier ; le prix confirmé par téléphone ou sur le devis fait foi. Les photos sont non contractuelles.</p>
            <p>Les marques citées (Canon, HP, Epson) appartiennent à leurs propriétaires respectifs ; {CONTACT.nom} est un revendeur indépendant.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><h2 className="text-xl font-semibold leading-none tracking-tight">4. Propriété intellectuelle</h2></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Les textes, la structure et les visuels créés pour ce site sont la propriété de {CONTACT.nom}. Toute reproduction à des fins commerciales sans accord écrit est interdite. Les photos de produits proviennent des fabricants ou de nos propres prises de vue.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><h2 className="text-xl font-semibold leading-none tracking-tight">5. Données personnelles et cookies</h2></CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Les données saisies dans les formulaires (nom, téléphone, e-mail, message, produits demandés) servent uniquement à répondre à votre demande. Elles sont traitées conformément à la loi n° 2014-038 relative à la protection des données à caractère personnel. Le site ne dépose aucun cookie ; la mesure d'audience est anonyme.</p>
            <p>Vos droits (accès, rectification, suppression, opposition) s'exercent par e-mail ou téléphone. Détail dans la <Link to="/privacy" className="underline">politique de confidentialité</Link>.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><h2 className="text-xl font-semibold leading-none tracking-tight">6. Droit applicable et litiges</h2></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Le site et les ventes sont soumis au droit malgache, notamment aux lois n° 2014-024 (transactions électroniques) et n° 2015-014 (garanties et protection des consommateurs). En cas de litige, nous privilégions une solution amiable ; à défaut, les tribunaux d'Antananarivo sont compétents.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><h2 className="text-xl font-semibold leading-none tracking-tight">7. Crédits</h2></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Site conçu et maintenu par l'équipe Fonenako pour {CONTACT.nom}. Icônes : Lucide (licence ISC). Composants : shadcn/ui (MIT).</p>
          </CardContent>
        </Card>
      </div>
    </main>
    <Footer />
  </div>
);

export default MentionsLegales;
