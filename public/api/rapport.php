<?php
/**
 * GET /api/rapport.php?cle=…&jours=7 — agregats d'audience, conversions, erreurs
 * et demandes, pour le rapport hebdomadaire (outils/rapport_hebdo.py) et
 * l'agent d'amelioration. Protege par la cle `cle_rapport` de la configuration.
 * Ne renvoie AUCUNE donnee personnelle (pas de nom, telephone, e-mail, message).
 */
declare(strict_types=1);
require __DIR__ . '/_commun.php';

$cfg = tsena_config();
$cle = (string)($_GET['cle'] ?? '');
if ($cfg['cle_rapport'] === '' || !hash_equals($cfg['cle_rapport'], $cle)) {
    tsena_limiter('rapport-refus', 20, 3600) || tsena_repondre(429, ['ok' => false]);
    tsena_repondre(403, ['ok' => false, 'erreur' => 'cle invalide']);
}
$jours = max(1, min(90, (int)($_GET['jours'] ?? 7)));
$depuis = new DateTimeImmutable("-{$jours} days");
$dossier = tsena_dossier_donnees();

$pages = []; $visiteurs = []; $provenances = []; $appareils = []; $evenements = []; $erreurs = []; $par_jour = [];
for ($i = 0; $i < $jours; $i++) {
    $jour = $depuis->modify("+{$i} days")->format('Y-m-d');
    $f = "$dossier/evenements/$jour.jsonl";
    if (!is_file($f)) {
        continue;
    }
    foreach (file($f, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $l) {
        $e = json_decode($l, true);
        if (!is_array($e)) {
            continue;
        }
        $t = $e['t'] ?? '';
        if ($t === 'page') {
            $pages[$e['p'] ?? '?'] = ($pages[$e['p'] ?? '?'] ?? 0) + 1;
            $visiteurs[$jour][$e['v'] ?? ''] = true;
            $par_jour[$jour] = ($par_jour[$jour] ?? 0) + 1;
            $r = ($e['r'] ?? '') ?: '(direct)';
            $provenances[$r] = ($provenances[$r] ?? 0) + 1;
            $appareils[$e['a'] ?? '?'] = ($appareils[$e['a'] ?? '?'] ?? 0) + 1;
        } elseif ($t === 'evt') {
            $evenements[$e['n'] ?? '?'] = ($evenements[$e['n'] ?? '?'] ?? 0) + 1;
        } elseif ($t === 'err') {
            $k = ($e['m'] ?? '?') . ' @ ' . ($e['s'] ?? '');
            $erreurs[$k] = ($erreurs[$k] ?? 0) + 1;
        }
    }
}
arsort($pages); arsort($provenances); arsort($evenements); arsort($erreurs);

$leads = ['total' => 0, 'par_type' => [], 'par_jour' => []];
foreach (glob("$dossier/leads/*.jsonl") ?: [] as $f) {
    foreach (file($f, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $l) {
        $x = json_decode($l, true);
        if (!is_array($x) || !isset($x['recu_le']) || new DateTimeImmutable($x['recu_le']) < $depuis) {
            continue;
        }
        $leads['total']++;
        $leads['par_type'][$x['type'] ?? '?'] = ($leads['par_type'][$x['type'] ?? '?'] ?? 0) + 1;
        $j = substr($x['recu_le'], 0, 10);
        $leads['par_jour'][$j] = ($leads['par_jour'][$j] ?? 0) + 1;
    }
}

tsena_repondre(200, [
    'ok' => true,
    'genere_le' => date('c'),
    'jours' => $jours,
    'pages_vues' => array_sum($pages),
    'visiteurs_uniques_par_jour' => array_map('count', $visiteurs),
    'pages_vues_par_jour' => $par_jour,
    'pages' => array_slice($pages, 0, 30, true),
    'provenances' => array_slice($provenances, 0, 20, true),
    'appareils' => $appareils,
    'evenements' => $evenements,
    'erreurs' => array_slice($erreurs, 0, 20, true),
    'demandes' => $leads,
]);
