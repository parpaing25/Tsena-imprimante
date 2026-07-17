import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, Building, MapPin, Printer, Send } from "lucide-react";
import { products } from "@/data/products";
import { toast } from "sonner";

interface QuoteFormData {
  name: string;
  company: string;
  phone: string;
  email: string;
  region: string;
  selectedProducts: string[];
  usage: string;
  monthlyVolume: string;
  message: string;
}

const QuoteForm = () => {
  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    company: '',
    phone: '',
    email: '',
    region: '',
    selectedProducts: [],
    usage: '',
    monthlyVolume: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const regions = [
    "Antananarivo", "Fianarantsoa", "Toamasina", "Mahajanga", 
    "Toliara", "Antsiranana", "Autre région"
  ];

  const usageTypes = [
    "Usage domestique", "Petit bureau", "École/Université", 
    "Grande entreprise", "Impression photos", "Documents juridiques"
  ];

  const volumeRanges = [
    "Moins de 100 pages/mois", "100-500 pages/mois", "500-1000 pages/mois",
    "1000-2000 pages/mois", "Plus de 2000 pages/mois"
  ];

  const handleCall = () => {
    window.location.href = "tel:+261337106334";
  };

  const validatePhone = (phone: string) => {
    // Basic Madagascar phone number validation
    const phoneRegex = /^(032|033|034|038)\s?\d{2}\s?\d{3}\s?\d{2}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhone(formData.phone)) {
      toast.error("Numéro de téléphone invalide", {
        description: "Veuillez saisir un numéro malgache valide (032, 033, 034, 038)"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Demande de devis envoyée !", {
        description: "Nous vous contacterons dans les plus brefs délais.",
        action: {
          label: "Appeler maintenant",
          onClick: handleCall
        }
      });

      // Reset form
      setFormData({
        name: '',
        company: '',
        phone: '',
        email: '',
        region: '',
        selectedProducts: [],
        usage: '',
        monthlyVolume: '',
        message: ''
      });

    } catch (error) {
      toast.error("Erreur lors de l'envoi", {
        description: "Veuillez réessayer ou nous appeler directement."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProductSelect = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.includes(productId)
        ? prev.selectedProducts.filter(id => id !== productId)
        : [...prev.selectedProducts, productId]
    }));
  };

  return (
    <section id="devis" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Demander un Devis Gratuit
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Obtenez rapidement un devis personnalisé pour vos besoins d'impression.
            Livraison en province • Installation gratuite à Tana
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-success" />
                Contact Direct
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Plus rapide par téléphone</h3>
                <Button onClick={handleCall} className="btn-call w-full mb-4">
                  <Phone className="h-4 w-4 mr-2" />
                  033 71 063 34
                </Button>
                <p className="text-sm text-muted-foreground">
                  Appelez-nous directement pour un conseil immédiat et un devis en temps réel.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-sm">Via Facebook Messenger</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm">Livraison toute l'île</span>
                </div>
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-primary" />
                  <span className="text-sm">Installation gratuite Tana</span>
                </div>
              </div>

              <div className="p-4 bg-gradient-subtle rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Misaotra !</h4>
                <p className="text-xs text-muted-foreground">
                  Nous répondons rapidement à toutes les demandes de devis. 
                  Votre satisfaction est notre priorité.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quote Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Formulaire de Devis</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info */}
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

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                {/* Region */}
                <div className="space-y-2">
                  <Label htmlFor="region">Région/Ville *</Label>
                  <Select value={formData.region} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, region: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre région" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map(region => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Product Selection */}
                <div className="space-y-3">
                  <Label>Imprimantes d'intérêt</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                    {products.slice(0, 10).map(product => (
                      <label key={product.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.selectedProducts.includes(product.id)}
                          onChange={() => handleProductSelect(product.id)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{product.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Usage & Volume */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="usage">Type d'usage</Label>
                    <Select value={formData.usage} onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, usage: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Comment comptez-vous l'utiliser ?" />
                      </SelectTrigger>
                      <SelectContent>
                        {usageTypes.map(usage => (
                          <SelectItem key={usage} value={usage}>{usage}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="volume">Volume mensuel estimé</Label>
                    <Select value={formData.monthlyVolume} onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, monthlyVolume: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Combien de pages par mois ?" />
                      </SelectTrigger>
                      <SelectContent>
                        {volumeRanges.map(volume => (
                          <SelectItem key={volume} value={volume}>{volume}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Décrivez vos besoins spécifiques, questions, ou toute autre information utile..."
                    rows={4}
                  />
                </div>

                {/* Submit */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button 
                    type="button"
                    onClick={handleCall}
                    className="btn-call w-full"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler Direct
                  </Button>
                  
                  <Button 
                    type="submit" 
                    className="btn-hero w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Envoyer la Demande
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  En soumettant ce formulaire, vous acceptez d'être contacté par Tsena Imprimante 
                  pour votre demande de devis. Vos données sont protégées et ne sont pas partagées.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default QuoteForm;