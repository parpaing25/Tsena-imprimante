'use client'

import { motion } from 'framer-motion'

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-16"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Politique de confidentialité
          </h1>

          <div className="prose prose-gray max-w-none">
            <h2>Collecte des données</h2>
            <p>
              Nous collectons uniquement les données nécessaires au traitement de vos demandes :
            </p>
            <ul>
              <li>Nom et prénom</li>
              <li>Numéro de téléphone</li>
              <li>Adresse email</li>
              <li>Localisation (région)</li>
              <li>Informations sur vos besoins en impression</li>
            </ul>

            <h2>Utilisation des données</h2>
            <p>Vos données personnelles sont utilisées pour :</p>
            <ul>
              <li>Traiter vos demandes de devis</li>
              <li>Vous contacter pour finaliser votre commande</li>
              <li>Vous fournir un support technique</li>
              <li>Améliorer nos services</li>
            </ul>

            <h2>Protection des données</h2>
            <p>
              Nous mettons en œuvre toutes les mesures techniques et organisationnelles 
              appropriées pour protéger vos données personnelles contre la perte, 
              l'utilisation abusive ou l'accès non autorisé.
            </p>

            <h2>Partage des données</h2>
            <p>
              Vos données personnelles ne sont jamais vendues, louées ou partagées 
              avec des tiers à des fins commerciales. Elles peuvent être transmises 
              uniquement dans les cas suivants :
            </p>
            <ul>
              <li>Avec votre consentement explicite</li>
              <li>Pour répondre à une obligation légale</li>
              <li>À nos partenaires techniques (livraison, installation) dans le cadre strict de l'exécution de votre commande</li>
            </ul>

            <h2>Vos droits</h2>
            <p>Conformément à la réglementation, vous disposez des droits suivants :</p>
            <ul>
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit d'effacement</li>
              <li>Droit d'opposition au traitement</li>
            </ul>

            <h2>Contact</h2>
            <p>
              Pour exercer vos droits ou pour toute question concernant cette politique, 
              contactez-nous au 033 71 063 34 ou via notre page contact.
            </p>

            <p className="text-sm text-gray-500 mt-8">
              Dernière mise à jour : Janvier 2025
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}