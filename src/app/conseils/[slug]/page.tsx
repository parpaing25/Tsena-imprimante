'use client'

import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline'

interface GuidePageProps {
  params: {
    slug: string
  }
}

const guides = {
  'choisir-imprimante': {
    title: 'Comment choisir son imprimante ?',
    readTime: '8 min',
    author: 'Équipe Tsena Imprimante',
    content: `
      <h2>1. Définir ses besoins</h2>
      <p>Avant tout achat, il est essentiel de bien cerner vos besoins d'impression :</p>
      <ul>
        <li><strong>Volume mensuel :</strong> Combien de pages imprimez-vous par mois ?</li>
        <li><strong>Type de documents :</strong> Texte, photos, graphiques ?</li>
        <li><strong>Format :</strong> A4, A3, ou formats spéciaux ?</li>
        <li><strong>Couleur :</strong> Avez-vous besoin d'imprimer en couleur ?</li>
      </ul>

      <h2>2. Choisir la technologie</h2>
      <h3>Jet d'encre classique</h3>
      <p>Idéal pour un usage occasionnel (moins de 100 pages/mois). Prix d'achat abordable mais coût par page élevé.</p>
      
      <h3>Réservoir d'encre</h3>
      <p>Parfait pour un usage régulier (100-1000 pages/mois). Investissement initial plus élevé mais coût par page très réduit.</p>
      
      <h3>Laser</h3>
      <p>Recommandé pour les gros volumes (plus de 500 pages/mois) et l'impression de texte. Très rapide et économique.</p>

      <h2>3. Les fonctionnalités importantes</h2>
      <ul>
        <li><strong>Wi-Fi :</strong> Pour imprimer depuis smartphone/tablette</li>
        <li><strong>Recto-verso automatique :</strong> Économise le papier</li>
        <li><strong>Chargeur automatique (ADF) :</strong> Pour scanner/copier plusieurs pages</li>
        <li><strong>Écran tactile :</strong> Facilite l'utilisation</li>
      </ul>

      <h2>4. Budget et coût total</h2>
      <p>Ne considérez pas seulement le prix d'achat, mais aussi :</p>
      <ul>
        <li>Le coût des consommables</li>
        <li>La fréquence de remplacement</li>
        <li>La consommation électrique</li>
        <li>Les coûts de maintenance</li>
      </ul>
    `
  },
  'types-imprimantes': {
    title: 'Jet d\'encre vs Laser vs Réservoir',
    readTime: '6 min',
    author: 'Équipe Tsena Imprimante',
    content: `
      <h2>Comparatif des technologies d'impression</h2>
      
      <h3>Imprimantes à jet d'encre</h3>
      <h4>Avantages :</h4>
      <ul>
        <li>Prix d'achat abordable</li>
        <li>Excellente qualité photo</li>
        <li>Compactes et silencieuses</li>
        <li>Idéales pour usage domestique</li>
      </ul>
      <h4>Inconvénients :</h4>
      <ul>
        <li>Coût par page élevé</li>
        <li>Cartouches qui sèchent</li>
        <li>Vitesse d'impression lente</li>
      </ul>

      <h3>Imprimantes à réservoir d'encre</h3>
      <h4>Avantages :</h4>
      <ul>
        <li>Coût par page très réduit</li>
        <li>Grande autonomie</li>
        <li>Qualité photo excellente</li>
        <li>Rechargeable facilement</li>
      </ul>
      <h4>Inconvénients :</h4>
      <ul>
        <li>Prix d'achat plus élevé</li>
        <li>Risque de fuite si mal manipulé</li>
      </ul>

      <h3>Imprimantes laser</h3>
      <h4>Avantages :</h4>
      <ul>
        <li>Très rapide</li>
        <li>Coût par page réduit</li>
        <li>Toner longue durée</li>
        <li>Texte très net</li>
      </ul>
      <h4>Inconvénients :</h4>
      <ul>
        <li>Prix d'achat élevé</li>
        <li>Qualité photo limitée</li>
        <li>Plus encombrantes</li>
      </ul>
    `
  }
}

export default function GuidePage({ params }: GuidePageProps) {
  const guide = guides[params.slug as keyof typeof guides]
  
  if (!guide) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button variant="ghost" asChild className="text-gray-600 hover:text-gray-900">
            <Link href="/conseils">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Retour aux conseils
            </Link>
          </Button>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-16"
        >
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {guide.title}
            </h1>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-4 w-4" />
                <span>{guide.readTime} de lecture</span>
              </div>
              <div className="flex items-center space-x-2">
                <UserIcon className="h-4 w-4" />
                <span>{guide.author}</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div 
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: guide.content }}
          />

          {/* CTA */}
          <div className="mt-12 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Besoin d'aide pour choisir ?
            </h3>
            <p className="text-gray-600 mb-4">
              Notre équipe vous conseille gratuitement pour trouver l'imprimante parfaite.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => window.location.href = 'tel:+261337106334'}>
                Appeler 033 71 063 34
              </Button>
              <Button variant="outline" asChild>
                <Link href="/devis">Demander un devis</Link>
              </Button>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  )
}