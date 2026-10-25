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
import type { InvoiceData } from "@/utils/pdfGenerator";
import type jsPDF from 'jspdf';
import { toast } from "sonner";
import { CONTACT, lienWhatsApp, appeler } from "@/config/contact";
import FenetreProforma from "@/components/FenetreProforma";
import { envoyerLead, telephoneValide } from "@/lib/leads";
import { evenement } from "@/lib/mesure";

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
  // Fenêtre « télécharger / envoyer sur WhatsApp » ouverte à la génération (Andry, 13/10/2026)
  const [fenetreOuverte, setFenetreOuverte] = useState(false);
  const [numeroProforma, setNumeroProforma] = useState("");

  const regions = deliveryRates.map(rate => rate.region);

  const handleCall = () => {
    evenement("clic_appel", { ou: "devis" });
    appeler();
  };

  const handleWhatsApp = (message: string) => {
    evenement("clic_whatsapp", { ou: "devis" });
    window.open(lienWhatsApp(message), '_blank', 'noopener');
  };

  const validatePhone = (phone: string) => telephoneValide(phone);

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

  const generateProformaInvoice = async () => {
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

    // Chargement à la volée de jsPDF (retiré du bundle initial)
    const { PDFGenerator } = await import("@/utils/pdfGenerator");

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
    setNumeroProforma(invoiceData.quoteNumber);
    setFenetreOuverte(true);
    evenement("devis_pdf", { n: formData.selectedProducts.length, total: calculateTotals.total });

    // Audit 06/09/2026 : la demande de devis est aussi ENREGISTRÉE côté serveur
    // (avant, elle n'existait que sur l'appareil du client).
    const resultat = await envoyerLead({
      type: "devis",
      nom: formData.name,
      telephone: formData.phone,
      email: formData.email,
      entreprise: formData.company,
      region: formData.region,
      message: formData.message,
      produits: formData.selectedProducts.map(item => ({ id: item.product.id, nom: item.product.name, quantite: item.quantity, prix: item.product.priceMin })),
      livraison: `${formData.deliveryType} — ${formatPrice(calculateTotals.deliveryPrice)} MGA`,
      total: calculateTotals.total,
    });
    if (resultat.ok) {
      evenement("devis_envoye");
      toast.success(`Demande enregistrée (référence ${resultat.id})`, {
        description: "Nous vous rappelons pour confirmer disponibilité et délai."
      });
    } else {
      // Avant le 13/10/2026 l'échec ne produisait qu'un événement interne : le client repartait
      // avec son PDF en croyant sa demande partie, et personne n'était prévenu.
      evenement("formulaire_erreur", { f: "devis", e: resultat.erreur });
      toast.error("Votre facture est prête, mais la demande n'a pas pu nous être envoyée.", {
        description: "Envoyez-le-nous sur WhatsApp ou appelez-nous : on vous répond tout de suite.",
        duration: 12000,
        action: {
          label: "WhatsApp",
          onClick: () => window.open(
            lienWhatsApp(`Bonjour, je viens de faire un devis proforma sur le site au nom de ${formData.name}. Pouvez-vous me rappeler ?`),
            "_blank", "noopener"),
        },
      });
    }
  };

  const nomFichierPdf = `Facture-Proforma-${numeroProforma || "Tsena"}-${formData.name.trim().replace(/\s+/g, '-')}.pdf`;

  // Le message qui part avec le PDF vers le WhatsApp de Tsena : il porte le numéro de la
  // proforma, pour qu'on retrouve la bonne quand le client joint le fichier.
  const messageWhatsAppDevis = () =>
    `Bonjour ! Voici ma facture proforma ${numeroProforma} faite sur le site :\n\n` +
        `*DÉTAILS CLIENT:*\n` +
        `Nom: ${formData.name}\n` +
        `Téléphone: ${formData.phone}\n` +
        `Région: ${formData.region}\n` +
        `${formData.company ? `Entreprise: ${formData.company}\n` : ''}` +
        `${formData.email ? `Email: ${formData.email}\n` : ''}\n` +
        `*PRODUITS DEMANDÉS:*\n${formData.selectedProducts.map(item =>
          `• ${item.product.name} - Qté: ${item.quantity} - ${formatPrice(item.product.priceMin * item.quantity)} MGA`
        ).join('\n')}\n\n` +
        `*RÉSUMÉ:*\n` +
        `• Sous-total: ${formatPrice(calculateTotals.subtotal)} MGA\n` +
        `• Livraison: ${formatPrice(calculateTotals.deliveryPrice)} MGA\n` +
        `• *TOTAL: ${formatPrice(calculateTotals.total)} MGA*\n\n` +
        `*FACTURE PROFORMA:*\n` +
        `Je vous joins le PDF (${nomFichierPdf}).\n\n` +
        `Merci de me confirmer la disponibilité et les modalités de paiement !`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateProformaInvoice();
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
    <section className="bg-background py-8 sm:py-16">
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
                      // Le mode de livraison suit la ville choisie : il restait « taxi-brousse »
                      // pour Antananarivo, et le devis imprimait « Antananarivo · Taxi-brousse ·
                      // Installation gratuite le jour même » (vu sur un devis réel le 13/10/2026).
                      setFormData(prev => ({
                        ...prev,
                        region: value,
                        deliveryType: value === 'Antananarivo' ? 'local-tana' : 'taxi-brousse',
                      }))
                    }>
                      <SelectTrigger id="region" aria-label="Sélectionner votre région ou ville de livraison">
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
                        <Card key={option.type} className={`cursor-pointer transition-shadow ${
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
                        <Card key={product.id} className={`cursor-pointer transition-shadow ${isSelected ? 'ring-2 ring-primary' : ''}`}>
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <Checkbox
                                className="h-6 w-6"
                                checked={isSelected}
                                onCheckedChange={() => toggleProductSelection(product)}
                                aria-label={`Sélectionner ${product.name} pour le devis`}
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate">{product.name}</h4>
                                <p className="text-xs text-muted-foreground">{product.brand} • {product.weight}kg</p>
                                <p className="text-sm font-bold text-primary mt-1">
                                  {formatProductPrice(product.priceMin)}
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
                  {CONTACT.telephonePrincipal.affichage}
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

            {/* Actions PDF : rouvrir la fenêtre si on l'a fermée */}
            {generatedPdf && (
              <Card>
                <CardHeader>
                  <CardTitle>Facture {numeroProforma} générée</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={() => setFenetreOuverte(true)} className="w-full min-h-[44px]">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger ou envoyer sur WhatsApp
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <FenetreProforma
        ouverte={fenetreOuverte}
        onFermer={() => setFenetreOuverte(false)}
        pdf={generatedPdf}
        nomFichier={nomFichierPdf}
        numero={numeroProforma}
        total={`${formatPrice(calculateTotals.total)} MGA`}
        messageWhatsApp={generatedPdf ? messageWhatsAppDevis() : ""}
      />
    </section>
  );
};

export default ProformaQuoteForm;