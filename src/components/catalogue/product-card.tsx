'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { Product } from '@/types/product'
import { motion } from 'framer-motion'
import { WifiIcon, PrinterIcon, DocumentDuplicateIcon, FaxIcon, HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { useCart } from '@/components/providers'
import { useToast } from '@/components/ui/toast'

interface ProductCardProps {
  product: Product
  index?: number
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart()
  const { showToast } = useToast()
  const [isFavorite, setIsFavorite] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart(product.id)
    showToast({
      type: 'success',
      title: 'Produit ajouté',
      message: `${product.name} a été ajouté à votre liste de souhaits`
    })
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsFavorite(!isFavorite)
    showToast({
      type: isFavorite ? 'info' : 'success',
      title: isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris',
      message: product.name
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={product.images.main}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Features badges */}
        <div className="absolute top-3 right-3 flex flex-col space-y-1">
          {product.features.wifi && (
            <div className="bg-blue-600 text-white p-1.5 rounded-full">
              <WifiIcon className="h-3 w-3" />
            </div>
          )}
          {product.features.adf && (
            <div className="bg-green-600 text-white p-1.5 rounded-full">
              <DocumentDuplicateIcon className="h-3 w-3" />
            </div>
          )}
          {product.features.fax && (
            <div className="bg-purple-600 text-white p-1.5 rounded-full">
              <FaxIcon className="h-3 w-3" />
            </div>
          )}
        </div>

        {/* Stock status */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 text-xs font-medium rounded ${
            product.inStock 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.inStock ? 'En stock' : 'Sur commande'}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute bottom-3 right-3 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors"
        >
          <HeartIcon className={`h-4 w-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
        </button>
      </div>
      
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-2">
          <PrinterIcon className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600 capitalize">
            {product.type === 'tank' ? 'Réservoir d\'encre' : 
             product.type === 'laser' ? 'Laser' : 'Jet d\'encre'}
          </span>
          {product.features.color && (
            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
              Couleur
            </span>
          )}
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {product.name}
        </h3>

        <p className="text-gray-600 mb-4 text-sm line-clamp-2">
          {product.description}
        </p>

        {/* Key features */}
        <div className="flex flex-wrap gap-1 mb-4">
          {product.features.wifi && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Wi-Fi</span>
          )}
          {product.features.duplex && (
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Recto-verso</span>
          )}
          {product.features.adf && (
            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">ADF</span>
          )}
          {product.features.tankSystem && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Réservoir</span>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-blue-600">
              À partir de {formatPrice(product.price.base)}
            </span>
            {product.price.withKit && (
              <p className="text-sm text-gray-500">
                Avec kit : {formatPrice(product.price.withKit)}
              </p>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/catalogue/${product.id}`}>
              Détails
            </Link>
          </Button>
          <Button 
            size="sm" 
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={handleAddToCart}
          >
            <ShoppingCartIcon className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
        </div>
      </div>
    </motion.div>
  )
}