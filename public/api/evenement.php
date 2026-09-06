<?php
/**
 * POST /api/evenement.php — mesure d'audience et d'erreurs, premiere partie.
 *
 * Entree JSON (sendBeacon) : { t: "page"|"evt"|"err", p: chemin, r?: provenance,
 *   l?: langue, w?: largeur, n?: nom d'evenement, d?: details, m?: message, s?: source, h: horodatage }
 * Aucune IP conservee : un hache journalier (IP + navigateur + sel) compte les
 * visiteurs uniques du jour, et devient inexploitable le lendemain.
 */
declare(strict_types=1);
require __DIR__ . '/_commun.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    tsena_repondre(405, ['ok' => false]);
}
if (!tsena_origine_ok()) {
    http_response_code(204);
    exit;
}
if (!tsena_limiter('evt', 400, 3600)) {
    http_response_code(204);
    exit;
}
$d = tsena_json_entree(4096);
if ($d === null) {
    http_response_code(204);
    exit;
}
$t = tsena_texte($d['t'] ?? '', 8);
if (!in_array($t, ['page', 'evt', 'err'], true)) {
    http_response_code(204);
    exit;
}
$ua = (string)($_SERVER['HTTP_USER_AGENT'] ?? '');
$appareil = preg_match('/Mobile|Android|iPhone/i', $ua) ? 'mobile' : (preg_match('/iPad|Tablet/i', $ua) ? 'tablette' : 'ordinateur');
$ligne = [
    'q' => date('c'),
    't' => $t,
    'v' => tsena_visiteur_hache(),
    'a' => $appareil,
    'p' => tsena_texte($d['p'] ?? '', 200),
];
if ($t === 'page') {
    $ligne['r'] = tsena_texte($d['r'] ?? '', 100);
    $ligne['l'] = tsena_texte($d['l'] ?? '', 10);
    $ligne['w'] = max(0, min(10000, (int)($d['w'] ?? 0)));
} elseif ($t === 'evt') {
    $ligne['n'] = tsena_texte($d['n'] ?? '', 40);
    $ligne['d'] = is_array($d['d'] ?? null) ? array_slice(array_map(fn($x) => is_scalar($x) ? mb_substr((string)$x, 0, 80) : '', $d['d']), 0, 8, true) : [];
} else {
    $ligne['m'] = tsena_texte($d['m'] ?? '', 200);
    $ligne['s'] = tsena_texte($d['s'] ?? '', 120);
    $ligne['ua'] = mb_substr($ua, 0, 120);
}
tsena_journal('evenements', date('Y-m-d') . '.jsonl', $ligne);
http_response_code(204);
