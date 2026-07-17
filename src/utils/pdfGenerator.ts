import jsPDF from 'jspdf';
import { Product } from '@/data/products';
import { deliveryRates, getDeliveryRate, calculateDeliveryPrice, formatPrice, DeliveryType } from './deliveryRates';

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

export class PDFGenerator {
  private static addHeader(pdf: jsPDF) {
    // Logo et en-tête entreprise avec logo
    try {
      // Ajouter le logo (si disponible)
      const logoImg = '/src/assets/tsena-logo.png';
      // pdf.addImage(logoImg, 'PNG', 20, 15, 15, 15); // Position x, y, largeur, hauteur
    } catch (error) {
      // Si le logo n'est pas disponible, continuer sans
    }
    
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(44, 82, 130); // Couleur primaire
    pdf.text('TSENA IMPRIMANTE', 40, 28); // Décalé pour laisser place au logo
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text('Votre partenaire imprimante eto Madagasikara', 40, 36);
    pdf.text('033 71 063 34 | Facebook: TsenaImprimante', 40, 42);
    
    // Ligne de séparation
    pdf.setDrawColor(44, 82, 130);
    pdf.setLineWidth(0.5);
    pdf.line(20, 48, 190, 48);
  }

  private static addInvoiceInfo(pdf: jsPDF, invoiceData: InvoiceData) {
    const rightAlign = 190;
    
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(220, 38, 127); // Couleur accent
    pdf.text('FACTURE PROFORMA', rightAlign, 28, { align: 'right' });
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text(`N° ${invoiceData.quoteNumber}`, rightAlign, 36, { align: 'right' });
    pdf.text(`Date: ${invoiceData.date}`, rightAlign, 42, { align: 'right' });
    pdf.text(`Valable jusqu'au: ${invoiceData.validUntil}`, rightAlign, 48, { align: 'right' });
  }

  private static addCustomerInfo(pdf: jsPDF, customer: InvoiceData['customer']) {
    // Section client uniquement
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(44, 82, 130);
    pdf.text('FACTURÉ À:', 20, 65);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    
    let y = 75;
    pdf.text(customer.name, 20, y);
    y += 7;
    
    if (customer.company) {
      pdf.text(customer.company, 20, y);
      y += 7;
    }
    
    pdf.text(`Tel: ${customer.phone}`, 20, y);
    y += 7;
    
    if (customer.email) {
      pdf.text(`E-mail: ${customer.email}`, 20, y);
      y += 7;
    }
    
    pdf.text(`Adresse: ${customer.region}`, 20, y);
  }

  private static addProductsTable(pdf: jsPDF, products: InvoiceData['products']): number {
    const startY = 105;
    let currentY = startY;
    
    // En-tête du tableau
    pdf.setFillColor(44, 82, 130);
    pdf.rect(20, currentY, 170, 8, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DESCRIPTION', 25, currentY + 5);
    pdf.text('QTÉ', 125, currentY + 5, { align: 'center' });
    pdf.text('PRIX UNIT. TTC', 145, currentY + 5, { align: 'center' });
    pdf.text('TOTAL TTC', 175, currentY + 5, { align: 'center' });
    
    currentY += 10;
    
    // Lignes des produits
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    
    products.forEach((item) => {
      // Nom du produit
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.text(item.product.name, 25, currentY + 4);
      currentY += 6;
      
      // Description
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      const description = `${item.product.brand} • ${item.product.type} • ${item.product.weight}kg`;
      pdf.text(description, 25, currentY + 2);
      currentY += 6;
      
      // Quantité, prix unitaire, total avec un meilleur alignement
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      
      // Quantité centrée
      pdf.text(item.quantity.toString(), 125, currentY - 2, { align: 'center' });
      
      // Prix unitaire avec formatage amélioré TTC
      const unitPriceFormatted = formatPrice(item.unitPrice);
      pdf.text(`${unitPriceFormatted} TTC`, 145, currentY - 2, { align: 'center' });
      
      // Total avec formatage amélioré TTC
      const totalFormatted = formatPrice(item.total);
      pdf.text(`${totalFormatted} TTC`, 175, currentY - 2, { align: 'center' });
      
      // Ligne de séparation
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.1);
      pdf.line(20, currentY + 2, 190, currentY + 2);
      currentY += 8;
    });
    
    return currentY;
  }

  private static addDeliveryInfo(pdf: jsPDF, invoiceData: InvoiceData, y: number): number {
    const deliveryRate = getDeliveryRate(invoiceData.customer.region);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(44, 82, 130);
    pdf.text('LIVRAISON:', 25, y);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${invoiceData.customer.region} - ${deliveryRate.estimatedDays}`, 25, y + 7);
    
    // Map delivery type to readable name
    const deliveryTypeNames = {
      'local-tana': 'Livraison locale Tana',
      'plane': 'Par avion',
      'taxi-brousse': 'Taxi-brousse', 
      'rapid-service': 'Service rapide'
    };
    
    pdf.text(`Type: ${deliveryTypeNames[invoiceData.deliveryType]}`, 25, y + 14);
    
    pdf.text(`${formatPrice(invoiceData.deliveryPrice)} MGA`, 185, y + 7, { align: 'right' });
    
    return y + 20;
  }

  private static addTotals(pdf: jsPDF, invoiceData: InvoiceData, y: number) {
    const rightAlign = 175;
    
    // Sous-total TTC
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text('Sous-total TTC:', 120, y);
    const subtotalFormatted = formatPrice(invoiceData.subtotal);
    pdf.text(`${subtotalFormatted} MGA`, rightAlign, y, { align: 'center' });
    
    // Livraison
    pdf.text('Livraison:', 120, y + 8);
    const deliveryFormatted = formatPrice(invoiceData.deliveryPrice);
    pdf.text(`${deliveryFormatted} MGA`, rightAlign, y + 8, { align: 'center' });
    
    // Ligne de séparation
    pdf.setDrawColor(44, 82, 130);
    pdf.setLineWidth(0.5);
    pdf.line(120, y + 12, 185, y + 12);
    
    // Total TTC
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(220, 38, 127);
    pdf.text('TOTAL TTC:', 120, y + 20);
    const totalFormatted = formatPrice(invoiceData.total);
    pdf.text(`${totalFormatted} MGA`, rightAlign, y + 20, { align: 'center' });
    
    // Montant en lettres
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(100, 100, 100);
    const totalInWords = numberToWords(invoiceData.total);
    pdf.text(`Arrêté la présente facture à la somme de: ${totalInWords} ariary`, 20, y + 35);
    
    return y + 40;
  }

  private static addFooter(pdf: jsPDF, invoiceData: InvoiceData) {
    const pageHeight = pdf.internal.pageSize.height;
    const footerY = pageHeight - 40;
    
    // Notes
    if (invoiceData.notes) {
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      pdf.text('NOTES:', 20, footerY - 20);
      
      const splitNotes = pdf.splitTextToSize(invoiceData.notes, 170);
      pdf.text(splitNotes, 20, footerY - 15);
    }
    
    // Conditions
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text('• Cette facture proforma est valable 30 jours', 20, footerY);
    pdf.text('• Installation gratuite à Antananarivo', 20, footerY + 5);
    pdf.text('• Garantie constructeur applicable', 20, footerY + 10);
    pdf.text('• Paiement: Espèces, Mobile Money, Virement bancaire', 20, footerY + 15);
    
    // Misaotra - positionné tout en bas
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(44, 82, 130);
    pdf.text('Misaotra tompoko!', 150, pageHeight - 10);
  }

  static generateInvoice(invoiceData: InvoiceData): jsPDF {
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Header
    this.addHeader(pdf);
    
    // Invoice info
    this.addInvoiceInfo(pdf, invoiceData);
    
    // Customer info
    this.addCustomerInfo(pdf, invoiceData.customer);
    
    // Products table
    let currentY = this.addProductsTable(pdf, invoiceData.products);
    currentY += 10;
    
    // Delivery info
    currentY = this.addDeliveryInfo(pdf, invoiceData, currentY);
    currentY += 10;
    
    // Totals
    currentY = this.addTotals(pdf, invoiceData, currentY);
    
    // Footer
    this.addFooter(pdf, invoiceData);
    
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