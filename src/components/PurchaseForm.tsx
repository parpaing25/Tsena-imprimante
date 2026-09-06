import { useState, useEffect } from "react";
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
import { CONTACT, lienWhatsApp, appeler } from "@/config/contact";
import { envoyerLead, telephoneValide } from "@/lib/leads";
import { evenement } from "@/lib/mesure";

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
  const [confirmation, setConfirmation] = useState<{ reference: string; message: string } | null>(null);
  const [pieges, setPieges] = useState("");

  useEffect(() => {
    if (!isOpen) setConfirmation(null);
  }, [isOpen]);

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

    if (!telephoneValide(formData.phone)) {
      toast({
        title: "Numéro invalide",
        description: "Un numéro malgache : 032, 033, 034, 037 ou 038 suivi de 7 chiffres.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const deliveryInfo = formData.deliveryType === "delivery"
      ? `Livraison : ${formData.address}, ${formData.city}${formData.district ? ", " + formData.district : ""}`
      : "Retrait (lieu et heure à convenir)";

    let selectedPrice = product.priceMin;
    let priceLabel = "";
    if (product.priceMax && formData.priceOption) {
      if (formData.priceOption === "simple") {
        selectedPrice = product.priceMin;
        priceLabel = "sans kit";
      } else if (formData.priceOption === "withKit") {
        selectedPrice = product.priceMax;
        priceLabel = "avec kit externe";
      }
    }

    // Audit 06/09/2026 : la commande est d'abord ENREGISTRÉE au serveur
    // (api/lead.php → e-mail + Telegram), puis WhatsApp est proposé comme
    // second canal. Avant, seul un onglet WhatsApp s'ouvrait (vers un numéro
    // absent de la page Facebook) et le site affichait « Message envoyé ».
    const resultat = await envoyerLead(
      {
        type: "commande",
        nom: `${formData.firstName} ${formData.lastName}`.trim(),
        telephone: formData.phone,
        email: formData.email,
        message: formData.notes,
        produits: [{ id: product.id, nom: product.name, quantite: 1, prix: selectedPrice, option: priceLabel }],
        livraison: deliveryInfo,
        total: selectedPrice,
      },
      pieges
    );
    setIsSubmitting(false);

    const message = [
      "NOUVELLE COMMANDE (site web)",
      resultat.id ? `Référence : ${resultat.id}` : "",
      `Produit : ${product.name} (${product.brand})`,
      `Prix : ${selectedPrice.toLocaleString("fr-FR")} Ar${priceLabel ? " " + priceLabel : ""}`,
      `Client : ${formData.firstName} ${formData.lastName}`,
      `Téléphone : ${formData.phone}`,
      formData.email ? `E-mail : ${formData.email}` : "",
      deliveryInfo,
      formData.notes ? `Notes : ${formData.notes}` : "",
    ].filter(Boolean).join("\n");

    if (resultat.ok) {
      evenement("commande_envoyee", { produit: product.id });
      setConfirmation({ reference: resultat.id || "ok", message });
    } else {
      evenement("formulaire_erreur", { f: "commande", e: resultat.erreur });
      toast({
        title: "Enregistrement impossible pour le moment",
        description: "Envoyez votre commande sur WhatsApp avec le bouton ci-dessous, ou appelez-nous.",
        variant: "destructive",
      });
      setConfirmation({ reference: "", message });
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

        {confirmation ? (
          <div className="space-y-4" role="status" aria-live="polite">
            {confirmation.reference ? (
              <>
                <h3 className="text-xl font-semibold text-success">Commande bien reçue — misaotra !</h3>
                <p className="text-muted-foreground">
                  Référence <strong>{confirmation.reference}</strong>. Nous vous appelons pour confirmer la
                  disponibilité, le paiement et la livraison. Aucun paiement n'est demandé en ligne.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold">Votre commande est prête à envoyer</h3>
                <p className="text-muted-foreground">Le serveur n'a pas répondu : envoyez-la sur WhatsApp, elle nous arrive directement.</p>
              </>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="btn-call">
                <a href={lienWhatsApp(confirmation.message)} target="_blank" rel="noopener noreferrer" onClick={() => evenement("clic_whatsapp", { ou: "commande" })}>
                  Continuer sur WhatsApp
                </a>
              </Button>
              <Button variant="outline" onClick={() => { evenement("clic_appel", { ou: "commande" }); appeler(); }}>
                Appeler le {CONTACT.telephonePrincipal.affichage}
              </Button>
              <Button variant="ghost" onClick={() => { setConfirmation(null); onClose(); }}>Fermer</Button>
            </div>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden="true">
            <label htmlFor="site_web_commande">Ne pas remplir</label>
            <input id="site_web_commande" name="site_web" type="text" tabIndex={-1} autoComplete="off" value={pieges} onChange={(e) => setPieges(e.target.value)} />
          </div>
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
                  width={80}
                  height={80}
                  loading="lazy"
                  decoding="async"
                  className="w-20 h-20 object-contain rounded-lg bg-muted"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
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
                  placeholder="034 XX XXX XX"
                  inputMode="tel"
                  autoComplete="tel"
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
                  <Label htmlFor="pickup">Retrait (lieu et heure convenus par téléphone)</Label>
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
                        <SelectTrigger id="city" aria-label="Choisir une ville de livraison">
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
              {isSubmitting ? "Envoi en cours..." : "Envoyer la commande"}
            </Button>
          </div>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseForm;