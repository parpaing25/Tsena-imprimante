<?php
/**
 * MODELE de configuration serveur. A copier HORS de la racine web :
 *   /home/<compte>/.tsena-secrets/config.php   (chmod 600)
 * Ce fichier d'exemple est bloque par .htaccess et ne contient aucun secret.
 *
 * Les valeurs reelles vivent sur le PC d'Andry dans ~/.hermes/profiles/imprimante/.env
 * (TELEGRAM_BOT_TOKEN, TELEGRAM_ALLOWED_USERS) : les recopier ici, pas dans git.
 */
return [
    // Ou arrivent les demandes des clients
    'email_destinataire' => 'tsenaimprimante@gmail.com',
    // Expediteur : un domaine dont le SPF autorise le serveur o2switch (fonenako.mg l'a)
    'email_expediteur'   => 'no-reply@fonenako.mg',
    // Notification Telegram immediate (bot @TsenaImprimante_bot + identifiant d'Andry)
    'telegram_token'     => '123456789:AAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'telegram_chat_id'   => '123456789',
    // Cle du rapport hebdomadaire (longue et aleatoire) : openssl rand -hex 24
    'cle_rapport'        => 'remplacer-par-48-caracteres-aleatoires',
];
