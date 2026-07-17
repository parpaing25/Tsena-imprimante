import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Phone, 
  Mail, 
  Building, 
  MapPin, 
  FileText, 
  Send, 
  Download,
  MessageCircle,
  Plus,
  Minus,
  Truck,
  Clock,
  Plane,
  Car
} from "lucide-react";
import { products, Product, formatPrice as formatProductPrice } from "@/data/products";
import { deliveryRates, getDeliveryRate, calculateDeliveryPrice, formatPrice, DeliveryType, getDeliveryOptions } from "@/utils/deliveryRates";
import { PDFGenerator, InvoiceData } from "@/utils/pdfGenerator";
import jsPDF from 'jspdf';
import { toast } from "sonner";

interface SelectedProduct {
  product: Product;
  quantity: number;
}

interface QuoteFormData {
  name: string;
  company: string;
  phone: string;
  email: string;
  region: string;
  selectedProducts: SelectedProduct[];
  deliveryType: DeliveryType;
  distanceInTana: number; // Pour livraison locale Tana (0-5km)
  message: string;
}

const ProformaQuoteForm = () => {
  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    company: '',
    phone: '',
    email: '',
    region: '',
    selectedProducts: [],
    deliveryType: 'taxi-brousse',
    distanceInTana: 0,
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedPdf, setGeneratedPdf] = useState<jsPDF | null>(null);

  const regions = deliveryRates.map(rate => rate.region);

  const handleCall = () => {
    window.location.href = "tel:+261337106334";
  };

  const handleWhatsApp = (message: string) => {
    const whatsappUrl = `https://wa.me/261327209033?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^(032|033|034|038)\s?\d{2}\s?\d{3}\s?\d{2}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const toggleProductSelection = (product: Product) => {
    setFormData(prev => {
      const existingIndex = prev.selectedProducts.findIndex(p => p.product.id === product.id);
      
      if (existingIndex >= 0) {
        // Remove product
        return {
          ...prev,
          selectedProducts: prev.selectedProducts.filter(p => p.product.id !== product.id)
        };
      } else {
        // Add product with quantity 1
        return {
          ...prev,
          selectedProducts: [...prev.selectedProducts, { product, quantity: 1 }]
        };
      }
    });
  };

  const updateProductQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setFormData(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    }));
  };

  const calculateTotals = useMemo(() => {
    const subtotal = formData.selectedProducts.reduce((sum, item) => {
      return sum + (item.product.priceMin * item.quantity);
    }, 0);

    const totalWeight = formData.selectedProducts.reduce((weight, item) => {
      return weight + (item.product.weight * item.quantity);
    }, 0);

    const totalQuantity = formData.selectedProducts.reduce((count, item) => {
      return count + item.quantity;
    }, 0);

    const deliveryPrice = formData.region ? 
      calculateDeliveryPrice(formData.region, totalWeight, formData.deliveryType, formData.distanceInTana, totalQuantity) : 0;

    const total = subtotal + deliveryPrice;

    return { subtotal, deliveryPrice, total, totalWeight, totalQuantity };
  }, [formData.selectedProducts, formData.region, formData.deliveryType, formData.distanceInTana]);

  const generateProformaInvoice = () => {
    if (formData.selectedProducts.length === 0) {
      toast.error("Veuillez sélectionner au moins un produit");
      return;
    }

    if (!formData.name || !formData.phone || !formData.region) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    if (!validatePhone(formData.phone)) {
      toast.error("Numéro de téléphone invalide");
      return;
    }

    const invoiceData: InvoiceData = {
      quoteNumber: PDFGenerator.generateQuoteNumber(),
      date: new Date().toLocaleDateString('fr-FR'),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
      customer: {
        name: formData.name,
        company: formData.company,
        phone: formData.phone,
        email: formData.email,
        region: formData.region
      },
      products: formData.selectedProducts.map(item => ({
        product: item.product,
        quantity: item.quantity,
        unitPrice: item.product.priceMin,
        total: item.product.priceMin * item.quantity
      })),
      deliveryType: formData.deliveryType,
      deliveryPrice: calculateTotals.deliveryPrice,
      subtotal: calculateTotals.subtotal,
      total: calculateTotals.total,
      notes: formData.message
    };

    const pdf = PDFGenerator.generateInvoice(invoiceData);
    setGeneratedPdf(pdf);

    toast.success("Facture proforma générée !", {
      description: "Vous pouvez maintenant la télécharger ou l'envoyer par WhatsApp."
    });
  };

  const downloadPdf = () => {
    if (generatedPdf) {
      generatedPdf.save(`Facture-Proforma-${formData.name.replace(/\s+/g, '-')}.pdf`);
      toast.success("Facture téléchargée !");
    }
  };

  const sendViaWhatsApp = () => {
    if (generatedPdf) {
      // D'abord télécharger le PDF automatiquement
      generatedPdf.save(`Facture-Proforma-${formData.name.replace(/\s+/g, '-')}.pdf`);
      
      // Ensuite envoyer le message WhatsApp avec les instructions
      const message = `Bonjour ! Voici ma demande de devis pour les imprimantes sélectionnées:\n\n` +
        `📋 *DÉTAILS CLIENT:*\n` +
        `Nom: ${formData.name}\n` +
        `Téléphone: ${formData.phone}\n` +
        `Région: ${formData.region}\n` +
        `${formData.company ? `Entreprise: ${formData.company}\n` : ''}` +
        `${formData.email ? `Email: ${formData.email}\n` : ''}\n` +
        `🛒 *PRODUITS COMMANDÉS:*\n${formData.selectedProducts.map(item => 
          `• ${item.product.name} - Qté: ${item.quantity} - ${formatPrice(item.product.priceMin * item.quantity)} MGA`
        ).join('\n')}\n\n` +
        `💰 *RÉSUMÉ FINANCIER:*\n` +
        `• Sous-total: ${formatPrice(calculateTotals.subtotal)} MGA\n` +
        `• Livraison: ${formatPrice(calculateTotals.deliveryPrice)} MGA\n` +
        `• *TOTAL: ${formatPrice(calculateTotals.total)} MGA*\n\n` +
        `📄 *FACTURE PROFORMA:*\n` +
        `J'ai téléchargé la facture proforma PDF sur mon appareil. Je vais vous l'envoyer dans le prochain message.\n\n` +
        `Merci de me confirmer la disponibilité et les modalités de paiement ! 🙏`;

      handleWhatsApp(message);
      
      // Notifier l'utilisateur
      toast.success("PDF téléchargé !", {
        description: "Le PDF a été téléchargé. Envoyez-le manuellement via WhatsApp après avoir envoyé le message."
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    generateProformaInvoice();
  };

  const deliveryOptions = formData.region ? getDeliveryOptions(formData.region) : [];

  const getDeliveryIcon = (type: DeliveryType) => {
    switch (type) {
      case 'local-tana': return <Car className="h-4 w-4" />;
      case 'plane': return <Plane className="h-4 w-4" />;
      case 'taxi-brousse': return <Car className="h-4 w-4" />;
      case 'rapid-service': return <Truck className="h-4 w-4" />;
      default: return <Truck className="h-4 w-4" />;
    }
  };

  return (
    <section id="devis" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Demander une Facture Proforma
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sélectionnez vos produits et obtenez une facture proforma professionnelle en PDF
            avec calcul automatique des frais de livraison selon le poids et la distance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Sélection des produits */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Sélectionnez vos produits</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informations client */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Entreprise/École</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Nom de votre entreprise (optionnel)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="033 XX XXX XX"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">Région/Ville *</Label>
                    <Select value={formData.region} onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, region: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-md z-50">
                        {regions.map(region => (
                          <SelectItem key={region} value={region}>{region}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Options de livraison */}
                {formData.region && (
                  <div className="space-y-4">
                    <Label>Type de livraison</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {deliveryOptions.map((option) => (
                        <Card key={option.type} className={`cursor-pointer transition-all ${
                          formData.deliveryType === option.type ? 'ring-2 ring-primary' : ''
                        }`}>
                          <CardContent className="p-4">
                            <label className="flex items-start space-x-3 cursor-pointer">
                              <input
                                type="radio"
                                name="deliveryType"
                                value={option.type}
                                checked={formData.deliveryType === option.type}
                                onChange={(e) => setFormData(prev => ({ 
                                  ...prev, 
                                  deliveryType: e.target.value as DeliveryType 
                                }))}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  {getDeliveryIcon(option.type)}
                                  <span className="font-semibold">{option.name}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-1">
                                  {option.description}
                                </p>
                                <div className="text-sm">
                                  {option.price && (
                                    <span className="font-medium text-primary">{option.price}</span>
                                  )}
                                  {option.priceRange && (
                                    <span className="font-medium text-primary">{option.priceRange}</span>
                                  )}
                                  {option.priceInfo && (
                                    <span className="text-muted-foreground">{option.priceInfo}</span>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  <Clock className="h-3 w-3 inline mr-1" />
                                  {option.estimatedDays}
                                </p>
                              </div>
                            </label>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Distance pour livraison locale Tana */}
                    {formData.deliveryType === 'local-tana' && formData.region === 'Antananarivo' && (
                      <div className="space-y-2">
                        <Label htmlFor="distance">Distance du centre-ville (0-5km)</Label>
                        <Input
                          id="distance"
                          type="number"
                          min="0"
                          max="5"
                          step="0.5"
                          value={formData.distanceInTana}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            distanceInTana: parseFloat(e.target.value) || 0 
                          }))}
                          placeholder="Distance en km"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Produits disponibles */}
                <div className="space-y-4">
                  <Label>Produits disponibles</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {products.slice(0, 12).map(product => {
                      const isSelected = formData.selectedProducts.some(p => p.product.id === product.id);
                      const selectedItem = formData.selectedProducts.find(p => p.product.id === product.id);
                      
                      return (
                        <Card key={product.id} className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}>
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleProductSelection(product)}
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate">{product.name}</h4>
                                <p className="text-xs text-muted-foreground">{product.brand} • {product.weight}kg</p>
                                <p className="text-sm font-bold text-primary mt-1">
                                  {formatProductPrice(product.priceMin)} MGA
                                </p>
                                {isSelected && selectedItem && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => updateProductQuantity(product.id, selectedItem.quantity - 1)}
                                      disabled={selectedItem.quantity <= 1}
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="w-8 text-center">{selectedItem.quantity}</span>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => updateProductQuantity(product.id, selectedItem.quantity + 1)}
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Informations supplémentaires, questions spécifiques..."
                    rows={3}
                  />
                </div>

                {/* Bouton de génération */}
                <Button 
                  type="submit" 
                  className="btn-hero w-full"
                  disabled={formData.selectedProducts.length === 0 || isSubmitting}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Générer la Facture Proforma
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Résumé et actions */}
          <div className="space-y-6">
            {/* Contact rapide */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-success" />
                  Contact Direct
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleCall} className="btn-call w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  033 71 063 34
                </Button>
                <p className="text-sm text-muted-foreground">
                  Appelez-nous pour un devis immédiat et des conseils personnalisés.
                </p>
              </CardContent>
            </Card>

            {/* Résumé de la commande */}
            {formData.selectedProducts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Résumé</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.selectedProducts.map(item => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span>{item.product.name} x{item.quantity}</span>
                      <span>{formatPrice(item.product.priceMin * item.quantity)} MGA</span>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Sous-total:</span>
                      <span>{formatPrice(calculateTotals.subtotal)} MGA</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantité totale:</span>
                      <span>{calculateTotals.totalQuantity} imprimante{calculateTotals.totalQuantity > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Livraison:</span>
                      <span>{formatPrice(calculateTotals.deliveryPrice)} MGA</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-primary">{formatPrice(calculateTotals.total)} MGA</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions PDF */}
            {generatedPdf && (
              <Card>
                <CardHeader>
                  <CardTitle>Facture générée</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={downloadPdf} className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger PDF
                  </Button>
                  <Button onClick={sendViaWhatsApp} className="w-full bg-green-600 hover:bg-green-700">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Envoyer via WhatsApp
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProformaQuoteForm;