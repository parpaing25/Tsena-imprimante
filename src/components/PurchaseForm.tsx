import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, MapPin, User, Phone, Mail } from "lucide-react";
import { Product } from "@/data/products";
import { useToast } from "@/hooks/use-toast";

interface PurchaseFormProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const PurchaseForm = ({ product, isOpen, onClose }: PurchaseFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    deliveryType: "", // "pickup" or "delivery"
    priceOption: "", // "simple" or "withKit"
    address: "",
    city: "",
    district: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation basique
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.deliveryType) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Validation pour le choix de prix si nécessaire
    if (product.priceMax && !formData.priceOption) {
      toast({
        title: "Erreur",
        description: "Veuillez choisir une option de prix",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (formData.deliveryType === "delivery" && (!formData.address || !formData.city)) {
      toast({
        title: "Erreur", 
        description: "Veuillez renseigner l'adresse de livraison",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Préparation du message pour Facebook
    const deliveryInfo = formData.deliveryType === "delivery" 
      ? `Livraison à: ${formData.address}, ${formData.city}${formData.district ? ", " + formData.district : ""}`
      : "Retrait en magasin";

    // Calcul du prix selon l'option choisie
    let selectedPrice = product.priceMin;
    let priceLabel = "";
    
    if (product.priceMax && formData.priceOption) {
      if (formData.priceOption === "simple") {
        selectedPrice = product.priceMin;
        priceLabel = " (Prix simple)";
      } else if (formData.priceOption === "withKit") {
        selectedPrice = product.priceMax;
        priceLabel = " (Avec kit externe)";
      }
    }

    const message = `🛒 NOUVELLE COMMANDE

📱 Produit: ${product.name} (${product.brand})
💰 Prix: ${selectedPrice.toLocaleString()} MGA${priceLabel}

👤 Client:
Nom: ${formData.firstName} ${formData.lastName}
Téléphone: ${formData.phone}
${formData.email ? `Email: ${formData.email}` : ''}

🚚 ${deliveryInfo}

${formData.notes ? `📝 Notes: ${formData.notes}` : ''}

---
Commande passée via le site web TSENA`;

    try {
      // Détecter si on est sur mobile ou desktop
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Sur mobile : envoyer via WhatsApp
        const whatsappNumber = "261327209033";
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
        
        toast({
          title: "Message envoyé !",
          description: "Votre commande a été envoyée via WhatsApp. Nous vous contacterons rapidement.",
        });
      } else {
        // Sur PC : envoyer par email
        const emailSubject = encodeURIComponent(`Nouvelle commande - ${product.name}`);
        const emailBody = encodeURIComponent(message);
        
        window.open(`mailto:tsenaimprimante@gmail.com?subject=${emailSubject}&body=${emailBody}`, '_blank');
        
        toast({
          title: "Email ouvert !",
          description: "Votre client email s'est ouvert avec la commande. Envoyez l'email pour finaliser.",
        });
      }

      // Reset du formulaire
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        deliveryType: "",
        priceOption: "",
        address: "",
        city: "",
        district: "",
        notes: ""
      });

      onClose();
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la commande. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Commande - {product.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations produit */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Produit sélectionné</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.brand}</p>
                  <p className="text-lg font-bold text-primary">
                    {product.priceMax 
                      ? `${product.priceMin.toLocaleString()} - ${product.priceMax.toLocaleString()} MGA`
                      : `À partir de ${product.priceMin.toLocaleString()} MGA`
                    }
                  </p>
                  {product.priceMax && (
                    <p className="text-xs text-muted-foreground">
                      Prix simple: {product.priceMin.toLocaleString()} MGA • Avec kit: {product.priceMax.toLocaleString()} MGA
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Options de prix si applicable */}
          {product.priceMax && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Options de prix</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={formData.priceOption}
                  onValueChange={(value) => handleInputChange("priceOption", value)}
                >
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="simple" id="simple" />
                      <div>
                        <Label htmlFor="simple" className="font-medium">Prix simple</Label>
                        <p className="text-sm text-muted-foreground">Imprimante seule</p>
                      </div>
                    </div>
                    <span className="font-bold text-primary">{product.priceMin.toLocaleString()} MGA</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="withKit" id="withKit" />
                      <div>
                        <Label htmlFor="withKit" className="font-medium">Avec kit externe</Label>
                        <p className="text-sm text-muted-foreground">Imprimante + kit complet</p>
                      </div>
                    </div>
                    <span className="font-bold text-primary">{product.priceMax.toLocaleString()} MGA</span>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {/* Informations client */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-4 w-4" />
                Vos informations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="Votre prénom"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Votre nom"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Votre numéro de téléphone"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email (optionnel)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Votre adresse email"
                />
              </div>
            </CardContent>
          </Card>

          {/* Options de livraison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Mode de récupération
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={formData.deliveryType}
                onValueChange={(value) => handleInputChange("deliveryType", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <Label htmlFor="pickup">Retrait en magasin (gratuit)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <Label htmlFor="delivery">Livraison à domicile</Label>
                </div>
              </RadioGroup>

              {formData.deliveryType === "delivery" && (
                <div className="space-y-4 mt-4 p-4 border rounded-lg bg-muted/50">
                  <div>
                    <Label htmlFor="address">Adresse de livraison *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Votre adresse complète"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Ville *</Label>
                      <Select onValueChange={(value) => handleInputChange("city", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir une ville" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="antananarivo">Antananarivo</SelectItem>
                          <SelectItem value="antsirabe">Antsirabe</SelectItem>
                          <SelectItem value="fianarantsoa">Fianarantsoa</SelectItem>
                          <SelectItem value="toamasina">Toamasina</SelectItem>
                          <SelectItem value="mahajanga">Mahajanga</SelectItem>
                          <SelectItem value="antsiranana">Antsiranana</SelectItem>
                          <SelectItem value="autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="district">Quartier/District</Label>
                      <Input
                        id="district"
                        value={formData.district}
                        onChange={(e) => handleInputChange("district", e.target.value)}
                        placeholder="Quartier ou district"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes supplémentaires (optionnel)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Toute information supplémentaire..."
              rows={3}
            />
          </div>

          {/* Boutons */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseForm;