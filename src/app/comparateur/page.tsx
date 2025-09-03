'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { products } from '@/data/products'
import { formatPrice } from '@/lib/utils'
import { Product } from '@/types/product'
import { 
  CheckIcon, 
  XMarkIcon, 
  WifiIcon, 
  DocumentDuplicateIcon,
  FaxIcon,
  PrinterIcon
} from '@heroicons/react/24/outline'

export default function ComparateurPage() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  
  const compareProducts = selectedProducts
    .map(id => products.find(p => p.id === id))
    .filter(Boolean) as Product[]

  const addProduct = (productId: string) => {
    if (selectedProducts.length < 3 && !selectedProducts.includes(productId)) {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  const removeProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(id => id !== productId))
  }

  const FeatureIcon = ({ feature, hasFeature }: { feature: string, hasFeature: boolean }) => {
    if (!hasFeature) {
      return <XMarkIcon className="h-5 w-5 text-red-500" />
    }
    
    switch (feature) {
      case 'wifi':
        return <WifiIcon className="h-5 w-5 text-blue-500" />
      case 'adf':
        return <DocumentDuplicateIcon className="h-5 w-5 text-green-500" />
      case 'fax':
        return <FaxIcon className="h-5 w-5 text-purple-500" />
      default:
        return <CheckIcon className="h-5 w-5 text-green-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Comparateur d'imprimantes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comparez jusqu'à 3 imprimantes côte à côte pour faire le meilleur choix.
          </p>
        </motion.div>

        {/* Product Selection */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Sélectionnez vos imprimantes ({selectedProducts.length}/3)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 1, 2].map((index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imprimante {index + 1}
                </label>
                <Select
                  value={selectedProducts[index] || ''}
                  onChange={(e) => {
                    const newProducts = [...selectedProducts]
                    if (e.target.value) {
                      newProducts[index] = e.target.value
                    } else {
                      newProducts.splice(index, 1)
                    }
                    setSelectedProducts(newProducts.filter(Boolean))
                  }}
                >
                  <option value="">Choisir une imprimante</option>
                  {products
                    .filter(p => !selectedProducts.includes(p.id) || selectedProducts[index] === p.id)
                    .map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {formatPrice(product.price.base)}
                      </option>
                    ))}
                </Select>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Comparison Table */}
        {compareProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden mb-16"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                      Caractéristiques
                    </th>
                    {compareProducts.map((product) => (
                      <th key={product.id} className="px-6 py-4 text-center min-w-64">
                        <div className="space-y-3">
                          <div className="relative h-32 w-full">
                            <Image
                              src={product.images.main}
                              alt={product.name}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{product.name}</h3>
                            <p className="text-sm text-gray-600">{product.brand}</p>
                            <p className="text-lg font-bold text-blue-600 mt-1">
                              {formatPrice(product.price.base)}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeProduct(product.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Retirer
                          </Button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Type</td>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="px-6 py-4 text-center">
                        <span className="inline-flex items-center space-x-1">
                          <PrinterIcon className="h-4 w-4 text-gray-500" />
                          <span className="capitalize">
                            {product.type === 'tank' ? 'Réservoir' : 
                             product.type === 'laser' ? 'Laser' : 'Jet d\'encre'}
                          </span>
                        </span>
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Impression couleur</td>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="px-6 py-4 text-center">
                        <FeatureIcon feature="color" hasFeature={product.features.color} />
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Wi-Fi</td>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="px-6 py-4 text-center">
                        <FeatureIcon feature="wifi" hasFeature={product.features.wifi} />
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Chargeur automatique (ADF)</td>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="px-6 py-4 text-center">
                        <FeatureIcon feature="adf" hasFeature={product.features.adf} />
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Recto-verso automatique</td>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="px-6 py-4 text-center">
                        <FeatureIcon feature="duplex" hasFeature={product.features.duplex} />
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Fax</td>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="px-6 py-4 text-center">
                        <FeatureIcon feature="fax" hasFeature={product.features.fax || false} />
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Vitesse N&B</td>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="px-6 py-4 text-center text-sm">
                        {product.specifications.printSpeed.blackWhite}
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Vitesse couleur</td>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="px-6 py-4 text-center text-sm">
                        {product.specifications.printSpeed.color || 'N/A'}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Résolution</td>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="px-6 py-4 text-center text-sm">
                        {product.specifications.resolution}
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Actions</td>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="px-6 py-4 text-center">
                        <div className="space-y-2">
                          <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                            <Link href={`/catalogue/${product.id}`}>
                              Voir détails
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline" className="w-full" asChild>
                            <Link href={`/devis?product=${product.id}`}>
                              Demander devis
                            </Link>
                          </Button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Quick Add Products */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6 mb-16"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Ajouter rapidement
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.slice(0, 4).map((product) => (
              <button
                key={product.id}
                onClick={() => addProduct(product.id)}
                disabled={selectedProducts.includes(product.id) || selectedProducts.length >= 3}
                className="p-3 border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="relative h-16 w-full mb-2">
                  <Image
                    src={product.images.main}
                    alt={product.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {product.name}
                </p>
                <p className="text-xs text-blue-600">
                  {formatPrice(product.price.base)}
                </p>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}