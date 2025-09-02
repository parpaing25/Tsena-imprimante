'use client'

import { PhoneIcon, ChatBubbleLeftRightIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Besoin d'aide pour choisir ?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Notre équipe d'experts vous conseille gratuitement pour trouver l'imprimante parfaite selon vos besoins.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
              onClick={() => window.location.href = 'tel:+261337106334'}
            >
              <PhoneIcon className="mr-2 h-5 w-5" />
              Appeler 033 71 063 34
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg"
              onClick={() => window.open('https://m.me/TsenaImprimante', '_blank')}
            >
              <ChatBubbleLeftRightIcon className="mr-2 h-5 w-5" />
              Messenger
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg"
              asChild
            >
              <Link href="/devis">
                <DocumentTextIcon className="mr-2 h-5 w-5" />
                Demander un devis
              </Link>
            </Button>
          </div>

          <p className="mt-6 text-blue-100">
            <span className="font-semibold">Misaotra</span> pour votre confiance !
          </p>
        </motion.div>
      </div>
    </section>
  )
}