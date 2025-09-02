'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { products } from '@/data/products'
import { motion } from 'framer-motion'
import { ArrowRightIcon, WifiIcon, PrinterIcon } from '@heroicons/react/24/outline'

export default function PopularProducts() {
  const popularProducts = products.slice(0, 3)

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nos imprimantes les plus populaires
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez notre sélection d'imprimantes les plus appréciées par nos clients malgaches.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {popularProducts.map((product, index) => (
            <motion.div
              key={product.id}
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
                {product.features.wifi && (
                  <div className="absolute top-3 right-3 bg-blue-600 text-white p-2 rounded-full">
                    <WifiIcon className="h-4 w-4" />
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                
                <div className="flex items-center space-x-2 mb-3">
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

                <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                  {product.description}
                </p>

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
                  <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" asChild>
                    <Link href={`/devis?product=${product.id}`}>
                      Devis
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50" asChild>
            <Link href="/catalogue">
              Voir tout le catalogue
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}