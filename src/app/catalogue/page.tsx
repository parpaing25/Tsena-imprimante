'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '@/components/catalogue/product-card'
import LoadingSpinner from '@/components/ui/loading-spinner'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { products, brands, types } from '@/data/products'
import { ProductFilter } from '@/types/product'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'

export default function CataloguePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<ProductFilter>({})
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const filteredProducts = useMemo(() => {
    setIsLoading(true)
    
    // Simulate loading for better UX
    setTimeout(() => setIsLoading(false), 300)
    
    return products.filter(product => {
      // Search term filter
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !product.brand.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }

      // Type filter
      if (filters.type && filters.type.length > 0 && !filters.type.includes(product.type)) {
        return false
      }

      // Brand filter
      if (filters.brand && filters.brand.length > 0 && !filters.brand.includes(product.brand)) {
        return false
      }

      // Feature filters
      if (filters.color !== undefined && product.features.color !== filters.color) {
        return false
      }
      if (filters.wifi !== undefined && product.features.wifi !== filters.wifi) {
        return false
      }
      if (filters.adf !== undefined && product.features.adf !== filters.adf) {
        return false
      }
      if (filters.duplex !== undefined && product.features.duplex !== filters.duplex) {
        return false
      }

      // Price range filter
      if (filters.priceRange) {
        const [min, max] = filters.priceRange
        if (product.price.base < min || product.price.base > max) {
          return false
        }
      }

      return true
    })
  }, [searchTerm, filters])

  const clearFilters = () => {
    setFilters({})
    setSearchTerm('')
  }

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
            Notre catalogue d'imprimantes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez notre sélection complète d'imprimantes adaptées à tous vos besoins et budgets.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher une imprimante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <FunnelIcon className="h-4 w-4" />
              <span>Filtres</span>
            </Button>
            
            {(Object.keys(filters).length > 0 || searchTerm) && (
              <Button variant="ghost" onClick={clearFilters} className="text-red-600">
                Effacer les filtres
              </Button>
            )}
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-4 border-t border-gray-200"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <Select
                  value={filters.type?.[0] || ''}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    type: e.target.value ? [e.target.value] : undefined
                  }))}
                >
                  <option value="">Tous types</option>
                  {types.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marque</label>
                <Select
                  value={filters.brand?.[0] || ''}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    brand: e.target.value ? [e.target.value] : undefined
                  }))}
                >
                  <option value="">Toutes marques</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Couleur</label>
                <Select
                  value={filters.color === undefined ? '' : filters.color ? 'true' : 'false'}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    color: e.target.value === '' ? undefined : e.target.value === 'true'
                  }))}
                >
                  <option value="">Toutes</option>
                  <option value="true">Couleur</option>
                  <option value="false">Noir & Blanc</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Wi-Fi</label>
                <Select
                  value={filters.wifi === undefined ? '' : filters.wifi ? 'true' : 'false'}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    wifi: e.target.value === '' ? undefined : e.target.value === 'true'
                  }))}
                >
                  <option value="">Toutes</option>
                  <option value="true">Avec Wi-Fi</option>
                  <option value="false">Sans Wi-Fi</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prix max (MGA)</label>
                <Input
                  type="number"
                  placeholder="1000000"
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value) : undefined
                    setFilters(prev => ({
                      ...prev,
                      priceRange: value ? [0, value] : undefined
                    }))
                  }}
                />
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-gray-600">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
          </p>
        </motion.div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg mb-4">
              Aucun produit ne correspond à vos critères.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Effacer les filtres
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}