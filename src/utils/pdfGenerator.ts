import jsPDF from 'jspdf';
import { Product } from '@/data/products';
import { getDeliveryRate, formatPrice, DeliveryType } from './deliveryRates';
import { LOGO_DEVIS, QR_DEVIS } from './devisImages';

// Fonction pour convertir les nombres en lettres
function numberToWords(num: number): string {
  const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
  const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  // 70 et 90 sont traités à part (soixante-dix, quatre-vingt-dix) ; 80 prend son s plus bas.
  const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt'];
  const scales = ['', 'mille', 'million', 'milliard'];

  if (num === 0) return 'zéro';

  function convertHundreds(n: number): string {
    let result = '';

    if (n >= 100) {
      const hundreds = Math.floor(n / 100);
      if (hundreds === 1) {
        result += 'cent';
      } else {
        result += units[hundreds] + ' cent';
      }
      if (n % 100 !== 0) result += ' ';
    }

    n %= 100;

    if (n >= 20) {
      const tensDigit = Math.floor(n / 10);
      const unitsDigit = n % 10;

      // 70-79 et 90-99 s'écrivent « soixante-dix… » et « quatre-vingt-dix… » : l'unité se lit
      // dans `teens`, jamais dans `units`. L'ancien code faisait units[unitsDigit + 10], hors
      // du tableau : tout total tombant sur 71-79 ou 91-99 sortait « quatre-vingt-undefined »
      // (mesuré le 13/10/2026 sur 3 295 000 Ar, un panier banal).
      if (tensDigit === 7 || tensDigit === 9) {
        result += tensDigit === 7 ? 'soixante' : 'quatre-vingt';
        result += '-' + teens[unitsDigit];
      } else if (tensDigit === 8 && unitsDigit === 0) {
        result += 'quatre-vingts';   // « quatre-vingts » prend un s quand rien ne suit
      } else {
        result += tens[tensDigit];
        if (unitsDigit > 0) {
          result += '-' + units[unitsDigit];
        }
      }
    } else if (n >= 10) {
      result += teens[n - 10];
    } else if (n > 0) {
      result += units[n];
    }

    return result;
  }

  let result = '';
  let scaleIndex = 0;

  while (num > 0) {
    const chunk = num % 1000;
    if (chunk !== 0) {
      // « mille » est invariable et ne se dit pas « un mille » ; million et milliard prennent un s.
      let chunkText = scaleIndex === 1 && chunk === 1 ? '' : convertHundreds(chunk);
      if (scaleIndex > 0) {
        const echelle = scales[scaleIndex] + (scaleIndex >= 2 && chunk > 1 ? 's' : '');
        chunkText = (chunkText ? chunkText + ' ' : '') + echelle;
      }
      result = chunkText + (result ? ' ' + result : '');
    }
    num = Math.floor(num / 1000);
    scaleIndex++;
  }

  return result;
}

export interface InvoiceData {
  quoteNumber: string;
  date: string;
  validUntil: string;
  customer: {
    name: string;
    company?: string;
    phone: string;
    email?: string;
    region: string;
  };
  products: {
    product: Product;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  deliveryType: DeliveryType;
  deliveryPrice: number;
  subtotal: number;
  total: number;
  notes?: string;
}

// ---------------------------------------------------------------------------
// Palette de marque Tsena Imprimante
// ---------------------------------------------------------------------------
type RGB = [number, number, number];

// Charte du site (src/index.css) : le PDF portait le bleu de Fonenako jusqu'au 13/10/2026.
const BRAND: RGB = [13, 89, 165];       // #0D59A5  bleu Tsena (primary)
const BRAND_DARK: RGB = [10, 64, 118];  // #0A4076  bleu profond (pied de page)
const ACCENT: RGB = [174, 75, 4];       // #AE4B04  orange Tsena (accent)
const ACCENT_CLAIR: RGB = [255, 152, 81]; // #FF9851 orange clair
const LIGHT: RGB = [244, 246, 248];     // #F4F6F8  fond gris très clair
const ROW_ALT: RGB = [247, 249, 251];   // ligne alternée
const BORDER: RGB = [222, 227, 232];    // bordures fines
const TEXT: RGB = [33, 37, 41];         // texte principal
const MUTED: RGB = [125, 133, 141];     // texte secondaire
const WHITE: RGB = [255, 255, 255];
const HEADER_SUB: RGB = [220, 232, 242]; // texte clair sur bande bleue

// Géométrie de la page (A4 portrait, mm)
const PAGE_W = 210;
const PAGE_H = 297;
const M = 15;                 // marge gauche/droite
const RIGHT = PAGE_W - M;     // 195
const CONTENT_W = PAGE_W - M * 2; // 180
const FOOTER_RESERVE = 18;    // espace réservé pour la bande de pied de page
const MAX_Y = PAGE_H - FOOTER_RESERVE;

// Colonnes du tableau produits
const COL_QTY = 122;   // centre
const COL_PU = 160;    // bord droit (prix unitaire)
const COL_TOTAL = RIGHT; // bord droit (total)

/**
 * Mentions légales du bas de devis. NIF, STAT et forme juridique ne sont pas connus
 * (page /mentions-legales, « à compléter ») : tant qu'Andry ne les donne pas, on écrit
 * ce qui est vrai, jamais un numéro inventé ni la mention « à compléter ».
 */
const IDENTITE_LEGALE =
  'Tsena Imprimante — Avaradoha, Antananarivo 101, Madagascar — Tel 033 71 063 34 / 032 47 041 43 — tsenaimprimante@gmail.com';

const TYPE_LABELS: Record<string, string> = {
  inkjet: "Jet d'encre",
  laser: 'Laser',
  tank: "Réservoir d'encre",
};

const DELIVERY_LABELS: Record<DeliveryType, string> = {
  'local-tana': 'Livraison locale Tana',
  plane: 'Par avion',
  'taxi-brousse': 'Taxi-brousse',
  'rapid-service': 'Service rapide',
};

export class PDFGenerator {
  // -- petits utilitaires couleur -------------------------------------------
  private static fill(pdf: jsPDF, c: RGB) { pdf.setFillColor(c[0], c[1], c[2]); }
  private static stroke(pdf: jsPDF, c: RGB) { pdf.setDrawColor(c[0], c[1], c[2]); }
  private static ink(pdf: jsPDF, c: RGB) { pdf.setTextColor(c[0], c[1], c[2]); }

  private static capitalize(s: string): string {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  }

  // -- En-tête : bande de marque pleine largeur -----------------------------
  private static addHeader(pdf: jsPDF): number {
    const bandH = 44;

    // Bande bleue pleine largeur + fin liseré d'accent
    this.fill(pdf, BRAND);
    pdf.rect(0, 0, PAGE_W, bandH, 'F');
    this.fill(pdf, ACCENT);
    pdf.rect(0, bandH, PAGE_W, 2, 'F');

    // Logo de la page (gouttes d'encre) sur pastille blanche : le devis n'en portait aucun
    // jusqu'au 13/10/2026.
    const logoD = 20, logoY = 7;
    this.fill(pdf, WHITE);
    pdf.roundedRect(M - 1.5, logoY - 1.5, logoD + 3, logoD + 3, 2.5, 2.5, 'F');
    try {
      pdf.addImage(LOGO_DEVIS, 'PNG', M, logoY, logoD, logoD);
    } catch {
      /* un devis sans logo reste un devis valable : jamais d'échec pour une image */
    }

    // Identité (à droite du logo)
    const txtX = M + logoD + 6;
    this.ink(pdf, WHITE);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.text('TSENA IMPRIMANTE', txtX, 17);

    this.ink(pdf, HEADER_SUB);
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(9);
    pdf.text('Votre partenaire imprimante eto Madagasikara', txtX, 24);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.text('Tel 033 71 063 34  ·  032 47 041 43  ·  Facebook TsenaImprimante', M, 33);
    pdf.text('tsenaimprimante.fonenako.mg  ·  Avaradoha, Antananarivo 101', M, 38);

    // Titre document (droite, dans la bande)
    this.ink(pdf, WHITE);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(15);
    pdf.text('FACTURE PROFORMA', RIGHT, 20, { align: 'right' });
    this.stroke(pdf, ACCENT_CLAIR);
    pdf.setLineWidth(0.6);
    pdf.line(RIGHT - 46, 23.5, RIGHT, 23.5);

    return bandH + 2;
  }

  // -- Bloc « FACTURÉ À » + encadré détails proforma ------------------------
  private static addMetaBlocks(pdf: jsPDF, invoiceData: InvoiceData): number {
    const top = 54;
    const boxH = 44;
    const gap = 6;
    const leftW = (CONTENT_W - gap) * 0.58;      // ~101
    const rightX = M + leftW + gap;
    const rightW = CONTENT_W - leftW - gap;      // ~73

    // Encadrés
    this.fill(pdf, LIGHT);
    this.stroke(pdf, BORDER);
    pdf.setLineWidth(0.3);
    pdf.roundedRect(M, top, leftW, boxH, 2.5, 2.5, 'FD');
    pdf.roundedRect(rightX, top, rightW, boxH, 2.5, 2.5, 'FD');

    // --- FACTURÉ À ---
    const { customer } = invoiceData;
    this.ink(pdf, BRAND);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('FACTURÉ À', M + 5, top + 8);

    this.ink(pdf, TEXT);
    pdf.setFontSize(11);
    pdf.text(pdf.splitTextToSize(customer.name, leftW - 10)[0], M + 5, top + 16);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    this.ink(pdf, [80, 86, 92]);
    const lines: string[] = [];
    if (customer.company) lines.push(customer.company);
    lines.push(`Tel : ${customer.phone}`);
    if (customer.email) lines.push(`Email : ${customer.email}`);
    lines.push(`Adresse : ${customer.region}`);
    let cy = top + 23;
    lines.slice(0, 4).forEach((l) => {
      pdf.text(pdf.splitTextToSize(l, leftW - 10)[0], M + 5, cy);
      cy += 5.5;
    });

    // --- Détails proforma ---
    this.ink(pdf, BRAND);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('PROFORMA', rightX + 5, top + 8);

    const rInner = rightX + rightW - 5;
    const rows: Array<[string, string]> = [
      ['N°', invoiceData.quoteNumber],
      ['Date', invoiceData.date],
      ['Valable jusqu’au', invoiceData.validUntil],
    ];
    let ry = top + 17;
    rows.forEach(([label, value]) => {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      this.ink(pdf, MUTED);
      pdf.text(label, rightX + 5, ry);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8.5);
      this.ink(pdf, TEXT);
      pdf.text(value, rInner, ry, { align: 'right' });
      ry += 9;
    });

    return top + boxH + 9;
  }

  // -- En-tête du tableau produits (répété à chaque page) -------------------
  private static drawTableHead(pdf: jsPDF, y: number): number {
    const h = 9;
    this.fill(pdf, BRAND);
    pdf.rect(M, y, CONTENT_W, h, 'F');

    this.ink(pdf, WHITE);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.5);
    pdf.text('DESCRIPTION', M + 4, y + 6);
    pdf.text('QTÉ', COL_QTY, y + 6, { align: 'center' });
    pdf.text('PRIX UNIT. TTC', COL_PU, y + 6, { align: 'right' });
    pdf.text('TOTAL TTC', COL_TOTAL - 3, y + 6, { align: 'right' });

    return y + h;
  }

  // -- Tableau produits (avec pagination) -----------------------------------
  private static addProductsTable(pdf: jsPDF, products: InvoiceData['products'], startY: number): number {
    const ROW_H = 12;
    let y = this.drawTableHead(pdf, startY);

    products.forEach((item, i) => {
      // Saut de page si la ligne ne tient pas
      if (y + ROW_H > MAX_Y) {
        pdf.addPage();
        y = this.drawTableHead(pdf, 20);
      }

      // Fond alterné
      if (i % 2 === 1) {
        this.fill(pdf, ROW_ALT);
        pdf.rect(M, y, CONTENT_W, ROW_H, 'F');
      }

      // Nom du produit (gras)
      this.ink(pdf, TEXT);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.text(pdf.splitTextToSize(item.product.name, 92)[0], M + 4, y + 5);

      // Sous-ligne descriptive (gris). La RÉFÉRENCE remplace le poids depuis le 13/10/2026 :
      // c'est elle que le client retrouve sur sa commande et sur sa facture.
      const typeLabel = TYPE_LABELS[item.product.type] || item.product.type;
      const reference = (item.product as { model?: string }).model || item.product.id;
      const desc = `${item.product.brand}  ·  ${typeLabel}  ·  Réf. ${reference}`;
      this.ink(pdf, MUTED);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.text(pdf.splitTextToSize(desc, 92)[0], M + 4, y + 9.5);

      // Valeurs numériques (centrées verticalement)
      const midY = y + 7.2;
      this.ink(pdf, TEXT);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text(String(item.quantity), COL_QTY, midY, { align: 'center' });
      pdf.text(`${formatPrice(item.unitPrice)}`, COL_PU, midY, { align: 'right' });
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${formatPrice(item.total)}`, COL_TOTAL - 3, midY, { align: 'right' });

      // Filet de séparation
      this.stroke(pdf, BORDER);
      pdf.setLineWidth(0.2);
      pdf.line(M, y + ROW_H, RIGHT, y + ROW_H);

      y += ROW_H;
    });

    // Cadre extérieur du tableau
    this.stroke(pdf, BORDER);
    pdf.setLineWidth(0.3);
    pdf.line(M, startY, M, y);          // gauche
    pdf.line(RIGHT, startY, RIGHT, y);  // droite

    return y;
  }

  // -- Ligne de livraison ---------------------------------------------------
  private static addDelivery(pdf: jsPDF, invoiceData: InvoiceData, y: number): number {
    const h = 16;
    const rate = getDeliveryRate(invoiceData.customer.region);

    this.fill(pdf, LIGHT);
    this.stroke(pdf, BORDER);
    pdf.setLineWidth(0.3);
    pdf.roundedRect(M, y, CONTENT_W, h, 2, 2, 'FD');

    this.ink(pdf, BRAND);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('LIVRAISON', M + 5, y + 6.5);

    this.ink(pdf, [80, 86, 92]);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    const detail = `${invoiceData.customer.region}  ·  ${DELIVERY_LABELS[invoiceData.deliveryType]}  ·  ${rate.estimatedDays}`;
    pdf.text(pdf.splitTextToSize(detail, CONTENT_W - 55)[0], M + 5, y + 12);

    this.ink(pdf, BRAND);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    const price = invoiceData.deliveryPrice === 0 ? 'Gratuite' : `${formatPrice(invoiceData.deliveryPrice)} MGA`;
    pdf.text(price, RIGHT - 5, y + 10, { align: 'right' });

    return y + h + 8;
  }

  // -- Conditions (gauche) + encadré des totaux (droite) --------------------
  private static addTotalsAndConditions(pdf: jsPDF, invoiceData: InvoiceData, y: number): number {
    // ---- Colonne gauche : conditions de vente ----
    this.ink(pdf, BRAND);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('CONDITIONS DE VENTE', M, y + 4);

    const conditions = [
      'Facture proforma valable 30 jours',
      'Installation gratuite à Antananarivo',
      'Garantie constructeur applicable',
    ];
    this.ink(pdf, [90, 96, 102]);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    let cy = y + 11;
    conditions.forEach((c) => {
      this.ink(pdf, ACCENT);
      pdf.text('•', M, cy);
      this.ink(pdf, [90, 96, 102]);
      pdf.text(c, M + 4, cy);
      cy += 5.5;
    });

    // ---- Colonne droite : totaux ----
    const boxX = 120;
    const boxW = RIGHT - boxX; // 75
    const labelX = boxX + 4;
    const valX = RIGHT - 4;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    this.ink(pdf, TEXT);
    pdf.text('Sous-total TTC', labelX, y + 4);
    pdf.text(`${formatPrice(invoiceData.subtotal)} MGA`, valX, y + 4, { align: 'right' });

    pdf.text('Livraison', labelX, y + 11);
    const deliv = invoiceData.deliveryPrice === 0 ? 'Gratuite' : `${formatPrice(invoiceData.deliveryPrice)} MGA`;
    pdf.text(deliv, valX, y + 11, { align: 'right' });

    this.stroke(pdf, BORDER);
    pdf.setLineWidth(0.3);
    pdf.line(boxX, y + 15, RIGHT, y + 15);

    // Bandeau TOTAL TTC
    const totalY = y + 17;
    const totalH = 13;
    this.fill(pdf, BRAND);
    pdf.roundedRect(boxX, totalY, boxW, totalH, 2, 2, 'F');
    this.ink(pdf, WHITE);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('TOTAL TTC', labelX, totalY + 8.5);
    pdf.setFontSize(12);
    pdf.text(`${formatPrice(invoiceData.total)} MGA`, valX, totalY + 8.5, { align: 'right' });

    // ---- Montant en lettres (pleine largeur) ----
    const wordsY = totalY + totalH + 8;
    const words = this.capitalize(numberToWords(invoiceData.total));
    this.ink(pdf, MUTED);
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(9);
    const wordLines = pdf.splitTextToSize(
      `Arrêtée la présente facture à la somme de : ${words} ariary.`,
      CONTENT_W
    );
    pdf.text(wordLines, M, wordsY);

    return wordsY + wordLines.length * 4.5;
  }

  // -- Notes éventuelles ----------------------------------------------------
  private static addNotes(pdf: jsPDF, notes: string, y: number): number {
    this.ink(pdf, BRAND);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('NOTES', M, y);

    this.ink(pdf, [90, 96, 102]);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    const lines = pdf.splitTextToSize(notes, CONTENT_W);
    pdf.text(lines, M, y + 5);

    return y + 5 + lines.length * 4.5 + 4;
  }

  // -- Paiement · signature · QR (bas du devis) -----------------------------
  // Ajouté le 13/10/2026 : le devis se terminait sur un tiers de page vide, sans moyen
  // de paiement utilisable, sans endroit où signer et sans mention légale.
  private static addPaiementEtSignature(pdf: jsPDF, y: number): number {
    const h = 34;
    const colW = (CONTENT_W - 6) / 2;

    // --- Paiement (gauche) ---
    this.fill(pdf, LIGHT);
    this.stroke(pdf, BORDER);
    pdf.setLineWidth(0.3);
    pdf.roundedRect(M, y, colW, h, 2.5, 2.5, 'FD');

    this.ink(pdf, BRAND);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('COMMENT PAYER', M + 5, y + 7);

    this.ink(pdf, [80, 86, 92]);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    const moyens = [
      'Espèces à la livraison, à Antananarivo',
      'Mobile Money : MVola, Orange Money, Airtel Money',
      'Virement bancaire : coordonnées sur demande',
      'Facture définitive remise à la livraison',
    ];
    let py = y + 13;
    moyens.forEach((m) => {
      this.ink(pdf, ACCENT);
      pdf.text('•', M + 5, py);
      this.ink(pdf, [80, 86, 92]);
      pdf.text(pdf.splitTextToSize(m, colW - 14)[0], M + 9, py);
      py += 5.0;
    });

    // --- Signature (droite) + QR ---
    const sx = M + colW + 6;
    this.stroke(pdf, BORDER);
    pdf.roundedRect(sx, y, colW, h, 2.5, 2.5, 'D');

    this.ink(pdf, BRAND);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('BON POUR ACCORD', sx + 5, y + 7);

    this.ink(pdf, MUTED);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.text('Date, signature et cachet du client', sx + 5, y + 12.5);

    // Lignes à remplir
    this.stroke(pdf, BORDER);
    pdf.setLineWidth(0.25);
    pdf.line(sx + 5, y + 23, sx + colW - 34, y + 23);
    pdf.line(sx + 5, y + 30, sx + colW - 34, y + 30);

    // QR vers le site, à droite du cadre de signature
    try {
      pdf.addImage(QR_DEVIS, 'PNG', sx + colW - 27, y + 8, 21, 21);
      this.ink(pdf, MUTED);
      pdf.setFontSize(6);
      pdf.text('Notre catalogue', sx + colW - 16.5, y + 32, { align: 'center' });
    } catch {
      /* le QR est un bonus : son absence ne casse pas le devis */
    }

    return y + h + 6;
  }

  // -- Mentions légales (pied de document) ----------------------------------
  private static addMentions(pdf: jsPDF, y: number): number {
    const lignes = [IDENTITE_LEGALE, 'Document non contractuel tant qu\'il n\'est pas signé. Prix en ariary (MGA).']
      .filter(Boolean) as string[];
    this.ink(pdf, MUTED);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6.8);
    lignes.forEach((l, i) => pdf.text(pdf.splitTextToSize(l, CONTENT_W)[0], M, y + i * 3.6));
    return y + lignes.length * 3.6;
  }

  // -- Remerciement + bande de pied de page sur toutes les pages ------------
  private static addThanks(pdf: jsPDF, y: number) {
    this.ink(pdf, BRAND);
    pdf.setFont('helvetica', 'bolditalic');
    pdf.setFontSize(13);
    pdf.text('Misaotra tompoko !', RIGHT, Math.min(y, MAX_Y - 2), { align: 'right' });
  }

  private static paintFooters(pdf: jsPDF) {
    const pageCount = pdf.getNumberOfPages();
    for (let p = 1; p <= pageCount; p++) {
      pdf.setPage(p);
      const bandY = PAGE_H - 10;
      this.fill(pdf, BRAND_DARK);
      pdf.rect(0, bandY, PAGE_W, 10, 'F');

      this.ink(pdf, HEADER_SUB);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.text('tsenaimprimante.fonenako.mg   ·   033 71 063 34', M, bandY + 6.3);

      pdf.setFontSize(7);
      pdf.text(`Page ${p} / ${pageCount}`, RIGHT, bandY + 6.3, { align: 'right' });
    }
  }

  // -- Point d'entrée -------------------------------------------------------
  static generateInvoice(invoiceData: InvoiceData): jsPDF {
    const pdf = new jsPDF('p', 'mm', 'a4');

    this.addHeader(pdf);
    this.addMetaBlocks(pdf, invoiceData);

    let y = this.addProductsTable(pdf, invoiceData.products, 101);
    y += 10;

    // Réserver la place du bas (livraison + totaux + conditions + remerciement)
    // livraison + notes + totaux + remerciement + paiement/signature
    const bottomNeeded = 116 + (invoiceData.notes ? 12 : 0);
    if (y + bottomNeeded > MAX_Y) {
      pdf.addPage();
      y = 24;
    }

    y = this.addDelivery(pdf, invoiceData, y);

    if (invoiceData.notes) {
      y = this.addNotes(pdf, invoiceData.notes, y);
    }

    y = this.addTotalsAndConditions(pdf, invoiceData, y);

    // Le remerciement suit le montant en lettres ; posé après le bloc paiement, il
    // chevauchait les mentions légales (vu sur le rendu du 13/10/2026).
    this.addThanks(pdf, y + 5);
    y += 6;

    // Paiement + signature : sur la page en cours s'il reste la place, sinon la suivante.
    if (y + 36 > MAX_Y - 6) {
      pdf.addPage();
      y = 24;
    }
    this.addPaiementEtSignature(pdf, y);

    // Les mentions tiennent toujours juste au-dessus de la bande de pied de page.
    this.addMentions(pdf, MAX_Y - 5);
    this.paintFooters(pdf);

    return pdf;
  }

  static generateQuoteNumber(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    return `PRO-${year}${month}${day}-${random}`;
  }
}
