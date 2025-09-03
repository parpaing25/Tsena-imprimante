'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/providers'
import { products } from '@/data/products'
import { formatPrice } from '@/lib/utils'
import { TrashIcon, PlusIcon, MinusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'

export default function PanierPage() {
  const { items, removeFromCart, clearCart } = useCart()

  const cartProducts = items.map(item => {
    const product = products.find(p => p.id === item.productId)
    return product ? { ...product, quantity: item.quantity } : null
  }).filter(Boolean)

  const total = cartProducts.reduce((sum, item) => {
    return sum + (item!.price.base * item!.quantity)
  }, 0)

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <ShoppingBagIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Votre panier est vide
            </h1>
            <p className="text-gray-600 mb-8">
              Découvrez notre catalogue d'imprimantes et ajoutez vos produits favoris.
            </p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/catalogue">
                Voir le catalogue
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Votre sélection
          </h1>
          <p className="text-gray-600">
            {items.length} produit{items.length > 1 ? 's' : ''} sélectionné{items.length > 1 ? 's' : ''}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartProducts.map((item, index) => (
              <motion.div
                key={item!.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative h-20 w-20 flex-shrink-0">
                    <Image
                      src={item!.images.main}
                      alt={item!.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item!.name}</h3>
                    <p className="text-sm text-gray-600">{item!.brand}</p>
                    <p className="text-lg font-bold text-blue-600 mt-1">
                      {formatPrice(item!.price.base)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Qté: {item!.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFromCart(item!.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-md p-6 sticky top-24"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Résumé
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Livraison</span>
                  <span>À calculer</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total estimé</span>
                    <span className="text-blue-600">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  asChild
                >
                  <Link href="/devis">
                    Demander un devis
                  </Link>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={clearCart}
                >
                  Vider le panier
                </Button>
              </div>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Les prix incluent la TVA. Livraison et installation calculées au devis.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}