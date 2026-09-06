<?php
/**
 * Socle commun des points d'entree PHP du site Tsena Imprimante (o2switch).
 *
 * Audit pre-lancement du 06/09/2026 : le site n'avait aucun serveur. Les
 * formulaires ouvraient mailto:/WhatsApp et affichaient « envoye » sans preuve.
 *
 * Donnees : hors de la racine web, dans <home>/.tsena-donnees/ (cree au besoin).
 * Secrets : <home>/.tsena-secrets/config.php (voir config.exemple.php), jamais
 * dans le depot ni dans la racine web.
 */
declare(strict_types=1);

const TSENA_VERSION = '2026-09-06';

function tsena_home(): string
{
    $racine = rtrim((string)($_SERVER['DOCUMENT_ROOT'] ?? __DIR__ . '/..'), '/\\');
    return dirname($racine);
}

function tsena_dossier_donnees(): string
{
    $d = tsena_home() . '/.tsena-donnees';
    if (!is_dir($d)) {
        @mkdir($d, 0700, true);
    }
    return $d;
}

/** Configuration : valeurs par defaut, surchargees par <home>/.tsena-secrets/config.php */
function tsena_config(): array
{
    static $cfg = null;
    if ($cfg !== null) {
        return $cfg;
    }
    $cfg = [
        'email_destinataire' => 'tsenaimprimante@gmail.com',
        'email_expediteur'   => 'no-reply@fonenako.mg',   // domaine avec SPF/DKIM chez o2switch
        'telegram_token'     => '',                        // jeton du bot (ex. @TsenaImprimante_bot)
        'telegram_chat_id'   => '',                        // identifiant Telegram d'Andry
        'cle_rapport'        => '',                        // cle pour /api/rapport.php
        'sel'                => '',                        // sel de hachage (genere si vide)
    ];
    $fichier = tsena_home() . '/.tsena-secrets/config.php';
    if (is_file($fichier)) {
        $perso = include $fichier;
        if (is_array($perso)) {
            $cfg = array_merge($cfg, $perso);
        }
    }
    if ($cfg['sel'] === '') {
        $fs = tsena_dossier_donnees() . '/sel.txt';
        if (!is_file($fs)) {
            @file_put_contents($fs, bin2hex(random_bytes(16)), LOCK_EX);
        }
        $cfg['sel'] = (string)@file_get_contents($fs);
    }
    return $cfg;
}

function tsena_repondre(int $code, array $donnees): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($donnees, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/** Corps JSON (limite 32 Ko), ou null. */
function tsena_json_entree(int $max = 32768): ?array
{
    $brut = file_get_contents('php://input', false, null, 0, $max + 1);
    if ($brut === false || $brut === '' || strlen($brut) > $max) {
        return null;
    }
    $d = json_decode($brut, true);
    return is_array($d) ? $d : null;
}

/** Meme origine exigee (les navigateurs envoient Origin sur les POST ; sinon Referer). */
function tsena_origine_ok(): bool
{
    $hote = (string)($_SERVER['HTTP_HOST'] ?? '');
    $origine = (string)($_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '');
    if ($hote === '' || $origine === '') {
        return false;
    }
    $h = parse_url($origine, PHP_URL_HOST);
    return is_string($h) && strcasecmp($h, $hote) === 0;
}

function tsena_ip(): string
{
    return (string)($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
}

/** Haché du visiteur, renouvele chaque jour : compte les visiteurs uniques sans conserver l'IP. */
function tsena_visiteur_hache(): string
{
    $cfg = tsena_config();
    return substr(hash('sha256', tsena_ip() . '|' . ($_SERVER['HTTP_USER_AGENT'] ?? '') . '|' . date('Y-m-d') . '|' . $cfg['sel']), 0, 16);
}

/**
 * Limiteur de debit par IP (fichier par cle, fenetre glissante simple).
 * Retourne true si l'appel est autorise.
 */
function tsena_limiter(string $cle, int $max, int $fenetre_s): bool
{
    $dossier = tsena_dossier_donnees() . '/limites';
    if (!is_dir($dossier)) {
        @mkdir($dossier, 0700, true);
    }
    $f = $dossier . '/' . $cle . '-' . substr(hash('sha256', tsena_ip() . tsena_config()['sel']), 0, 20) . '.json';
    $maintenant = time();
    $liste = [];
    if (is_file($f)) {
        $liste = json_decode((string)@file_get_contents($f), true) ?: [];
    }
    $liste = array_values(array_filter($liste, fn($t) => is_int($t) && $t > $maintenant - $fenetre_s));
    if (count($liste) >= $max) {
        return false;
    }
    $liste[] = $maintenant;
    @file_put_contents($f, json_encode($liste), LOCK_EX);
    // menage occasionnel des vieux fichiers de limite
    if (random_int(1, 200) === 1) {
        foreach (glob($dossier . '/*.json') ?: [] as $vieux) {
            if (filemtime($vieux) < $maintenant - 86400 * 2) {
                @unlink($vieux);
            }
        }
    }
    return true;
}

/** Ajoute une ligne JSON a un journal (JSONL), verrou exclusif. */
function tsena_journal(string $sous_dossier, string $nom_fichier, array $ligne): bool
{
    $dossier = tsena_dossier_donnees() . '/' . $sous_dossier;
    if (!is_dir($dossier)) {
        @mkdir($dossier, 0700, true);
    }
    $ok = @file_put_contents($dossier . '/' . $nom_fichier, json_encode($ligne, JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX);
    return $ok !== false;
}

function tsena_texte(mixed $v, int $max): string
{
    if (!is_string($v)) {
        return '';
    }
    $v = trim(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]/u', '', $v) ?? '');
    return mb_substr($v, 0, $max);
}

/** Notification Telegram (silencieuse si non configuree ou en echec). */
function tsena_telegram(string $texte): bool
{
    $cfg = tsena_config();
    if ($cfg['telegram_token'] === '' || $cfg['telegram_chat_id'] === '' || !function_exists('curl_init')) {
        return false;
    }
    $ch = curl_init('https://api.telegram.org/bot' . $cfg['telegram_token'] . '/sendMessage');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query(['chat_id' => $cfg['telegram_chat_id'], 'text' => mb_substr($texte, 0, 3900), 'disable_web_page_preview' => true]),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 5,
        CURLOPT_CONNECTTIMEOUT => 3,
    ]);
    $r = curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);
    return $r !== false && $code === 200;
}

/** E-mail texte brut, UTF-8, avec Reply-To sur le client s'il a laisse une adresse. */
function tsena_email(string $sujet, string $corps, string $reply_to = ''): bool
{
    $cfg = tsena_config();
    $entetes = [
        'From: Tsena Imprimante <' . $cfg['email_expediteur'] . '>',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'X-Mailer: tsena-site/' . TSENA_VERSION,
    ];
    if ($reply_to !== '' && filter_var($reply_to, FILTER_VALIDATE_EMAIL)) {
        $entetes[] = 'Reply-To: ' . $reply_to;
    }
    $sujet_enc = '=?UTF-8?B?' . base64_encode($sujet) . '?=';
    return @mail($cfg['email_destinataire'], $sujet_enc, $corps, implode("\r\n", $entetes));
}
