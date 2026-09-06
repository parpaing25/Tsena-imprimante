import { Helmet } from "react-helmet-async";
import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductCatalog from "@/components/ProductCatalog";
import SectionDevis from "@/components/SectionDevis";
import { Card, CardContent } from "@/components/ui/card";
import { Truck, ShieldCheck, Wrench, Printer, Zap, Wifi, ChevronRight } from "lucide-react";
import { products, formatPriceCourt } from "@/data/products";

const ContactSection = lazy(() => import("@/components/ContactSection"));
const Footer = lazy(() => import("@/components/Footer"));

// Réserve la place (anti-CLS) et conserve l'ancre de défilement pendant le chargement du chunk
const SectionFallback = ({ id, className = "" }: { id?: string; className?: string }) => (
  <div id={id} className={className} aria-hidden="true" />
);

/**
 * Page d'accueil. Refonte mobile du 07/09/2026.
 *
 * Mesuré avant : 23 948 px sur un téléphone, soit 28,4 écrans, et le premier
 * produit à 3 503 px — quatre écrans de pouce avant de voir une imprimante.
 * Trois sections de plus d'un écran chacune (avantages, types, conseils)
 * s'intercalaient entre l'accroche et le catalogue.
 *
 * Après : le catalogue arrive juste sous l'accroche. Les avantages tiennent en
 * un bandeau de quatre pictogrammes, les types en trois lignes cliquables, le
 * devis se déplie à la demande. Trois blocs sont partis : les conseils (ils ont
 * leur page, /conseils), les logos de marques (déjà dans le bandeau), et les
 * témoignages — trois avis nominatifs et un « plus de 2000 clients depuis
 * 2019 » qu'aucune source ne confirmait, remplacés par les seuls chiffres
 * vérifiables que porte l'activité.
 */

const AVANTAGES = [
  { icone: Truck, couleur: "text-primary", titre: "Livraison", detail: "province", texte: "Nous livrons dans toute l'île, par taxi-brousse ou par avion." },
  { icone: ShieldCheck, couleur: "text-success", titre: "Installation", detail: "gratuite", texte: "À Tana : branchement, Wi-Fi, pilotes et premier test d'impression." },
  { icone: Wrench, couleur: "text-accent", titre: "SAV &", detail: "garantie", texte: "Neuf sous carton, garantie constructeur, diagnostic téléphonique gratuit." },
  { icone: Printer, couleur: "text-muted-foreground", titre: "Canon HP", detail: "Epson", texte: "Les trois marques que nous savons dépanner et approvisionner en encre." },
];

const prixMini = (filtre: (p: (typeof products)[number]) => boolean) =>
  formatPriceCourt(Math.min(...products.filter(filtre).map((p) => p.priceMin)));

const Index = () => {
  // Les prix d'appel se calculent sur le catalogue : une valeur écrite à la main
  // finit toujours par mentir (« à partir de 690 000 MGA » affiché pour une
  // gamme qui commence à 850 000, constaté le 06/09/2026).
  const TYPES = [
    {
      icone: Zap,
      teinte: "bg-accent/10 text-accent",
      titre: "Réservoir d'encre",
      texte: "Le coût par page le plus bas",
      prix: prixMini((p) => p.type === "tank"),
    },
    {
      icone: Printer,
      teinte: "bg-primary/10 text-primary",
      titre: "Laser",
      texte: "Noir et blanc rapide, gros volumes",
      prix: prixMini((p) => p.type === "laser"),
    },
    {
      icone: Wifi,
      teinte: "bg-success/10 text-success",
      titre: "Jet d'encre",
      texte: "Petits volumes, couleur et photo",
      prix: prixMini((p) => p.type === "inkjet"),
    },
  ];

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Tsena Imprimante Madagascar - Canon, HP, Epson | Livraison Province</title>
        <meta name="description" content="Imprimantes Canon, HP, Epson neuves à Madagascar : jet d'encre, laser, réservoir d'encre. Prix en ariary, livraison province, installation gratuite à Tana. Devis gratuit ☎ 033 71 063 34." />
        <meta property="og:title" content="Tsena Imprimante Madagascar — imprimantes Canon, HP, Epson" />
        <meta property="og:description" content="Prix en ariary, livraison province, installation gratuite à Tana. Devis gratuit ☎ 033 71 063 34." />
        <meta property="og:url" content="https://tsenaimprimante.fonenako.mg/" />
        <link rel="canonical" href="https://tsenaimprimante.fonenako.mg/" />
      </Helmet>
      <Header />
      <main>
        <HeroSection />

        {/* Bandeau de confiance : quatre pictogrammes sur téléphone, quatre cartes sur écran large */}
        <section className="border-b border-border bg-muted/40" aria-label="Nos engagements">
          <div className="container mx-auto px-2 sm:px-4 sm:py-14">
            <div className="grid grid-cols-4 gap-1 py-2.5 sm:hidden">
              {AVANTAGES.map((a) => (
                <div key={a.titre} className="flex flex-col items-center gap-1 text-center">
                  <a.icone className={`h-[19px] w-[19px] ${a.couleur}`} aria-hidden="true" />
                  <span className="text-[10.5px] font-semibold leading-tight text-foreground">
                    {a.titre}
                    <br />
                    {a.detail}
                  </span>
                </div>
              ))}
            </div>

            <div className="hidden sm:block">
              <div className="mb-10 text-center">
                <h2 className="mb-3 text-3xl font-bold text-primary">Pourquoi choisir Tsena Imprimante ?</h2>
                <p className="text-lg text-muted-foreground">Neuf sous carton, installé chez vous, garanti.</p>
              </div>
              <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                {AVANTAGES.map((a) => (
                  <Card key={a.titre} className="text-center transition-all duration-300 hover:shadow-medium">
                    <CardContent className="pt-6">
                      <a.icone className={`mx-auto mb-4 h-8 w-8 ${a.couleur}`} aria-hidden="true" />
                      <h3 className="mb-2 font-semibold">
                        {a.titre} {a.detail}
                      </h3>
                      <p className="text-sm text-muted-foreground">{a.texte}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Les produits, tout de suite */}
        <ProductCatalog />

        {/* Quel type choisir : trois lignes, prix calculés sur le catalogue */}
        <section className="bg-background py-6 sm:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-extrabold text-primary sm:text-center sm:text-3xl">
              Quel type choisir ?
            </h2>
            <p className="mt-1 text-[12.5px] text-muted-foreground sm:mt-3 sm:text-center sm:text-lg">
              Trois familles, trois usages. Notre guide compare le coût par page.
            </p>

            <div className="mt-3 flex flex-col gap-2 sm:mt-10 sm:grid sm:grid-cols-3 sm:gap-6">
              {TYPES.map((t) => (
                <Link
                  key={t.titre}
                  to="/conseils"
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary sm:flex-col sm:items-start sm:gap-3 sm:p-6"
                >
                  <span className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg sm:h-12 sm:w-12 ${t.teinte}`}>
                    <t.icone className="h-[19px] w-[19px] sm:h-6 sm:w-6" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14.5px] font-bold text-foreground sm:text-xl">{t.titre}</span>
                    <span className="block text-[11.5px] leading-snug text-muted-foreground sm:text-base">
                      {t.texte} · dès {t.prix}
                    </span>
                  </span>
                  <ChevronRight className="h-[18px] w-[18px] shrink-0 text-muted-foreground sm:hidden" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Devis proforma : replié sur téléphone, déplié sur écran large */}
        <SectionDevis />

        {/* Ce que nous pouvons prouver — et rien de plus */}
        <section className="bg-gradient-subtle py-6 sm:py-14">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-3 gap-2 sm:mx-auto sm:max-w-3xl sm:gap-6">
              <div className="rounded-xl border border-border bg-card p-3 text-center sm:p-6">
                <div className="text-xl font-extrabold leading-none text-primary sm:text-4xl">7 779</div>
                <div className="mt-1.5 text-[10.5px] leading-tight text-muted-foreground sm:mt-2 sm:text-sm">
                  abonnés sur notre page Facebook
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-3 text-center sm:p-6">
                <div className="text-xl font-extrabold leading-none text-primary sm:text-4xl">{products.length}</div>
                <div className="mt-1.5 text-[10.5px] leading-tight text-muted-foreground sm:mt-2 sm:text-sm">
                  modèles disponibles
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-3 text-center sm:p-6">
                <div className="text-xl font-extrabold leading-none text-success sm:text-4xl">24-48 h</div>
                <div className="mt-1.5 text-[10.5px] leading-tight text-muted-foreground sm:mt-2 sm:text-sm">
                  livraison à Antananarivo
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap justify-center gap-x-4 text-center text-[12px] sm:mt-8 sm:text-sm">
              <Link to="/aide" className="inline-flex min-h-[44px] items-center font-semibold text-primary hover:underline">
                Aide &amp; dépannage
              </Link>
              <Link to="/conseils" className="inline-flex min-h-[44px] items-center font-semibold text-primary hover:underline">
                Bien choisir
              </Link>
              <Link to="/faq" className="inline-flex min-h-[44px] items-center font-semibold text-primary hover:underline">
                Questions fréquentes
              </Link>
            </div>
          </div>
        </section>

        <Suspense fallback={<SectionFallback id="contact" className="min-h-[400px]" />}>
          <ContactSection />
        </Suspense>
      </main>
      <Suspense fallback={<SectionFallback className="min-h-[300px]" />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
