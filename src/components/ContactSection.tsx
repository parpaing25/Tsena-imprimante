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
import { CONTACT, appeler, ouvrirMessenger, ouvrirFacebook, lienWhatsApp } from "@/config/contact";
import { envoyerLead, telephoneValide } from "@/lib/leads";
import { evenement } from "@/lib/mesure";

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
  // Refonte mobile 07/09/2026 : le formulaire (1 100 px de champs) se deplie a la
  // demande. Les conversions reelles — appel, WhatsApp, Messenger — sont au-dessus.
  const [formOuvert, setFormOuvert] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [pieges, setPieges] = useState(""); // champ invisible : rempli = robot

  const handleCall = () => {
    evenement("clic_appel", { ou: "contact" });
    appeler();
  };

  const handleMessenger = () => {
    evenement("clic_messenger", { ou: "contact" });
    ouvrirMessenger();
  };

  const handleFacebook = () => {
    ouvrirFacebook();
  };

  const handleEmail = () => {
    window.location.href = `mailto:${CONTACT.email}`;
  };

  const handleWhatsApp = () => {
    evenement("clic_whatsapp", { ou: "contact" });
    window.open(lienWhatsApp("Bonjour Tsena Imprimante, j'ai une question."), "_blank", "noopener");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) {
      toast({
        title: "Il manque une information",
        description: "Votre nom et votre message sont nécessaires.",
        variant: "destructive",
      });
      return;
    }
    if (formData.phone && !telephoneValide(formData.phone)) {
      toast({
        title: "Numéro invalide",
        description: "Un numéro malgache : 032, 033, 034, 037 ou 038 suivi de 7 chiffres.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    // Audit 06/09/2026 : avant, ce formulaire ouvrait un mailto: puis un profil
    // Facebook personnel derrière un mur de connexion, et affichait « Message
    // envoyé ! » sans rien envoyer. Il envoie maintenant au serveur (api/lead.php).
    const resultat = await envoyerLead(
      {
        type: "contact",
        nom: formData.name.trim(),
        telephone: formData.phone.trim(),
        email: formData.email.trim(),
        sujet: formData.subject.trim(),
        message: formData.message.trim(),
      },
      pieges
    );
    setIsSubmitting(false);
    if (resultat.ok) {
      evenement("contact_envoye");
      setReference(resultat.id || "ok");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } else {
      evenement("formulaire_erreur", { f: "contact", e: resultat.erreur });
      toast({
        title: "Envoi impossible pour le moment",
        description: "Utilisez WhatsApp, Messenger ou le téléphone : ces boutons fonctionnent sans le formulaire.",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="contact" className="scroll-mt-16 bg-gradient-elegant py-6 sm:py-20">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade-in-scale" className="mb-4 text-center sm:mb-16">
          <MessageCircle className="hidden h-16 w-16 sm:flex mx-auto text-primary mb-6 animate-bounce" />
          <h2 className="text-xl sm:text-4xl font-bold text-primary mb-4">
            Contactez nos Experts
          </h2>
          <p className="text-[12.5px] sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Notre équipe d'experts est là pour vous conseiller et répondre
            à toutes vos questions.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-4 sm:gap-8 lg:grid-cols-3">
          {/* Formulaire de Contact */}
          <AnimatedSection animation="slide-in-left" className="order-2 lg:order-1 lg:col-span-2">
            {!formOuvert && (
              <Button
                variant="outline"
                onClick={() => setFormOuvert(true)}
                className="h-12 w-full justify-between text-[14.5px] font-semibold sm:hidden"
              >
                Écrire un message
                <Send className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
            <div className={formOuvert ? "block" : "hidden sm:block"}>
            <Card className="hover:shadow-glow transition-all duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Send className="h-6 w-6 text-primary" />
                  Envoyez-nous un message
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reference ? (
                  <div className="rounded-lg border border-success/30 bg-success/5 p-6 space-y-4" role="status" aria-live="polite">
                    <h3 className="text-xl font-semibold text-success">Message bien reçu — misaotra !</h3>
                    <p className="text-muted-foreground">
                      Référence <strong>{reference}</strong>. Nous vous répondons pendant nos heures d'ouverture,
                      par téléphone si vous avez laissé un numéro, sinon par e-mail.
                    </p>
                    <p className="text-sm text-muted-foreground">Besoin d'une réponse tout de suite ?</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button onClick={handleWhatsApp} className="btn-call">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Continuer sur WhatsApp
                      </Button>
                      <Button onClick={handleCall} variant="outline">
                        <Phone className="h-4 w-4 mr-2" />
                        Appeler le {CONTACT.telephonePrincipal.affichage}
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setReference(null)}>Envoyer un autre message</Button>
                  </div>
                ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Piège à robots : invisible, ne doit jamais être rempli */}
                  <div className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden="true">
                    <label htmlFor="site_web">Ne pas remplir</label>
                    <input id="site_web" name="site_web" type="text" tabIndex={-1} autoComplete="off" value={pieges} onChange={(e) => setPieges(e.target.value)} />
                  </div>
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
                    Votre message nous parvient immédiatement (e-mail et notification). Réponse pendant les heures
                    d'ouverture. Vos coordonnées servent uniquement à vous répondre —{" "}
                    <a href="/privacy" className="underline">politique de confidentialité</a>.
                  </p>
                </form>
                )}
              </CardContent>
            </Card>
            </div>
          </AnimatedSection>

          {/* Informations de Contact */}

                    <div className="order-1 space-y-3 sm:space-y-6 lg:order-2">
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
                      {CONTACT.telephonePrincipal.affichage}
                    </Button>
                    <Button onClick={handleWhatsApp} variant="outline" className="w-full hover-scale border-[#25d366] text-[#075e54]">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button onClick={handleEmail} variant="outline" className="w-full hover-scale">
                      <Mail className="h-4 w-4 mr-2" />
                      {CONTACT.email}
                    </Button>
                    <Button onClick={handleMessenger} variant="outline" className="w-full hover-scale">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Facebook Messenger
                    </Button>
                    <Button
                      onClick={handleFacebook}
                      className="w-full bg-[#1565c0] text-white hover:bg-[#0d47a1] hover-scale"
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
                      <span className="text-sm text-muted-foreground">8h - 13h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Dimanche</span>
                      <span className="text-sm text-muted-foreground">Fermé (messages lus)</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-gradient-subtle rounded-lg border-l-4 border-primary">
                    <p className="text-xs text-muted-foreground">
                      <strong>Réponse le jour même</strong> pendant les heures d'ouverture.
                      Pour une urgence, appelez plutôt que d'écrire.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Zone de service — masquée sur téléphone : déjà dans le bandeau de confiance */}
            <AnimatedSection animation="slide-in-right" delay={600} className="hidden sm:block">
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

            {/* FAQ rapide — masquée sur téléphone : la page /faq est liée juste au-dessus */}
            <AnimatedSection animation="slide-in-right" delay={800} className="hidden sm:block">
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
                      <div className="text-muted-foreground">Constructeur, durée selon le modèle</div>
                    </div>
                  </div>
                  <Button asChild variant="outline" className="w-full hover-scale mt-4" size="sm">
                    <a href="/faq">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Voir toutes les FAQ
                    </a>
                  </Button>
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