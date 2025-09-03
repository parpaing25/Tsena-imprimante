'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/catalogue/product-card'
import { Input } from '@/components/ui/input'
import { products } from '@/data/products'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function RecherchePage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(initialQuery)

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    
    const query = searchQuery.toLowerCase()
    return products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.idealFor.some(use => use.toLowerCase().includes(query))
    )
  }, [searchQuery])

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
            Recherche
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trouvez l'imprimante parfaite en recherchant par nom, marque ou usage.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher une imprimante, marque, ou usage..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-lg py-3"
            />
          </div>
        </motion.div>

        {/* Results */}
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <p className="text-gray-600">
              {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} pour "{searchQuery}"
            </p>
          </motion.div>
        )}

        {/* Products Grid */}
        {searchResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {searchResults.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

        {/* No Results */}
        {searchQuery && searchResults.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg mb-4">
              Aucun résultat trouvé pour "{searchQuery}"
            </p>
            <p className="text-gray-400 mb-8">
              Essayez avec d'autres mots-clés ou parcourez notre catalogue complet.
            </p>
          </motion.div>
        )}

        {/* Popular Searches */}
        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Recherches populaires
            </h2>
            <div className="flex flex-wrap gap-2">
              {['Canon', 'HP', 'Epson', 'Wi-Fi', 'Couleur', 'Laser', 'Réservoir', 'Multifonction'].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}