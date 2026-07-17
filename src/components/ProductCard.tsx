import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ShoppingCart, FileText, Wifi, Printer, Zap } from "lucide-react";
import { Product, formatPrice } from "@/data/products";
import PurchaseForm from "./PurchaseForm";
import ImageLightbox from "./ImageLightbox";

interface ProductCardProps {
  product: Product;
  onRequestQuote?: (productId: string) => void;
  onViewDetails?: (productId: string) => void;
}

const ProductCard = ({ product, onRequestQuote, onViewDetails }: ProductCardProps) => {
  const [isPurchaseFormOpen, setIsPurchaseFormOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handlePurchase = () => {
    setIsPurchaseFormOpen(true);
  };

  const handleQuoteRequest = () => {
    onRequestQuote?.(product.id);
  };

  const handleViewDetails = () => {
    onViewDetails?.(product.id);
  };

  const handleImageClick = () => {
    setLightboxOpen(true);
  };

  const getPriceDisplay = () => {
    if (product.priceMax) {
      return `${formatPrice(product.priceMin)} - ${formatPrice(product.priceMax)}`;
    }
    return `À partir de ${formatPrice(product.priceMin)}`;
  };

  const getTypeIcon = () => {
    switch (product.type) {
      case 'tank':
        return <Zap className="h-4 w-4" />;
      case 'laser':
        return <Printer className="h-4 w-4" />;
      default:
        return <Printer className="h-4 w-4" />;
    }
  };

  const getTypeLabel = () => {
    switch (product.type) {
      case 'tank':
        return 'EcoTank';
      case 'laser':
        return 'Laser';
      case 'inkjet':
        return 'Jet d\'encre';
      default:
        return 'Imprimante';
    }
  };

  return (
    <Card className="product-card group h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="relative">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-48 object-contain rounded-lg bg-muted cursor-pointer hover:opacity-90 transition-opacity"
            onClick={handleImageClick}
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500&h=400&fit=crop";
            }}
          />
          <div className="absolute top-2 left-2 flex gap-1">
            {product.isPopular && (
              <Badge className="bg-accent text-accent-foreground">Populaire</Badge>
            )}
            {!product.inStock && (
              <Badge variant="destructive">Rupture</Badge>
            )}
            {product.kitIncluded && (
              <Badge variant="secondary">Kit inclus</Badge>
            )}
          </div>
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="bg-white/90">
              {getTypeIcon()}
              <span className="ml-1">{getTypeLabel()}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {product.brand} • {product.isMultifunction ? 'Multifonction' : 'Imprimante seule'}
            </p>
          </div>

          <div className="flex flex-wrap gap-1">
            {product.hasWifi && (
              <Badge variant="outline" className="text-xs">
                <Wifi className="h-3 w-3 mr-1" />
                Wi-Fi
              </Badge>
            )}
            {product.colorPrint && (
              <Badge variant="outline" className="text-xs">Couleur</Badge>
            )}
            {product.hasADF && (
              <Badge variant="outline" className="text-xs">ADF</Badge>
            )}
            {product.hasDuplex && (
              <Badge variant="outline" className="text-xs">Duplex</Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>

          <div className="text-lg font-bold text-primary">
            {getPriceDisplay()}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 space-y-2">
        <div className="grid grid-cols-1 gap-2 w-full">
          <Button 
            onClick={handlePurchase}
            className="btn-call w-full"
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Acheter
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={handleQuoteRequest}
              className="btn-hero"
              size="sm"
              disabled={!product.inStock}
            >
              <FileText className="h-4 w-4 mr-1" />
              Devis
            </Button>
            <Button 
              onClick={handleViewDetails}
              variant="outline"
              size="sm"
            >
              Détails
            </Button>
          </div>
        </div>
      </CardFooter>

      <PurchaseForm 
        product={product}
        isOpen={isPurchaseFormOpen}
        onClose={() => setIsPurchaseFormOpen(false)}
      />

      <ImageLightbox
        imageUrl={product.imageUrl}
        alt={product.name}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </Card>
  );
};

export default ProductCard;