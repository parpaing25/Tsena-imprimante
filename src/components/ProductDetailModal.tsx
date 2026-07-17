import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Phone, 
  FileText, 
  Wifi, 
  Printer, 
  Zap, 
  Monitor, 
  Package, 
  Settings,
  Clock,
  Ruler,
  Weight,
  HardDrive,
  CheckCircle,
  X
} from "lucide-react";
import { Product, formatPrice } from "@/data/products";
import ImageLightbox from "./ImageLightbox";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestQuote?: (productId: string) => void;
}

const ProductDetailModal = ({ product, isOpen, onClose, onRequestQuote }: ProductDetailModalProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  
  if (!product) return null;

  const handleCall = () => {
    window.location.href = "tel:+261337106334";
  };

  const handleQuoteRequest = () => {
    onRequestQuote?.(product.id);
    onClose();
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
        return <Zap className="h-5 w-5" />;
      case 'laser':
        return <Printer className="h-5 w-5" />;
      default:
        return <Printer className="h-5 w-5" />;
    }
  };

  const getTypeLabel = () => {
    switch (product.type) {
      case 'tank':
        return 'Système EcoTank';
      case 'laser':
        return 'Technologie laser';
      case 'inkjet':
        return 'Jet d\'encre';
      default:
        return 'Imprimante';
    }
  };

  // Extract specifications from description
  const getSpecifications = () => {
    const specs = [];
    
    if (product.description.includes('Vitesse:')) {
      const speedMatch = product.description.match(/Vitesse: ([^.]+)/);
      if (speedMatch) specs.push({ label: 'Vitesse d\'impression', value: speedMatch[1] });
    }
    
    if (product.description.includes('Capacité:')) {
      const capacityMatch = product.description.match(/Capacité: ([^.]+)/);
      if (capacityMatch) specs.push({ label: 'Capacité papier', value: capacityMatch[1] });
    }
    
    if (product.description.includes('Dimensions:')) {
      const dimMatch = product.description.match(/Dimensions: ([^.]+)/);
      if (dimMatch) specs.push({ label: 'Dimensions', value: dimMatch[1] });
    }
    
    if (product.description.includes('Résolution')) {
      const resMatch = product.description.match(/Résolution ([^.]+)/);
      if (resMatch) specs.push({ label: 'Résolution', value: resMatch[1] });
    }
    
    if (product.description.includes('Interface')) {
      const interfaceMatch = product.description.match(/Interface ([^.]+)/);
      if (interfaceMatch) specs.push({ label: 'Connectivité', value: interfaceMatch[1] });
    }
    
    return specs;
  };

  const specifications = getSpecifications();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-primary">
              Détails du produit
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image et badges */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-80 object-contain rounded-lg bg-muted cursor-pointer hover:opacity-90 transition-opacity"
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
            </div>
            
            {/* Prix et CTA */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="text-3xl font-bold text-primary">
                    {getPriceDisplay()}
                  </div>
                  {product.kitIncluded && (
                    <p className="text-sm text-muted-foreground">Kit externe inclus</p>
                  )}
                  <div className="grid grid-cols-1 gap-3">
                    <Button 
                      onClick={handleQuoteRequest}
                      className="btn-hero w-full"
                      size="lg"
                      disabled={!product.inStock}
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      Demander un Devis
                    </Button>
                    <Button 
                      onClick={handleCall}
                      className="btn-call w-full"
                      size="lg"
                    >
                      <Phone className="h-5 w-5 mr-2" />
                      Appeler 033 71 063 34
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informations détaillées */}
          <div className="space-y-6">
            {/* En-tête produit */}
            <div>
              <h2 className="text-2xl font-bold text-card-foreground mb-2">
                {product.name}
              </h2>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="bg-primary/10">
                  {getTypeIcon()}
                  <span className="ml-2">{getTypeLabel()}</span>
                </Badge>
                <Badge variant="outline">
                  {product.brand}
                </Badge>
                <Badge variant="outline">
                  {product.isMultifunction ? 'Multifonction' : 'Imprimante seule'}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {product.description}
              </p>
            </div>

            <Separator />

            {/* Fonctionnalités */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  Fonctionnalités principales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Spécifications techniques */}
            {specifications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Spécifications techniques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {specifications.map((spec, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-sm font-medium">{spec.label}:</span>
                        <span className="text-sm text-muted-foreground">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Connectivité et options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-accent" />
                  Options disponibles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4" />
                    <span className="text-sm">
                      Wi-Fi: {product.hasWifi ? 'Oui' : 'Non'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4" />
                    <span className="text-sm">
                      ADF: {product.hasADF ? 'Oui' : 'Non'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span className="text-sm">
                      Duplex: {product.hasDuplex ? 'Oui' : 'Non'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Printer className="h-4 w-4" />
                    <span className="text-sm">
                      Couleur: {product.colorPrint ? 'Oui' : 'N&B uniquement'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Formats et volume */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Ruler className="h-4 w-4" />
                    Formats supportés
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {product.formats.map((format, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {format}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Clock className="h-4 w-4" />
                    Volume mensuel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {product.monthlyVolume}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <ImageLightbox
          imageUrl={product.imageUrl}
          alt={product.name}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;