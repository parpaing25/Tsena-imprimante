// Banc du « montant en lettres » du devis proforma.
//   node tests/montant_en_lettres.mjs
//
// Incident du 13/10/2026 : pour 70-79 et 90-99 le code lisait units[unitsDigit + 10], hors du
// tableau, et tout total qui y tombait sortait « quatre-vingt-undefined mille » sur le devis
// envoyé au client (3 295 000 Ar = deux G2470 + une MF3010 + livraison).
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../src/utils/pdfGenerator.ts', import.meta.url), 'utf8');
const code = src.slice(src.indexOf('function numberToWords'), src.indexOf('export interface InvoiceData'));
const enLettres = new Function(code.replace(/:\s*number/g, '').replace(/:\s*string/g, '') +
  '; return numberToWords;')();

const attendus = [
  [0, 'zéro'], [1, 'un'], [16, 'seize'], [20, 'vingt'], [21, 'vingt-un'],
  [70, 'soixante-dix'], [71, 'soixante-onze'], [79, 'soixante-dix-neuf'],
  [80, 'quatre-vingts'], [81, 'quatre-vingt-un'], [90, 'quatre-vingt-dix'],
  [95, 'quatre-vingt-quinze'], [99, 'quatre-vingt-dix-neuf'],
  [100, 'cent'], [1000, 'mille'], [1001, 'mille un'], [2000, 'deux mille'],
  [71000, 'soixante-onze mille'], [95000, 'quatre-vingt-quinze mille'],
  [1000000, 'un million'], [2000000, 'deux millions'],
  [1795000, 'un million sept cent quatre-vingt-quinze mille'],
  [3295000, 'trois millions deux cent quatre-vingt-quinze mille'],
];

let fautes = 0;
for (const [n, attendu] of attendus) {
  const rendu = String(enLettres(n)).trim();
  if (rendu !== attendu) { fautes++; console.log(`✗ ${n} → « ${rendu} »   attendu « ${attendu} »`); }
}

// Aucun montant de 1 à 9 999 999 ne doit produire « undefined » ni de double espace.
let balayes = 0, sales = [];
for (let n = 1; n <= 9999999; n += 7) {
  const t = String(enLettres(n));
  balayes++;
  if (t.includes('undefined') || t.includes('  ') || t.trim() !== t) { sales.push(n); if (sales.length > 5) break; }
}
if (sales.length) { fautes++; console.log('✗ montants mal écrits :', sales.join(', ')); }

console.log(`${attendus.length} cas attendus, ${balayes} montants balayés — ${fautes} faute(s)`);
process.exit(fautes ? 1 : 0);
