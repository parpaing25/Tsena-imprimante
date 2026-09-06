import { Button } from "@/components/ui/button";
import { Phone, Eye, MessageCircle, Zap } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { products, formatPriceCourt } from "@/data/products";
import ImageLightbox from "./ImageLightbox";
import { appeler, CONTACT } from "@/config/contact";
import { evenement } from "@/lib/mesure";

/**
 * Bandeau d'accueil. Refonte mobile du 07/09/2026.
 *
 * Avant : 964 px de haut sur un téléphone, et une colonne de grille
 * dimensionnée par le carrousel — 1 082 px de large dans un écran de 390 px,
 * donc un titre coupé et trois boutons qui paraissaient vides.
 *
 * Après : sur téléphone, ~340 px — le titre, une phrase, deux actions, trois
 * preuves. Le carrousel n'apparaît qu'à partir de `lg:`, là où il y a la place
 * pour lui ; sur téléphone ce sont les vraies cartes produit, juste en
 * dessous, qui montrent le catalogue.
 */
const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);
  const featuredProducts = products.filter((p) => p.isPopular).slice(0, 5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [featuredProducts.length]);

  const handleCall = () => {
    evenement("clic_appel", { ou: "hero" });
    appeler();
  };

  const versCatalogue = () => document.getElementById("catalogue")?.scrollIntoView({ behavior: "smooth" });

  const handleImageClick = (imageUrl: string, productName: string) => {
    setSelectedImage({ url: imageUrl, alt: productName });
    setLightboxOpen(true);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-hero lg:flex lg:min-h-[80vh] lg:items-center">
      {/* Photo produit en filigrane : elle donne le sujet sans coûter de la hauteur */}
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-primary/90 to-accent/70"></div>
        <div className="relative h-full">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-30" : "opacity-0"}`}
            >
              <img
                src={product.imageUrl}
                alt=""
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="container relative z-30 mx-auto px-4 py-6 lg:py-12">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Colonne texte */}
          <div className="min-w-0 text-white">
            <h1 className="text-[30px] font-extrabold leading-[1.12] tracking-tight sm:text-5xl md:text-6xl">
              <span className="block">Tongasoa</span>
              <span className="block text-accent-light">chez Tsena Imprimante</span>
            </h1>

            <p className="mt-2.5 max-w-md text-[14px] leading-relaxed text-white/90 sm:mt-4 sm:text-xl">
              Imprimantes neuves Canon, HP et Epson — prix en ariary, livrées partout à Madagascar.
            </p>

            <div className="mt-4 flex gap-2 sm:mt-6 sm:gap-4">
              <Button
                onClick={handleCall}
                className="h-12 flex-1 gap-2 rounded-lg bg-success text-[15px] font-bold text-success-foreground shadow-lg hover:bg-success/90 sm:h-14 sm:flex-none sm:px-6 sm:text-lg"
              >
                <Phone className="h-[17px] w-[17px]" aria-hidden="true" />
                {CONTACT.telephonePrincipal.affichage}
              </Button>
              <Button
                onClick={versCatalogue}
                variant="outline"
                className="h-12 rounded-lg border-[1.5px] border-white/40 bg-white/10 px-4 text-[15px] font-semibold text-white backdrop-blur-sm hover:bg-white hover:text-primary sm:h-14 sm:px-6 sm:text-lg"
              >
                <Eye className="mr-2 hidden h-5 w-5 sm:inline" aria-hidden="true" />
                Catalogue
              </Button>
            </div>

            <ul className="mt-3.5 flex flex-wrap gap-1.5 sm:mt-6 sm:gap-2">
              {["Neuf sous carton", "Installation gratuite à Tana", "Livraison province"].map((p) => (
                <li
                  key={p}
                  className="rounded-full bg-white/15 px-2.5 py-1 text-[11.5px] font-semibold text-white sm:px-3 sm:py-1.5 sm:text-sm"
                >
                  {p}
                </li>
              ))}
            </ul>

            <div className="mt-4 hidden items-center gap-6 text-sm text-white/80 sm:flex">
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4" aria-hidden="true" />
                {CONTACT.telephonePrincipal.affichage}
              </span>
              <a
                href={CONTACT.messenger}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[44px] items-center gap-2 transition-colors hover:text-accent-light"
                onClick={() => evenement("clic_messenger", { ou: "hero" })}
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Facebook Messenger
              </a>
            </div>
          </div>

          {/* Carrousel : ordinateur seulement. Sur téléphone, ce sont les vraies cartes qui suivent. */}
          <div className="relative hidden min-w-0 lg:block">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
              <h2 className="mb-4 flex items-center justify-center gap-2 text-center text-lg font-semibold text-white">
                <Zap className="h-4 w-4 text-accent-light" aria-hidden="true" />
                Nos imprimantes populaires
              </h2>

              <Carousel className="w-full">
                <CarouselContent>
                  {featuredProducts.map((product) => (
                    <CarouselItem key={product.id}>
                      <div className="flex flex-col items-center space-y-3 p-2 text-center text-white">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          width={272}
                          height={160}
                          loading="lazy"
                          decoding="async"
                          className="mb-3 h-40 w-72 cursor-pointer rounded-3xl object-contain shadow-xl transition-all duration-300 hover:scale-105"
                          onClick={() => handleImageClick(product.imageUrl, product.name)}
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                        <div className="space-y-1">
                          <h3 className="text-base font-bold leading-tight">{product.name}</h3>
                          <p className="text-xl font-bold text-accent-light">{formatPriceCourt(product.priceMin)}</p>
                        </div>
                        <Button size="sm" className="bg-accent px-4 text-white hover:bg-accent/90" onClick={versCatalogue}>
                          Voir le catalogue
                        </Button>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-1 h-8 w-8 border-white/30 bg-white/20 text-white hover:bg-white/30" />
                <CarouselNext className="right-1 h-8 w-8 border-white/30 bg-white/20 text-white hover:bg-white/30" />
              </Carousel>
            </div>
          </div>
        </div>
      </div>

      {selectedImage && (
        <ImageLightbox
          imageUrl={selectedImage.url}
          alt={selectedImage.alt}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </section>
  );
};

export default HeroSection;
