'use client'

import { TruckIcon, WrenchScrewdriverIcon, ShieldCheckIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const features = [
  {
    icon: TruckIcon,
    title: 'Livraison en province',
    description: 'Nous livrons dans toute l\'île de Madagascar avec un service rapide et sécurisé.'
  },
  {
    icon: WrenchScrewdriverIcon,
    title: 'Installation GRATUITE à Tana',
    description: 'Installation et configuration gratuites pour tous nos clients d\'Antananarivo.'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Garantie constructeur',
    description: 'Tous nos produits bénéficient de la garantie officielle du constructeur.'
  },
  {
    icon: PhoneIcon,
    title: 'Support technique',
    description: 'Notre équipe vous accompagne pour tous vos besoins techniques et SAV.'
  }
]

export default function Features() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pourquoi choisir Tsena Imprimante ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nous vous accompagnons dans tous vos projets d'impression avec des services adaptés au marché malgache.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4 group-hover:bg-blue-700 transition-colors">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}