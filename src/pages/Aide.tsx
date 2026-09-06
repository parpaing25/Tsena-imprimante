import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { LifeBuoy, Phone, MessageCircle, Wrench, Lightbulb, HelpCircle } from "lucide-react";
import { AIDE_FAQ, AIDE_CONSEILS, AIDE_PANNES } from "@/data/aide";
import { products, formatPrice } from "@/data/products";
import { CONTACT, appeler, lienWhatsApp, ouvrirMessenger } from "@/config/contact";
import { evenement } from "@/lib/mesure";

/**
 * Aide & dépannage. Audit 06/09/2026 : cette route portait un « forum
 * d'entraide » factice — trois discussions inventées (« Rakoto M., hier à
 * 14:30 »), des réponses signées « Équipe Tsena » jamais écrites par elle, et
 * des questions stockées dans le navigateur du visiteur, invisibles pour
 * Tsena. Remplacé par les réponses réelles du bot vendeur (même source), en
 * français et en malgache, plus un guide de dépannage.
 */
const Aide = () => {
  const [langue, setLangue] = useState<"fr" | "mg">("fr");
  const parId = new Map(products.map((p) => [p.id, p]));

  const jsonld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: AIDE_FAQ.map((e) => ({ "@type": "Question", name: e.question, acceptedAnswer: { "@type": "Answer", text: e.fr } })),
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Aide & dépannage imprimante | Tsena Imprimante Madagascar</title>
        <meta name="description" content="Kit externe, réservoir ou laser, livraison, garantie, consommables, pannes courantes : les réponses de Tsena Imprimante en français et en malgache." />
        <link rel="canonical" href="https://tsenaimprimante.fonenako.mg/aide" />
        <script type="application/ld+json">{JSON.stringify(jsonld)}</script>
      </Helmet>
      <Header />
      <main className="container mx-auto px-4 py-10 sm:py-14">
        <div className="text-center mb-10">
          <LifeBuoy className="h-12 w-12 text-primary mx-auto mb-4" aria-hidden="true" />
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-3">Aide & dépannage</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Les réponses que nous donnons chaque jour sur Messenger, ici en une page. Fitenin'ny mpanjifa : malagasy sy frantsay.
          </p>
          <div className="mt-5 inline-flex rounded-lg border p-1" role="group" aria-label="Langue des réponses">
            <Button size="sm" variant={langue === "fr" ? "default" : "ghost"} onClick={() => setLangue("fr")} aria-pressed={langue === "fr"}>Français</Button>
            <Button size="sm" variant={langue === "mg" ? "default" : "ghost"} onClick={() => setLangue("mg")} aria-pressed={langue === "mg"} lang="mg">Malagasy</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2 space-y-10">
            <section aria-labelledby="titre-questions">
              <h2 id="titre-questions" className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-primary" aria-hidden="true" />
                Questions des clients
              </h2>
              <Accordion type="single" collapsible className="space-y-2">
                {AIDE_FAQ.map((e) => (
                  <Card key={e.cle} id={e.cle}>
                    <AccordionItem value={e.cle} className="border-none">
                      <AccordionTrigger className="px-4 text-left">{e.question}</AccordionTrigger>
                      <AccordionContent className="px-4 text-muted-foreground" lang={langue}>
                        {langue === "fr" ? e.fr : e.mg}
                      </AccordionContent>
                    </AccordionItem>
                  </Card>
                ))}
              </Accordion>
            </section>

            <section aria-labelledby="titre-usages">
              <h2 id="titre-usages" className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-accent" aria-hidden="true" />
                Quel modèle pour quel usage ?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AIDE_CONSEILS.map((c) => (
                  <Card key={c.cle}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{c.titre}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground" lang={langue}>{langue === "fr" ? c.fr : c.mg}</p>
                      <ul className="space-y-1">
                        {c.modeles.map((id) => {
                          const p = parId.get(id);
                          if (!p) return null;
                          return (
                            <li key={id} className="flex items-center justify-between gap-2 text-sm">
                              <Link to={`/imprimantes/${p.id}`} className="inline-block py-1 font-medium hover:text-primary underline-offset-2 hover:underline">{p.name}</Link>
                              <Badge variant="outline">{formatPrice(p.priceMin)}</Badge>
                            </li>
                          );
                        })}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section aria-labelledby="titre-pannes">
              <h2 id="titre-pannes" className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Wrench className="h-6 w-6 text-success" aria-hidden="true" />
                Pannes courantes : que faire avant d'appeler
              </h2>
              <Accordion type="single" collapsible className="space-y-2">
                {AIDE_PANNES.map((p, i) => (
                  <Card key={i}>
                    <AccordionItem value={`panne-${i}`} className="border-none">
                      <AccordionTrigger className="px-4 text-left">{p.symptome}</AccordionTrigger>
                      <AccordionContent className="px-4">
                        <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                          {p.etapes.map((etape, j) => <li key={j}>{etape}</li>)}
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                  </Card>
                ))}
              </Accordion>
            </section>
          </div>

          <aside className="space-y-4" aria-label="Contact rapide">
            <Card className="lg:sticky lg:top-24">
              <CardHeader>
                <CardTitle className="text-xl">Une question précise ?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">Diagnostic par téléphone gratuit, réponse sur Messenger et WhatsApp pendant les heures d'ouverture.</p>
                <Button onClick={() => { evenement("clic_appel", { ou: "aide" }); appeler(); }} className="w-full btn-call">
                  <Phone className="h-4 w-4 mr-2" />
                  {CONTACT.telephonePrincipal.affichage}
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <a href={lienWhatsApp("Bonjour Tsena Imprimante, j'ai une question sur mon imprimante.")} target="_blank" rel="noopener noreferrer" onClick={() => evenement("clic_whatsapp", { ou: "aide" })}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </a>
                </Button>
                <Button variant="outline" className="w-full" onClick={() => { evenement("clic_messenger", { ou: "aide" }); ouvrirMessenger(); }}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Messenger
                </Button>
                <ul className="text-xs text-muted-foreground space-y-1 pt-2">
                  {CONTACT.horaires.map((h) => <li key={h.jours}><strong>{h.jours}</strong> : {h.heures}</li>)}
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Aide;
