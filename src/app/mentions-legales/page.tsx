'use client'

import { motion } from 'framer-motion'

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-16"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Mentions légales
          </h1>

          <div className="prose prose-gray max-w-none">
            <h2>Informations légales</h2>
            <p>
              <strong>Raison sociale :</strong> Tsena Imprimante sy ny tontolony<br />
              <strong>Forme juridique :</strong> Entreprise individuelle<br />
              <strong>Adresse :</strong> Antananarivo, Madagascar<br />
              <strong>Téléphone :</strong> 033 71 063 34<br />
              <strong>Email :</strong> contact@tsena-imprimante.mg
            </p>

            <h2>Activité</h2>
            <p>
              Tsena Imprimante est spécialisée dans la vente d'imprimantes, de matériels informatiques 
              et de consommables. Nous proposons également des services d'installation, de maintenance 
              et de support technique.
            </p>

            <h2>Propriété intellectuelle</h2>
            <p>
              L'ensemble de ce site relève de la législation malgache et internationale sur le droit d'auteur 
              et la propriété intellectuelle. Tous les droits de reproduction sont réservés.
            </p>

            <h2>Données personnelles</h2>
            <p>
              Les informations recueillies sur ce site sont nécessaires au traitement de vos demandes 
              de devis et à l'amélioration de nos services. Elles ne sont jamais transmises à des tiers 
              sans votre consentement explicite.
            </p>

            <h2>Cookies</h2>
            <p>
              Ce site utilise des cookies techniques nécessaires à son bon fonctionnement. 
              Aucun cookie de tracking ou publicitaire n'est utilisé.
            </p>

            <h2>Responsabilité</h2>
            <p>
              Les informations contenues sur ce site sont données à titre indicatif. 
              Tsena Imprimante s'efforce de maintenir ces informations à jour mais ne peut 
              garantir leur exactitude absolue.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}