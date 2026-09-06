<?php
/**
 * POST /api/lead.php — reception d'une demande (contact, commande, devis).
 *
 * Entree JSON : { type, nom, telephone?, email?, entreprise?, region?, sujet?,
 *                message?, produits?[], livraison?, total?, page?, site_web? }
 * Sortie JSON : { ok: true, id: "TS-260906-1A2B" } ou { ok: false, erreur }
 *
 * Garde-fous : meme origine, piege a robots (site_web), tailles bornees,
 * telephone malgache, 10 envois / heure et 40 / jour par IP. La demande est
 * ecrite AVANT toute notification : une notification qui echoue ne perd rien.
 */
declare(strict_types=1);
require __DIR__ . '/_commun.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    tsena_repondre(405, ['ok' => false, 'erreur' => 'POST attendu']);
}
if (!tsena_origine_ok()) {
    tsena_repondre(403, ['ok' => false, 'erreur' => 'origine refusee']);
}
$d = tsena_json_entree();
if ($d === null) {
    tsena_repondre(400, ['ok' => false, 'erreur' => 'JSON invalide']);
}

// Piege a robots : un humain ne voit pas ce champ. On repond « ok » sans rien garder.
if (tsena_texte($d['site_web'] ?? '', 200) !== '') {
    tsena_repondre(200, ['ok' => true, 'id' => 'TS-' . date('ymd') . '-0000']);
}

if (!tsena_limiter('lead-h', 10, 3600) || !tsena_limiter('lead-j', 40, 86400)) {
    tsena_repondre(429, ['ok' => false, 'erreur' => 'trop de demandes, reessayez plus tard']);
}

$types = ['contact', 'commande', 'devis'];
$type = tsena_texte($d['type'] ?? '', 20);
if (!in_array($type, $types, true)) {
    tsena_repondre(400, ['ok' => false, 'erreur' => 'type inconnu']);
}
$nom = tsena_texte($d['nom'] ?? '', 80);
if (mb_strlen($nom) < 2) {
    tsena_repondre(400, ['ok' => false, 'erreur' => 'nom manquant']);
}
$telephone = preg_replace('/[\s.\-]/', '', tsena_texte($d['telephone'] ?? '', 30)) ?? '';
if ($telephone !== '' && !preg_match('/^(\+261|0)(3[2-4]|3[7-8])\d{7}$/', $telephone)) {
    tsena_repondre(400, ['ok' => false, 'erreur' => 'telephone invalide']);
}
if ($type !== 'contact' && $telephone === '') {
    tsena_repondre(400, ['ok' => false, 'erreur' => 'telephone requis']);
}
$email = tsena_texte($d['email'] ?? '', 120);
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    tsena_repondre(400, ['ok' => false, 'erreur' => 'email invalide']);
}
$message = tsena_texte($d['message'] ?? '', 3000);
if ($type === 'contact' && $message === '') {
    tsena_repondre(400, ['ok' => false, 'erreur' => 'message manquant']);
}

$produits = [];
if (isset($d['produits']) && is_array($d['produits'])) {
    foreach (array_slice($d['produits'], 0, 20) as $p) {
        if (!is_array($p)) {
            continue;
        }
        $produits[] = [
            'id' => tsena_texte($p['id'] ?? '', 60),
            'nom' => tsena_texte($p['nom'] ?? '', 80),
            'quantite' => max(1, min(99, (int)($p['quantite'] ?? 1))),
            'prix' => max(0, min(100000000, (int)($p['prix'] ?? 0))),
            'option' => tsena_texte($p['option'] ?? '', 40),
        ];
    }
}

$id = 'TS-' . date('ymd') . '-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 4));
$lead = [
    'id' => $id,
    'recu_le' => date('c'),
    'type' => $type,
    'nom' => $nom,
    'telephone' => $telephone,
    'email' => $email,
    'entreprise' => tsena_texte($d['entreprise'] ?? '', 120),
    'region' => tsena_texte($d['region'] ?? '', 60),
    'sujet' => tsena_texte($d['sujet'] ?? '', 120),
    'message' => $message,
    'produits' => $produits,
    'livraison' => tsena_texte($d['livraison'] ?? '', 300),
    'total' => max(0, min(1000000000, (int)($d['total'] ?? 0))),
    'page' => tsena_texte($d['page'] ?? '', 200),
    'visiteur' => tsena_visiteur_hache(),
    'traite' => false,
];

if (!tsena_journal('leads', date('Y-m') . '.jsonl', $lead)) {
    tsena_repondre(500, ['ok' => false, 'erreur' => 'enregistrement impossible']);
}

// ── Notifications (apres l'ecriture : leur echec ne perd pas la demande) ──
$lignes = ['[' . strtoupper($type) . '] ' . $id, 'Nom : ' . $nom];
if ($telephone !== '') $lignes[] = 'Tel : ' . $telephone;
if ($email !== '') $lignes[] = 'E-mail : ' . $email;
if ($lead['entreprise'] !== '') $lignes[] = 'Entreprise : ' . $lead['entreprise'];
if ($lead['region'] !== '') $lignes[] = 'Region : ' . $lead['region'];
foreach ($produits as $p) {
    $lignes[] = sprintf('- %s x%d — %s Ar%s', $p['nom'], $p['quantite'], number_format($p['prix'], 0, ',', ' '), $p['option'] !== '' ? ' (' . $p['option'] . ')' : '');
}
if ($lead['livraison'] !== '') $lignes[] = 'Livraison : ' . $lead['livraison'];
if ($lead['total'] > 0) $lignes[] = 'Total : ' . number_format($lead['total'], 0, ',', ' ') . ' Ar';
if ($lead['sujet'] !== '') $lignes[] = 'Sujet : ' . $lead['sujet'];
if ($message !== '') $lignes[] = "Message :\n" . $message;
$lignes[] = 'Page : ' . $lead['page'];
$texte = implode("\n", $lignes);

$mail_ok = tsena_email('[Tsena Imprimante] ' . ucfirst($type) . ' ' . $id . ' — ' . $nom, $texte, $email);
$tg_ok = tsena_telegram("🖨️ Tsena Imprimante — nouvelle demande\n\n" . $texte);

tsena_journal('journal', date('Y-m') . '.jsonl', ['quand' => date('c'), 'quoi' => 'lead', 'id' => $id, 'mail' => $mail_ok, 'telegram' => $tg_ok]);

tsena_repondre(200, ['ok' => true, 'id' => $id]);
