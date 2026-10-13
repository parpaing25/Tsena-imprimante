/**
 * Remplaçant vide de html2canvas.
 *
 * jsPDF embarque html2canvas pour sa méthode `pdf.html()`, que le site n'appelle jamais :
 * le devis est dessiné instruction par instruction (`src/utils/pdfGenerator.ts`). Ce module
 * vide évite 200 Ko de JavaScript téléchargés par chaque client qui demande un devis
 * (mesuré le 13/10/2026 : assets/html2canvas.esm-CBrSDip1.js, 200 Ko).
 */
export default function html2canvas(): never {
  throw new Error("html2canvas n'est pas embarqué : le devis est dessiné directement par jsPDF.");
}
