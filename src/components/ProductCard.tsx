import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ShoppingCart, FileText, Wifi } from "lucide-react";
import { Product, formatPriceCourt, typeCourt, resumeCourt } from "@/data/products";
import PurchaseForm from "./PurchaseForm";

interface ProductCardProps {
  product: Product;
  onRequestQuote?: (productId: string) => void;
}

/**
 * Carte produit. Refonte mobile du 07/09/2026 : elle mesurait 548 px de haut,
 * soit 8 220 px pour les quinze modèles — un tiers de la page d'accueil. Sur
 * téléphone elle tombe à ~250 px dans une grille de deux colonnes : photo,
 * nom, une ligne d'essentiel, le prix, un bouton. Tout le reste (description,
 * caractéristiques, commande, devis, WhatsApp) vit sur la fiche
 * /imprimantes/:id, qui n'existait pas avant l'audit.
 *
 * À partir de `sm:` la carte reprend sa densité d'origine : rien ne change
 * pour un visiteur sur ordinateur.
 */
const ProductCard = ({ product, onRequestQuote }: ProductCardProps) => {
  const [isPurchaseFormOpen, setIsPurchaseFormOpen] = useState(false);
  const lien = `/imprimantes/${product.id}`;
  const aDeuxPrix = Boolean(product.priceMax && product.priceMax !== product.priceMin);

  return (
    <Card className="product-card group h-full flex flex-col overflow-hidden">
      <Link to={lien} className="relative block bg-muted" aria-label={`Voir la fiche ${product.name}`}>
        <img
          src={product.imageUrl}
          alt={product.name}
          width={400}
          height={192}
          loading="lazy"
          decoding="async"
          className="w-full h-[104px] sm:h-44 object-cover sm:object-contain bg-muted transition-opacity group-hover:opacity-90"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
        <div className="absolute top-1.5 left-1.5 flex flex-wrap gap-1">
          {product.isPopular && (
            <Badge className="bg-accent text-accent-foreground text-[10px] px-1.5 py-0.5 sm:text-xs sm:px-2.5">Populaire</Badge>
          )}
          {!product.inStock && (
            <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5 sm:text-xs">Rupture</Badge>
          )}
        </div>
        {product.hasWifi && (
          <span className="absolute top-1.5 right-1.5 flex items-center gap-1 rounded-full bg-background/90 px-1.5 py-0.5 text-[10px] font-medium text-foreground sm:text-xs">
            <Wifi className="h-3 w-3" aria-hidden="true" />
            Wi-Fi
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-2.5 sm:gap-2 sm:p-4">
        <h3 className="text-[13px] font-bold leading-tight text-card-foreground sm:text-base">
          <Link to={lien} className="inline-block py-1 hover:text-primary">{product.name}</Link>
        </h3>
        <p className="text-[11px] leading-snug text-muted-foreground sm:text-sm">
          {typeCourt(product)} · {resumeCourt(product)}
        </p>

        <div className="mt-auto pt-1">
          {aDeuxPrix && <span className="block text-[10px] leading-none text-muted-foreground sm:text-xs">dès</span>}
          <span className="text-base font-extrabold tracking-tight text-primary sm:text-xl">
            {formatPriceCourt(product.priceMin)}
          </span>
          {aDeuxPrix && (
            <span className="ml-1 hidden text-xs text-muted-foreground sm:inline">
              · avec kit {formatPriceCourt(product.priceMax!)}
            </span>
          )}
        </div>

        {/* Téléphone : une seule action, la fiche porte le reste */}
        <Button asChild size="sm" className="h-10 w-full text-[13px] font-bold sm:hidden">
          <Link to={lien}>Voir la fiche</Link>
        </Button>

        {/* Ordinateur : densité d'origine */}
        <div className="hidden gap-2 sm:grid">
          <Button onClick={() => setIsPurchaseFormOpen(true)} className="btn-call w-full" disabled={!product.inStock}>
            <ShoppingCart className="mr-2 h-4 w-4" aria-hidden="true" />
            Acheter
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => onRequestQuote?.(product.id)} className="btn-hero" size="sm" disabled={!product.inStock}>
              <FileText className="mr-1 h-4 w-4" aria-hidden="true" />
              Devis
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to={lien}>Détails</Link>
            </Button>
          </div>
        </div>
      </div>

      <PurchaseForm product={product} isOpen={isPurchaseFormOpen} onClose={() => setIsPurchaseFormOpen(false)} />
    </Card>
  );
};

export default ProductCard;
