import jsPDF from 'jspdf';
import { Product } from '@/data/products';
import { getDeliveryRate, formatPrice, DeliveryType } from './deliveryRates';

// Fonction pour convertir les nombres en lettres
function numberToWords(num: number): string {
  const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
  const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingts', 'quatre-vingt-dix'];
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

      if (tensDigit === 7) {
        result += 'soixante';
        if (unitsDigit >= 10) {
          result += '-' + teens[unitsDigit - 10];
        } else if (unitsDigit > 0) {
          result += '-' + units[unitsDigit + 10];
        }
      } else if (tensDigit === 9) {
        result += 'quatre-vingt';
        if (unitsDigit >= 10) {
          result += '-' + teens[unitsDigit - 10];
        } else if (unitsDigit > 0) {
          result += '-' + units[unitsDigit + 10];
        }
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
      let chunkText = convertHundreds(chunk);
      if (scaleIndex > 0) {
        chunkText += ' ' + scales[scaleIndex];
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

const BRAND: RGB = [30, 107, 140];      // #1E6B8C  bleu marque principal
const BRAND_DARK: RGB = [20, 78, 103];  // #144E67  bleu profond (pied de page)
const ACCENT: RGB = [41, 148, 192];     // #2994C0  bleu clair d'accent
const LIGHT: RGB = [244, 246, 248];     // #F4F6F8  fond gris très clair
const ROW_ALT: RGB = [247, 249, 251];   // ligne alternée
const BORDER: RGB = [222, 227, 232];    // bordures fines
const TEXT: RGB = [33, 37, 41];         // texte principal
const MUTED: RGB = [125, 133, 141];     // texte secondaire
const WHITE: RGB = [255, 255, 255];
const HEADER_SUB: RGB = [214, 233, 242]; // texte clair sur bande bleue

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

    // Identité (gauche)
    this.ink(pdf, WHITE);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(23);
    pdf.text('TSENA IMPRIMANTE', M, 19);

    this.ink(pdf, HEADER_SUB);
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(9.5);
    pdf.text('Votre partenaire imprimante eto Madagasikara', M, 26.5);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.text('Tel 033 71 063 34   ·   Facebook TsenaImprimante', M, 33);
    pdf.text('tsenaimprimante.fonenako.mg', M, 38);

    // Titre document (droite, dans la bande)
    this.ink(pdf, WHITE);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(15);
    pdf.text('FACTURE PROFORMA', RIGHT, 20, { align: 'right' });
    this.stroke(pdf, ACCENT);
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

      // Sous-ligne descriptive (gris)
      const typeLabel = TYPE_LABELS[item.product.type] || item.product.type;
      const desc = `${item.product.brand}  ·  ${typeLabel}  ·  ${item.product.weight} kg`;
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
      'Paiement : Espèces · Mobile Money · Virement',
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

    let y = this.addProductsTable(pdf, invoiceData.products, 105);
    y += 10;

    // Réserver la place du bas (livraison + totaux + conditions + remerciement)
    const bottomNeeded = 88 + (invoiceData.notes ? 16 : 0);
    if (y + bottomNeeded > MAX_Y) {
      pdf.addPage();
      y = 24;
    }

    y = this.addDelivery(pdf, invoiceData, y);

    if (invoiceData.notes) {
      y = this.addNotes(pdf, invoiceData.notes, y);
    }

    y = this.addTotalsAndConditions(pdf, invoiceData, y);

    this.addThanks(pdf, y + 8);
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
