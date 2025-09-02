'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  LightBulbIcon, 
  CalculatorIcon, 
  CogIcon, 
  QuestionMarkCircleIcon,
  ArrowRightIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'

const guides = [
  {
    id: 'choisir-imprimante',
    title: 'Comment choisir son imprimante ?',
    description: 'Guide complet pour sélectionner l\'imprimante parfaite selon vos besoins et votre budget.',
    icon: LightBulbIcon,
    readTime: '8 min',
    category: 'Guide d\'achat'
  },
  {
    id: 'types-imprimantes',
    title: 'Jet d\'encre vs Laser vs Réservoir',
    description: 'Comparatif détaillé des différentes technologies d\'impression pour faire le bon choix.',
    icon: CogIcon,
    readTime: '6 min',
    category: 'Comparatif'
  },
  {
    id: 'cout-par-page',
    title: 'Calculer le coût par page',
    description: 'Apprenez à calculer le vrai coût d\'impression et économisez sur vos consommables.',
    icon: CalculatorIcon,
    readTime: '5 min',
    category: 'Économies'
  },
  {
    id: 'volume-mensuel',
    title: 'Estimer son volume d\'impression',
    description: 'Méthodes pour évaluer vos besoins mensuels et choisir l\'imprimante adaptée.',
    icon: QuestionMarkCircleIcon,
    readTime: '4 min',
    category: 'Planification'
  },
  {
    id: 'impression-mobile',
    title: 'Imprimer depuis son smartphone',
    description: 'Guide pour configurer et utiliser l\'impression mobile avec votre imprimante Wi-Fi.',
    icon: LightBulbIcon,
    readTime: '7 min',
    category: 'Tutoriel'
  },
  {
    id: 'entretien',
    title: 'Entretenir son imprimante',
    description: 'Conseils pratiques pour prolonger la durée de vie de votre imprimante.',
    icon: CogIcon,
    readTime: '6 min',
    category: 'Maintenance'
  }
]

export default function ConseilsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Conseils & Guides d'experts
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nos experts vous partagent leurs conseils pour bien choisir, utiliser et entretenir votre imprimante.
          </p>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-blue-600 rounded-lg p-8 mb-12 text-center text-white"
        >
          <h2 className="text-2xl font-bold mb-4">
            Besoin de conseils personnalisés ?
          </h2>
          <p className="text-blue-100 mb-6">
            Notre équipe d'experts vous conseille gratuitement par téléphone ou Messenger.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => window.location.href = 'tel:+261337106334'}
            >
              <PhoneIcon className="mr-2 h-5 w-5" />
              Appeler 033 71 063 34
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
              onClick={() => window.open('https://m.me/TsenaImprimante', '_blank')}
            >
              Messenger
            </Button>
          </div>
        </motion.div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {guides.map((guide, index) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
            >
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <guide.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-sm text-blue-600 font-medium">{guide.category}</span>
                    <p className="text-sm text-gray-500">{guide.readTime} de lecture</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {guide.title}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {guide.description}
                </p>
                
                <Button variant="outline" className="w-full group-hover:border-blue-600 group-hover:text-blue-600" asChild>
                  <Link href={`/conseils/${guide.id}`}>
                    Lire le guide
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Cost Calculator Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-8 text-center text-white mb-16"
        >
          <CalculatorIcon className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">
            Simulateur de coût par page
          </h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Calculez précisément le coût d'impression de vos documents et comparez les différentes technologies.
          </p>
          <Button
            size="lg"
            className="bg-white text-green-600 hover:bg-gray-100"
            asChild
          >
            <Link href="/simulateur">
              Utiliser le simulateur
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}