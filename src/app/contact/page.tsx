'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  PhoneIcon, 
  ChatBubbleLeftRightIcon, 
  MapPinIcon, 
  ClockIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'

export default function ContactPage() {
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
            Contactez-nous
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Notre équipe est à votre disposition pour répondre à toutes vos questions et vous accompagner dans vos projets.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Informations de contact
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <PhoneIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Téléphone</h3>
                    <a 
                      href="tel:+261337106334"
                      className="text-green-600 hover:text-green-700 font-medium text-lg"
                    >
                      033 71 063 34
                    </a>
                    <p className="text-gray-600 text-sm">
                      Lundi - Samedi : 8h00 - 17h00
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Messenger</h3>
                    <button
                      onClick={() => window.open('https://m.me/TsenaImprimante', '_blank')}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      @TsenaImprimante
                    </button>
                    <p className="text-gray-600 text-sm">
                      Réponse rapide 7j/7
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <GlobeAltIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Facebook</h3>
                    <a
                      href="https://www.facebook.com/TsenaImprimante"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                      facebook.com/TsenaImprimante
                    </a>
                    <p className="text-gray-600 text-sm">
                      Suivez nos actualités
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <MapPinIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Localisation</h3>
                    <p className="text-gray-700">Antananarivo, Madagascar</p>
                    <p className="text-gray-600 text-sm">
                      Service sur rendez-vous
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Actions rapides
              </h3>
              <div className="space-y-4">
                <Button
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 text-white justify-center"
                  onClick={() => window.location.href = 'tel:+261337106334'}
                >
                  <PhoneIcon className="mr-2 h-5 w-5" />
                  Appeler maintenant
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 justify-center"
                  onClick={() => window.open('https://m.me/TsenaImprimante', '_blank')}
                >
                  <ChatBubbleLeftRightIcon className="mr-2 h-5 w-5" />
                  Ouvrir Messenger
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Service Areas & Hours */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Service Hours */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <ClockIcon className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Horaires d'ouverture</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-900">Lundi - Vendredi</span>
                  <span className="text-gray-600">8h00 - 17h00</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-900">Samedi</span>
                  <span className="text-gray-600">8h00 - 12h00</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-gray-900">Dimanche</span>
                  <span className="text-red-600">Fermé</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Support d'urgence :</strong> Disponible 7j/7 via Messenger pour nos clients professionnels.
                </p>
              </div>
            </div>

            {/* Service Areas */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <MapPinIcon className="h-6 w-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Zones de service</h2>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Installation gratuite</h4>
                  <p className="text-green-700 text-sm">
                    Antananarivo et communes environnantes (dans un rayon de 25 km)
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Livraison express (2-3 jours)</h4>
                  <p className="text-blue-700 text-sm">
                    Antananarivo, Antsirabe, Ambatondrazaka
                  </p>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Livraison standard (5-7 jours)</h4>
                  <p className="text-orange-700 text-sm">
                    Toutes les autres provinces de Madagascar
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-8 text-white text-center">
              <h3 className="text-xl font-bold mb-4">Urgence technique ?</h3>
              <p className="mb-6 text-red-100">
                Pour les pannes critiques en entreprise, contactez-nous immédiatement.
              </p>
              <Button
                size="lg"
                className="bg-white text-red-600 hover:bg-gray-100"
                onClick={() => window.location.href = 'tel:+261337106334'}
              >
                <PhoneIcon className="mr-2 h-5 w-5" />
                Appel d'urgence
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}