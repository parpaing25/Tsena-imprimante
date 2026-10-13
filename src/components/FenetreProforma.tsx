import { useEffect, useState } from "react";
import type { jsPDF } from "jspdf";
import { CheckCircle2, Download, MessageCircle, Share2, Paperclip } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CONTACT, lienWhatsApp } from "@/config/contact";
import { evenement } from "@/lib/mesure";

/**
 * Fenêtre qui s'ouvre dès que la facture proforma est générée (demande d'Andry, 13/10/2026) :
 * télécharger le PDF, l'envoyer à Tsena sur WhatsApp, ou le partager depuis le téléphone.
 *
 * Un lien WhatsApp ne transporte que du TEXTE. Deux chemins donc :
 *  - « Envoyer à Tsena » : le PDF se télécharge, la conversation avec Tsena s'ouvre avec un
 *    message prêt (n° de proforma, total) ; la fenêtre dit comment joindre le fichier.
 *  - « Partager le PDF » : la feuille de partage du téléphone (Web Share API, niveau 2) porte
 *    le FICHIER lui-même vers WhatsApp, un mail… Le bouton n'apparaît que si l'appareil sait
 *    partager un fichier.
 */
export interface FenetreProformaProps {
  ouverte: boolean;
  onFermer: () => void;
  pdf: jsPDF | null;
  nomFichier: string;
  numero: string;
  total: string;
  messageWhatsApp: string;
}

const FenetreProforma = ({ ouverte, onFermer, pdf, nomFichier, numero, total, messageWhatsApp }: FenetreProformaProps) => {
  const [fichier, setFichier] = useState<File | null>(null);
  const [peutPartager, setPeutPartager] = useState(false);
  const [envoye, setEnvoye] = useState(false);

  useEffect(() => {
    if (!pdf) { setFichier(null); setPeutPartager(false); return; }
    const f = new File([pdf.output("blob")], nomFichier, { type: "application/pdf" });
    setFichier(f);
    setEnvoye(false);
    try {
      setPeutPartager(typeof navigator.canShare === "function" && navigator.canShare({ files: [f] }));
    } catch {
      setPeutPartager(false);
    }
  }, [pdf, nomFichier]);

  const telecharger = () => {
    if (!pdf) return;
    pdf.save(nomFichier);
    evenement("devis_pdf", { action: "telecharge" });
  };

  const envoyerATsena = () => {
    if (!pdf) return;
    pdf.save(nomFichier);   // le fichier est sur l'appareil, prêt à joindre
    evenement("clic_whatsapp", { ou: "devis-fenetre" });
    window.open(lienWhatsApp(messageWhatsApp), "_blank", "noopener");
    setEnvoye(true);
  };

  const partager = async () => {
    if (!fichier) return;
    try {
      await navigator.share({
        files: [fichier],
        title: `Facture proforma ${numero}`,
        text: `Facture proforma ${numero} — Tsena Imprimante (${total})`,
      });
      evenement("clic_whatsapp", { ou: "devis-partage" });
    } catch (e) {
      // Fermer la feuille de partage n'est pas une erreur ; le reste se rattrape par le téléchargement.
      if ((e as DOMException)?.name !== "AbortError") telecharger();
    }
  };

  return (
    <Dialog open={ouverte} onOpenChange={(o) => { if (!o) onFermer(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
          </div>
          <DialogTitle className="text-center">Votre facture proforma est prête</DialogTitle>
          <DialogDescription className="text-center">
            N° <strong className="text-foreground">{numero}</strong> · Total{" "}
            <strong className="text-foreground">{total}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          <Button onClick={telecharger} variant="outline" className="h-12 w-full text-base">
            <Download className="mr-2 h-5 w-5" aria-hidden="true" />
            Télécharger le PDF
          </Button>

          <Button onClick={envoyerATsena} className="h-12 w-full bg-[#1DA851] text-base text-white hover:bg-[#178a43]">
            <MessageCircle className="mr-2 h-5 w-5" aria-hidden="true" />
            Envoyer à Tsena sur WhatsApp
          </Button>

          {peutPartager && (
            <Button onClick={partager} variant="secondary" className="h-12 w-full text-base">
              <Share2 className="mr-2 h-5 w-5" aria-hidden="true" />
              Partager le PDF (WhatsApp, e-mail…)
            </Button>
          )}
        </div>

        {envoye ? (
          <p role="status" className="mt-3 flex gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            <Paperclip className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span>
              Le PDF est dans vos téléchargements. Dans WhatsApp, touchez le trombone, puis{" "}
              <strong>Document</strong>, et choisissez <strong>{nomFichier}</strong>.
            </span>
          </p>
        ) : (
          <p className="mt-3 text-center text-xs text-muted-foreground">
            WhatsApp Tsena Imprimante : {CONTACT.whatsappAffichage}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FenetreProforma;
