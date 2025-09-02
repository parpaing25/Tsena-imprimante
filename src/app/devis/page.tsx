'use client'

import { Suspense } from 'react'
import { motion } from 'framer-motion'
import QuoteForm from '@/components/forms/quote-form'
import { PhoneIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'

function QuoteFormWrapper() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <QuoteFormContent />
    </Suspense>
  )
}

function QuoteFormContent() {
  const searchParams = new URLSearchParams(window.location.search)
  const selectedProduct = searchParams.get('product')

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Demander un devis gratuit
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Remplissez ce formulaire et recevez votre devis personnalisé sous 24h. 
            Notre équipe vous contactera pour finaliser votre projet.
          </p>
        </motion.div>

        {/* Contact Options */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-blue-50 rounded-lg p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Besoin d'une réponse immédiate ?
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
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
              onClick={() => window.open('https://m.me/TsenaImprimante', '_blank')}
            >
              <ChatBubbleLeftRightIcon className="mr-2 h-5 w-5" />
              Messenger
            </Button>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-16"
        >
          <QuoteForm selectedProduct={selectedProduct || undefined} />
        </motion.div>
      </div>
    </div>
  )
}

export default function DevisPage() {
  return <QuoteFormWrapper />
}