'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { formatPrice } from '@/lib/utils'
import { CalculatorIcon, PhoneIcon } from '@heroicons/react/24/outline'

export default function SimulateurPage() {
  const [cartridgePrice, setCartridgePrice] = useState<number>(0)
  const [cartridgeYield, setCartridgeYield] = useState<number>(0)
  const [monthlyVolume, setMonthlyVolume] = useState<number>(0)
  const [colorRatio, setColorRatio] = useState<number>(20)
  const [printerType, setPrinterType] = useState<string>('')

  const calculateCostPerPage = () => {
    if (!cartridgePrice || !cartridgeYield) return 0
    return cartridgePrice / cartridgeYield
  }

  const calculateMonthlyCost = () => {
    const costPerPage = calculateCostPerPage()
    const blackWhitePages = monthlyVolume * (1 - colorRatio / 100)
    const colorPages = monthlyVolume * (colorRatio / 100)
    
    // Estimation : pages couleur coûtent 3x plus cher
    return (blackWhitePages * costPerPage) + (colorPages * costPerPage * 3)
  }

  const getRecommendation = () => {
    if (monthlyVolume < 100) {
      return {
        type: 'Jet d\'encre basique',
        reason: 'Pour un faible volume, une imprimante jet d\'encre simple suffit.'
      }
    } else if (monthlyVolume < 500) {
      return {
        type: 'Réservoir d\'encre',
        reason: 'Le système de réservoir devient rentable à partir de 100 pages/mois.'
      }
    } else if (monthlyVolume < 1000) {
      return {
        type: 'Réservoir d\'encre ou Laser',
        reason: 'Réservoir pour la couleur, Laser pour le noir & blanc uniquement.'
      }
    } else {
      return {
        type: 'Laser professionnel',
        reason: 'Pour les gros volumes, le laser est plus économique et rapide.'
      }
    }
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
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-100 rounded-full">
              <CalculatorIcon className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simulateur de coût par page
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculez le vrai coût d'impression de vos documents et trouvez l'imprimante la plus économique pour vos besoins.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Paramètres de calcul
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type d'imprimante
                </label>
                <Select
                  value={printerType}
                  onChange={(e) => setPrinterType(e.target.value)}
                >
                  <option value="">Sélectionnez un type</option>
                  <option value="inkjet">Jet d'encre (cartouches)</option>
                  <option value="tank">Réservoir d'encre</option>
                  <option value="laser">Laser</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix de la cartouche/bouteille (MGA)
                </label>
                <Input
                  type="number"
                  value={cartridgePrice || ''}
                  onChange={(e) => setCartridgePrice(Number(e.target.value))}
                  placeholder="Ex: 45000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rendement (nombre de pages)
                </label>
                <Input
                  type="number"
                  value={cartridgeYield || ''}
                  onChange={(e) => setCartridgeYield(Number(e.target.value))}
                  placeholder="Ex: 300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Volume mensuel (pages)
                </label>
                <Input
                  type="number"
                  value={monthlyVolume || ''}
                  onChange={(e) => setMonthlyVolume(Number(e.target.value))}
                  placeholder="Ex: 200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pourcentage d'impression couleur (%)
                </label>
                <Input
                  type="range"
                  min="0"
                  max="100"
                  value={colorRatio}
                  onChange={(e) => setColorRatio(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>0% (N&B uniquement)</span>
                  <span className="font-medium">{colorRatio}%</span>
                  <span>100% (Couleur uniquement)</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Cost Results */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Résultats du calcul
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <span className="font-medium text-gray-900">Coût par page</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(calculateCostPerPage())}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <span className="font-medium text-gray-900">Coût mensuel estimé</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatPrice(calculateMonthlyCost())}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                  <span className="font-medium text-gray-900">Coût annuel estimé</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {formatPrice(calculateMonthlyCost() * 12)}
                  </span>
                </div>
              </div>
            </div>

            {/* Recommendation */}
            {monthlyVolume > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Notre recommandation
                </h3>
                
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    {getRecommendation().type}
                  </h4>
                  <p className="text-yellow-700 text-sm">
                    {getRecommendation().reason}
                  </p>
                </div>
                
                <div className="mt-6 space-y-3">
                  <Button
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => window.location.href = '/catalogue'}
                  >
                    Voir les imprimantes recommandées
                  </Button>
                  
                  <Button
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => window.location.href = 'tel:+261337106334'}
                  >
                    <PhoneIcon className="mr-2 h-5 w-5" />
                    Conseil personnalisé - 033 71 063 34
                  </Button>
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Conseils d'économie
              </h3>
              
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Les imprimantes à réservoir sont plus économiques dès 100 pages/mois</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Utilisez le mode brouillon pour les documents internes</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>L'impression recto-verso divise par 2 votre consommation papier</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Les cartouches XL ont un meilleur rendement au MGA</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}