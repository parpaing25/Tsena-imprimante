import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Facebook, 
  Send,
  User,
  HelpCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AnimatedSection from "./AnimatedSection";

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCall = () => {
    window.location.href = "tel:+261337106334";
  };

  const handleMessenger = () => {
    window.open("https://m.me/TsenaImprimante", "_blank");
  };

  const handleFacebook = () => {
    window.open("https://www.facebook.com/TsenaImprimante", "_blank");
  };

  const handleEmail = () => {
    window.location.href = "mailto:tsenaimprimante@gmail.com";
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name || !formData.message) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir au moins votre nom et votre message",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Préparation du message
      const emailMessage = `Nouveau message depuis le site web TSENA

👤 De: ${formData.name}
${formData.email ? `📧 Email: ${formData.email}` : ""}
${formData.phone ? `📱 Téléphone: ${formData.phone}` : ""}

${formData.subject ? `📝 Sujet: ${formData.subject}` : ""}

💬 Message:
${formData.message}

---
Envoyé depuis tsenaimprimante.com`;

      // Ouvrir l'email et messenger
      const emailSubject = formData.subject || "Nouveau message depuis le site web";
      const emailBody = encodeURIComponent(emailMessage);
      window.open(`mailto:tsenaimprimante@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${emailBody}`, "_self");

      // Ouvrir aussi Messenger avec le message
      setTimeout(() => {
        const messengerMessage = encodeURIComponent(emailMessage);
        window.open(`https://www.facebook.com/messages/t/61557419549913?text=${messengerMessage}`, "_blank");
      }, 1000);

      toast({
        title: "Message envoyé !",
        description: "Votre message a été transféré par email et sur notre page Facebook. Nous vous répondrons rapidement.",
      });

      // Reset formulaire
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message. Utilisez nos autres canaux de contact.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gradient-elegant">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade-in-scale" className="text-center mb-16">
          <MessageCircle className="h-16 w-16 mx-auto text-primary mb-6 animate-bounce" />
          <h2 className="text-4xl font-bold text-primary mb-4">
            Contactez nos Experts
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Notre équipe d'experts est là pour vous conseiller et répondre 
            à toutes vos questions. Réponse garantie sous 24h !
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire de Contact */}
          <AnimatedSection animation="slide-in-left" className="lg:col-span-2">
            <Card className="hover:shadow-glow transition-all duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Send className="h-6 w-6 text-primary" />
                  Envoyez-nous un message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Votre nom et prénom"
                        className="hover-scale"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="033 XX XXX XX"
                        className="hover-scale"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Adresse email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="votre@email.com"
                      className="hover-scale"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Sujet</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      placeholder="Conseil d'achat, devis, support..."
                      className="hover-scale"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Décrivez votre besoin : type d'imprimante recherchée, budget, usage prévu..."
                      rows={6}
                      className="hover-scale"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-hero text-lg py-6 hover-scale"
                    size="lg"
                  >
                    {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                    <Send className="h-5 w-5 ml-2" />
                  </Button>

                  <p className="text-sm text-muted-foreground text-center bg-muted/30 p-3 rounded-lg">
                    💡 <strong>Double envoi :</strong> Votre message sera envoyé par email ET sur notre page Facebook 
                    pour une réponse encore plus rapide !
                  </p>
                </form>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Informations de Contact */}
          <div className="space-y-6">
            {/* Contact Direct */}
            <AnimatedSection animation="slide-in-right" delay={200}>
              <Card className="hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Phone className="h-5 w-5 text-success" />
                    Contact Direct
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button onClick={handleCall} className="w-full btn-call hover-scale">
                      <Phone className="h-4 w-4 mr-2" />
                      033 71 063 34
                    </Button>
                    <Button onClick={handleEmail} variant="outline" className="w-full hover-scale">
                      <Mail className="h-4 w-4 mr-2" />
                      tsenaimprimante@gmail.com
                    </Button>
                    <Button onClick={handleMessenger} variant="outline" className="w-full hover-scale">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Facebook Messenger
                    </Button>
                    <Button 
                      onClick={handleFacebook} 
                      className="w-full bg-[#1877f2] text-white hover:bg-[#166fe5] hover-scale"
                    >
                      <Facebook className="h-4 w-4 mr-2" />
                      Page Facebook
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Horaires */}
            <AnimatedSection animation="slide-in-right" delay={400}>
              <Card className="hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-accent" />
                    Nos Horaires
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Lundi - Vendredi</span>
                      <span className="text-sm text-muted-foreground">8h - 18h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Samedi</span>
                      <span className="text-sm text-muted-foreground">8h - 16h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Dimanche</span>
                      <span className="text-sm text-muted-foreground">Urgences uniquement</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-gradient-subtle rounded-lg border-l-4 border-primary">
                    <p className="text-xs text-muted-foreground">
                      <strong>⚡ Réponse garantie</strong> sous 24h maximum ! 
                      Pour les urgences, appelez directement.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Zone de Service */}
            <AnimatedSection animation="slide-in-right" delay={600}>
              <Card className="hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Zone de Service
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-semibold">Toute l'île de Madagascar</span>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="bg-success/10 p-3 rounded-lg">
                        <div className="font-medium text-success mb-1">🚚 Livraison gratuite</div>
                        <div className="text-muted-foreground">Antananarivo et environs</div>
                      </div>
                      
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <div className="font-medium text-primary mb-1">🔧 Installation gratuite</div>
                        <div className="text-muted-foreground">Antananarivo uniquement</div>
                      </div>
                      
                      <div className="bg-accent/10 p-3 rounded-lg">
                        <div className="font-medium text-accent-foreground mb-1">📦 Autres régions</div>
                        <div className="text-muted-foreground text-xs">
                          • Livraison par transporteur<br />
                          • Support téléphonique gratuit<br />
                          • Installation à distance possible
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* FAQ Rapide */}
            <AnimatedSection animation="slide-in-right" delay={800}>
              <Card className="hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-accent" />
                    Questions Fréquentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div className="border-l-2 border-primary pl-3">
                      <div className="font-medium text-primary">Délais de livraison ?</div>
                      <div className="text-muted-foreground">24-48h à Tana, 3-7 jours ailleurs</div>
                    </div>
                    <div className="border-l-2 border-success pl-3">
                      <div className="font-medium text-success">Modes de paiement ?</div>
                      <div className="text-muted-foreground">Espèces, virement, Mobile Money</div>
                    </div>
                    <div className="border-l-2 border-accent pl-3">
                      <div className="font-medium text-accent">Garantie ?</div>
                      <div className="text-muted-foreground">1 an constructeur + support gratuit</div>
                    </div>
                  </div>
                  <a href="/faq" className="inline-block w-full mt-4">
                    <Button variant="outline" className="w-full hover-scale" size="sm">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Voir toutes les FAQ
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;