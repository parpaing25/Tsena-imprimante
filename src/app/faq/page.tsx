'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon, PhoneIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'

const faqData = [
  {
    category: 'Livraison & Installation',
    questions: [
      {
        question: 'Livrez-vous dans toute l\'île de Madagascar ?',
        answer: 'Oui, nous livrons dans toutes les régions de Madagascar. Les délais varient selon la destination : 2-3 jours pour Antananarivo et environs, 5-7 jours pour les autres provinces. Les frais de livraison sont calculés selon la distance.'
      },
      {
        question: 'L\'installation est-elle vraiment gratuite à Antananarivo ?',
        answer: 'Absolument ! Pour tous nos clients d\'Antananarivo et des communes environnantes, nous offrons l\'installation et la configuration gratuites de votre imprimante. Cela inclut la connexion Wi-Fi, l\'installation des pilotes et la formation de base.'
      },
      {
        question: 'Que comprend le service d\'installation ?',
        answer: 'Notre service d\'installation comprend : déballage et positionnement, installation des cartouches/réservoirs, configuration Wi-Fi, installation des pilotes sur votre ordinateur, test d\'impression, et formation rapide à l\'utilisation.'
      }
    ]
  },
  {
    category: 'Produits & Garantie',
    questions: [
      {
        question: 'Vos imprimantes sont-elles neuves et originales ?',
        answer: 'Toutes nos imprimantes sont neuves, dans leur emballage d\'origine, et bénéficient de la garantie constructeur officielle. Nous sommes revendeurs agréés des marques Canon, HP, Epson et Brother.'
      },
      {
        question: 'Quelle est la durée de garantie ?',
        answer: 'La garantie varie selon les marques : Canon et HP offrent 1 an, Epson 2 ans, Brother 3 ans. La garantie couvre les défauts de fabrication et inclut le support technique gratuit.'
      },
      {
        question: 'Proposez-vous des consommables compatibles ?',
        answer: 'Nous proposons à la fois des consommables originaux et compatibles de qualité. Les cartouches compatibles offrent un excellent rapport qualité-prix tout en maintenant une qualité d\'impression satisfaisante.'
      }
    ]
  },
  {
    category: 'Support & SAV',
    questions: [
      {
        question: 'Comment obtenir de l\'aide technique ?',
        answer: 'Contactez-nous au 033 71 063 34 ou via Messenger. Notre équipe technique vous aide pour l\'installation, la configuration, le dépannage et l\'entretien de votre imprimante.'
      },
      {
        question: 'Que faire en cas de panne ?',
        answer: 'En cas de problème, contactez-nous immédiatement. Si l\'imprimante est sous garantie, nous organisons la réparation ou le remplacement. Pour les pannes hors garantie, nous proposons un diagnostic gratuit.'
      },
      {
        question: 'Proposez-vous des contrats de maintenance ?',
        answer: 'Oui, nous proposons des contrats de maintenance préventive pour les entreprises. Cela inclut le nettoyage régulier, le remplacement des pièces d\'usure et un support prioritaire.'
      }
    ]
  },
  {
    category: 'Paiement & Prix',
    questions: [
      {
        question: 'Quels sont vos modes de paiement ?',
        answer: 'Nous acceptons les paiements en espèces, par virement bancaire, et mobile money (Orange Money, Mvola). Pour les entreprises, nous proposons des facilités de paiement.'
      },
      {
        question: 'Vos prix incluent-ils la TVA ?',
        answer: 'Tous nos prix sont affichés TTC (toutes taxes comprises). Pour les entreprises assujetties, nous fournissons les factures avec TVA déductible.'
      },
      {
        question: 'Proposez-vous des remises pour les achats en volume ?',
        answer: 'Oui, nous accordons des remises dégressives pour les commandes importantes (écoles, entreprises, administrations). Contactez-nous pour un devis personnalisé.'
      }
    ]
  }
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Questions fréquentes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trouvez rapidement les réponses à vos questions sur nos produits, services et livraisons.
          </p>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-blue-600 rounded-lg p-6 mb-12 text-center text-white"
        >
          <h2 className="text-xl font-bold mb-4">
            Vous ne trouvez pas votre réponse ?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => window.location.href = 'tel:+261337106334'}
            >
              <PhoneIcon className="mr-2 h-5 w-5" />
              Appeler 033 71 063 34
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
              onClick={() => window.open('https://m.me/TsenaImprimante', '_blank')}
            >
              <ChatBubbleLeftRightIcon className="mr-2 h-5 w-5" />
              Messenger
            </Button>
          </div>
        </motion.div>

        {/* FAQ Sections */}
        <div className="space-y-8 mb-16">
          {faqData.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {category.category}
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {category.questions.map((item, index) => {
                  const itemId = `${category.category}-${index}`
                  const isOpen = openItems.includes(itemId)
                  
                  return (
                    <div key={itemId}>
                      <button
                        onClick={() => toggleItem(itemId)}
                        className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900 pr-4">
                            {item.question}
                          </h3>
                          <ChevronDownIcon 
                            className={`h-5 w-5 text-gray-500 transition-transform ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-4">
                              <p className="text-gray-600 leading-relaxed">
                                {item.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}