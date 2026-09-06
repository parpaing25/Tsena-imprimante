import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotFound from "./NotFound";
import PurchaseForm from "@/components/PurchaseForm";
import ImageLightbox from "@/components/ImageLightbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, FileText, Phone, MessageCircle, Wifi, Printer, Zap, Truck, ShieldCheck, ChevronRight, CheckCircle } from "lucide-react";
import { products, formatPrice, Product } from "@/data/products";
import { CONTACT, appeler, lienWhatsApp } from "@/config/contact";
import { evenement } from "@/lib/mesure";

const SITE = "https://tsenaimprimante.fonenako.mg";

const TYPE_LABEL: Record<Product["type"], string> = {
  inkjet: "Jet d'encre",
  laser: "Laser monochrome",
  tank: "Réservoir d'encre",
};

const TYPE_EXPLICATION: Record<Product["type"], string> = {
  inkjet: "Cartouches d'encre : prix d'achat bas, couleur et photo, idéal pour de petits volumes. Le kit externe (encre à la bouteille) fait chuter le coût par page.",
  laser: "Toner longue durée, impression rapide en noir et blanc : le bon choix pour la photocopie, les documents et les gros volumes de bureau.",
  tank: "Encre versée à la bouteille dans des réservoirs intégrés : plusieurs milliers de pages avec les bouteilles fournies, le coût par page le plus bas en couleur.",
};

const tronquer = (texte: string, max = 155) => (texte.length <= max ? texte : texte.slice(0, max - 1).replace(/\s+\S*$/, "") + "…");

/**
 * Fiche produit : une URL par imprimante (/imprimantes/:id).
 * Audit 06/09/2026 : les 15 produits n'existaient que dans un modal sans
 * adresse — impossible à partager sur Messenger, invisible pour Google et les
 * moteurs de réponse IA. Chaque fiche porte ses données structurées Product.
 */
const ProductPage = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const [commandeOuverte, setCommandeOuverte] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  if (!product) return <NotFound />;

  const url = `${SITE}/imprimantes/${product.id}`;
  const image = `${SITE}${product.imageUrl}`;
  const aDeuxPrix = Boolean(product.priceMax && product.priceMax !== product.priceMin);
  const titre = `${product.name} — ${formatPrice(product.priceMin)}${aDeuxPrix ? " à " + formatPrice(product.priceMax!) : ""} | Tsena Imprimante`;
  const description = tronquer(`${product.name} neuve à Madagascar : ${TYPE_LABEL[product.type].toLowerCase()}${product.hasWifi ? ", Wi-Fi" : ""}${product.isMultifunction ? ", impression copie scan" : ""}. ${formatPrice(product.priceMin)}${aDeuxPrix ? " sans kit, " + formatPrice(product.priceMax!) + " avec kit" : ""}. Livraison province, installation gratuite à Tana.`);

  const jsonld = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${url}#produit`,
      name: product.name,
      image,
      description: product.description,
      sku: product.id,
      mpn: product.model,
      brand: { "@type": "Brand", name: product.brand },
      category: `Imprimante ${TYPE_LABEL[product.type].toLowerCase()}`,
      url,
      weight: { "@type": "QuantitativeValue", value: product.weight, unitCode: "KGM" },
      offers: aDeuxPrix
        ? { "@type": "AggregateOffer", url, priceCurrency: "MGA", lowPrice: product.priceMin, highPrice: product.priceMax, offerCount: 2, availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/PreOrder", seller: { "@id": `${SITE}/#entreprise` } }
        : { "@type": "Offer", url, priceCurrency: "MGA", price: product.priceMin, availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/PreOrder", itemCondition: "https://schema.org/NewCondition", seller: { "@id": `${SITE}/#entreprise` } },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Imprimantes", item: `${SITE}/#catalogue` },
        { "@type": "ListItem", position: 3, name: product.name, item: url },
      ],
    },
  ];

  const messageWhatsApp = `Bonjour Tsena Imprimante, je suis intéressé(e) par la ${product.name} (${formatPrice(product.priceMin)}${aDeuxPrix ? " / " + formatPrice(product.priceMax!) + " avec kit" : ""}). Est-elle disponible ?`;

  const specs: { titre: string; valeur: string }[] = [
    { titre: "Type", valeur: TYPE_LABEL[product.type] },
    { titre: "Fonctions", valeur: product.isMultifunction ? "Impression, copie, scan" : "Impression seule" },
    { titre: "Couleur", valeur: product.colorPrint ? "Oui" : "Noir et blanc" },
    { titre: "Connexion", valeur: product.hasWifi ? "Wi-Fi + USB" : "USB" },
    { titre: "Recto-verso automatique", valeur: product.hasDuplex ? "Oui" : "Manuel" },
    { titre: "Chargeur de documents (ADF)", valeur: product.hasADF ? "Oui" : "Non" },
    { titre: "Formats", valeur: product.formats.join(", ") },
    { titre: "Volume conseillé", valeur: product.monthlyVolume },
    { titre: "Poids", valeur: `${product.weight} kg` },
    { titre: "Kit externe", valeur: product.kitIncluded ? "Inclus" : aDeuxPrix ? "En option (prix « avec kit »)" : "Sur demande" },
  ];

  const similaires = products.filter((p) => p.id !== product.id && (p.type === product.type || p.brand === product.brand)).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{titre}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="product" />
        <meta property="og:title" content={titre} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />
        <meta property="product:price:amount" content={String(product.priceMin)} />
        <meta property="product:price:currency" content="MGA" />
        <script type="application/ld+json">{JSON.stringify(jsonld)}</script>
      </Helmet>
      <Header />
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <nav aria-label="Fil d'Ariane" className="text-sm text-muted-foreground mb-6 flex flex-wrap items-center gap-1">
          <Link to="/" className="inline-block py-1 hover:text-primary">Accueil</Link>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <Link to="/#catalogue" className="inline-block py-1 hover:text-primary">Imprimantes</Link>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <span aria-current="page" className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="min-w-0">
            <button type="button" onClick={() => setLightbox(true)} className="block w-full rounded-xl bg-muted p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={`Agrandir la photo de la ${product.name}`}>
              <img src={product.imageUrl} alt={`${product.name} — imprimante ${TYPE_LABEL[product.type].toLowerCase()} ${product.brand}`} width={800} height={450} fetchPriority="high" decoding="async" className="w-full h-auto object-contain rounded-lg" />
            </button>
            <div className="flex flex-wrap gap-2 mt-4">
              {product.isPopular && <Badge className="bg-accent text-accent-foreground">Populaire</Badge>}
              {product.kitIncluded && <Badge variant="secondary">Kit externe inclus</Badge>}
              <Badge variant="outline">{product.type === "laser" ? <Printer className="h-3 w-3 mr-1" /> : <Zap className="h-3 w-3 mr-1" />}{TYPE_LABEL[product.type]}</Badge>
              {product.hasWifi && <Badge variant="outline"><Wifi className="h-3 w-3 mr-1" />Wi-Fi</Badge>}
              {product.hasDuplex && <Badge variant="outline">Recto-verso</Badge>}
              {product.hasADF && <Badge variant="outline">ADF</Badge>}
            </div>
          </div>

          <div className="min-w-0 space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-accent">{product.brand} · {product.model}</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-primary mt-1">{product.name}</h1>
              <p className="text-muted-foreground mt-2">{TYPE_EXPLICATION[product.type]}</p>
            </div>

            <Card className="border-primary/20">
              <CardContent className="pt-6 space-y-3">
                {aDeuxPrix ? (
                  <dl className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border p-3">
                      <dt className="text-xs text-muted-foreground">Sans kit</dt>
                      <dd className="text-2xl font-bold text-primary">{formatPrice(product.priceMin)}</dd>
                    </div>
                    <div className="rounded-lg border border-accent/40 bg-accent/5 p-3">
                      <dt className="text-xs text-muted-foreground">Avec kit externe monté</dt>
                      <dd className="text-2xl font-bold text-accent">{formatPrice(product.priceMax!)}</dd>
                    </div>
                  </dl>
                ) : (
                  <p className="text-3xl font-bold text-primary">{formatPrice(product.priceMin)}{product.kitIncluded && <span className="text-base font-normal text-muted-foreground"> kit externe inclus</span>}</p>
                )}
                <p className="text-sm text-muted-foreground">Prix TTC en ariary. {product.inStock ? "Disponible, neuve sous carton." : "Sur commande."} Paiement à la livraison, virement ou Mobile Money.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  <Button className="btn-call w-full" onClick={() => setCommandeOuverte(true)} disabled={!product.inStock}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Commander
                  </Button>
                  <Button asChild variant="outline" className="w-full border-[#25d366] text-[#075e54]">
                    <a href={lienWhatsApp(messageWhatsApp)} target="_blank" rel="noopener noreferrer" onClick={() => evenement("clic_whatsapp", { ou: "fiche", produit: product.id })}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Demander sur WhatsApp
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => { evenement("clic_appel", { ou: "fiche", produit: product.id }); appeler(); }}>
                    <Phone className="h-4 w-4 mr-2" />
                    {CONTACT.telephonePrincipal.affichage}
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/#devis">
                      <FileText className="h-4 w-4 mr-2" />
                      Devis proforma PDF
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li className="flex items-start gap-2"><Truck className="h-4 w-4 text-success mt-0.5" aria-hidden="true" />Livraison et installation gratuites à Antananarivo</li>
              <li className="flex items-start gap-2"><Truck className="h-4 w-4 text-success mt-0.5" aria-hidden="true" />Livraison en province (taxi-brousse ou avion)</li>
              <li className="flex items-start gap-2"><ShieldCheck className="h-4 w-4 text-success mt-0.5" aria-hidden="true" />Neuve sous carton, garantie constructeur, SAV</li>
              <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-success mt-0.5" aria-hidden="true" />Aucun paiement en ligne : nous vous appelons pour confirmer</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          <section className="lg:col-span-2 space-y-8" aria-labelledby="titre-details">
            <div>
              <h2 id="titre-details" className="text-2xl font-semibold mb-3">Description</h2>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-3">Points forts</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm"><CheckCircle className="h-4 w-4 text-primary mt-0.5" aria-hidden="true" />{f}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-3">Caractéristiques</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border rounded-lg">
                  <caption className="sr-only">Caractéristiques de la {product.name}</caption>
                  <tbody>
                    {specs.map((s) => (
                      <tr key={s.titre} className="border-b last:border-b-0">
                        <th scope="row" className="text-left font-medium p-3 bg-muted/40 w-1/2">{s.titre}</th>
                        <td className="p-3">{s.valeur}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <aside className="space-y-4" aria-labelledby="titre-similaires">
            <h2 id="titre-similaires" className="text-xl font-semibold">Vous hésitez ? Comparez</h2>
            {similaires.map((p) => (
              <Card key={p.id} className="hover:shadow-medium transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    <Link to={`/imprimantes/${p.id}`} className="inline-block py-1 hover:text-primary">{p.name}</Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-3">
                  <img src={p.imageUrl} alt="" width={96} height={54} loading="lazy" decoding="async" className="w-24 h-14 object-contain rounded bg-muted" />
                  <div className="text-sm">
                    <p className="font-semibold text-primary">{formatPrice(p.priceMin)}</p>
                    <p className="text-muted-foreground">{TYPE_LABEL[p.type]}{p.hasWifi ? " · Wi-Fi" : ""}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button asChild variant="outline" className="w-full">
              <Link to="/conseils">Guide : bien choisir son imprimante</Link>
            </Button>
          </aside>
        </div>
      </main>
      <Footer />

      <PurchaseForm product={product} isOpen={commandeOuverte} onClose={() => setCommandeOuverte(false)} />
      <ImageLightbox imageUrl={product.imageUrl} alt={product.name} isOpen={lightbox} onClose={() => setLightbox(false)} />
    </div>
  );
};

export default ProductPage;
