// Banc du « montant en lettres » du devis proforma.
//   node tests/montant_en_lettres.mjs
//
// Incident du 13/10/2026 : pour 70-79 et 90-99 le code lisait units[unitsDigit + 10], hors du
// tableau, et tout total qui y tombait sortait « quatre-vingt-undefined mille » sur le devis
// envoyé au client (3 295 000 Ar = deux G2470 + une MF3010 + livraison).
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../src/utils/pdfGenerator.ts', import.meta.url), 'utf8');
const code = src.slice(src.indexOf('function numberToWords'), src.indexOf('export interface InvoiceData'));
const enLettres = new Function(code.replace(/:\s*(number|string|boolean)/g, '') +
  '; return numberToWords;')();

// 13/10/2026 au soir : le banc attendait « vingt-un » et « soixante-onze mille », c'est-à-dire
// les fautes elles-mêmes. Formes correctes (orthographe classique) : vingt et un, soixante et
// onze ; quatre-vingts et deux cents en fin de nombre ou devant millions, jamais devant mille.
const attendus = [
  [0, 'zéro'], [1, 'un'], [16, 'seize'], [20, 'vingt'], [21, 'vingt et un'],
  [31, 'trente et un'], [61, 'soixante et un'], [22, 'vingt-deux'],
  [70, 'soixante-dix'], [71, 'soixante et onze'], [72, 'soixante-douze'], [79, 'soixante-dix-neuf'],
  [80, 'quatre-vingts'], [81, 'quatre-vingt-un'], [90, 'quatre-vingt-dix'], [91, 'quatre-vingt-onze'],
  [95, 'quatre-vingt-quinze'], [99, 'quatre-vingt-dix-neuf'],
  [100, 'cent'], [101, 'cent un'], [200, 'deux cents'], [280, 'deux cent quatre-vingts'],
  [1000, 'mille'], [1001, 'mille un'], [2000, 'deux mille'], [3200, 'trois mille deux cents'],
  [21000, 'vingt et un mille'], [71000, 'soixante et onze mille'], [80000, 'quatre-vingt mille'],
  [95000, 'quatre-vingt-quinze mille'], [200000, 'deux cent mille'], [280000, 'deux cent quatre-vingt mille'],
  [1000000, 'un million'], [2000000, 'deux millions'], [21000000, 'vingt et un millions'],
  [80000000, 'quatre-vingts millions'], [200000000, 'deux cents millions'],
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
