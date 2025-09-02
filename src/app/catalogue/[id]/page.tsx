'use client'

import { useState } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { products } from '@/data/products'
import { motion } from 'framer-motion'
import { 
  PhoneIcon, 
  ChatBubbleLeftRightIcon, 
  WifiIcon, 
  PrinterIcon,
  DocumentDuplicateIcon,
  FaxIcon,
  CheckIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)
  
  const product = products.find(p => p.id === params.id)
  
  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-sm text-gray-500 mb-8"
        >
          <Link href="/" className="hover:text-blue-600">Accueil</Link>
          <span>/</span>
          <Link href="/catalogue" className="hover:text-blue-600">Catalogue</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </motion.nav>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button variant="ghost" asChild className="text-gray-600 hover:text-gray-900">
            <Link href="/catalogue">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Retour au catalogue
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-4">
              {/* Main Image */}
              <div 
                className="relative h-96 bg-gray-100 rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => setShowLightbox(true)}
              >
                <Image
                  src={product.images.gallery[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-4 py-2 rounded">
                    Cliquer pour agrandir
                  </span>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex space-x-2">
                {product.images.gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 w-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} vue ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {product.brand}
                  </span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    product.inStock 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.inStock ? 'En stock' : 'Sur commande'}
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                
                <p className="text-lg text-gray-600 mb-6">
                  {product.description}
                </p>
              </div>

              {/* Price */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  À partir de {formatPrice(product.price.base)}
                </div>
                {product.price.withKit && (
                  <div className="text-lg text-gray-700">
                    Avec kit complet : {formatPrice(product.price.withKit)}
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Prix TTC, installation gratuite à Antananarivo
                </p>
              </div>

              {/* Key Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Caractéristiques principales</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <PrinterIcon className="h-5 w-5 text-gray-500" />
                    <span className="text-sm">
                      {product.type === 'tank' ? 'Réservoir d\'encre' : 
                       product.type === 'laser' ? 'Laser' : 'Jet d\'encre'}
                    </span>
                  </div>
                  
                  {product.features.wifi && (
                    <div className="flex items-center space-x-2">
                      <WifiIcon className="h-5 w-5 text-blue-500" />
                      <span className="text-sm">Wi-Fi intégré</span>
                    </div>
                  )}
                  
                  {product.features.adf && (
                    <div className="flex items-center space-x-2">
                      <DocumentDuplicateIcon className="h-5 w-5 text-green-500" />
                      <span className="text-sm">Chargeur automatique</span>
                    </div>
                  )}
                  
                  {product.features.fax && (
                    <div className="flex items-center space-x-2">
                      <FaxIcon className="h-5 w-5 text-purple-500" />
                      <span className="text-sm">Fax intégré</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <CheckIcon className="h-5 w-5 text-gray-500" />
                    <span className="text-sm">Format {product.features.maxFormat}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <CheckIcon className="h-5 w-5 text-gray-500" />
                    <span className="text-sm">
                      {product.features.color ? 'Couleur' : 'Noir & Blanc'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ideal For */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Idéal pour</h3>
                <div className="flex flex-wrap gap-2">
                  {product.idealFor.map((use, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {use}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    asChild
                  >
                    <Link href={`/devis?product=${product.id}`}>
                      Demander un devis
                    </Link>
                  </Button>
                  
                  <Button
                    size="lg"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => window.location.href = 'tel:+261337106334'}
                  >
                    <PhoneIcon className="mr-2 h-5 w-5" />
                    Appeler 033 71 063 34
                  </Button>
                </div>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={() => window.open('https://m.me/TsenaImprimante', '_blank')}
                >
                  <ChatBubbleLeftRightIcon className="mr-2 h-5 w-5" />
                  Contacter via Messenger
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Specifications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gray-50 rounded-lg p-8 mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Spécifications techniques</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900">Vitesse d'impression</h4>
                <p className="text-gray-600">
                  Noir & Blanc : {product.specifications.printSpeed.blackWhite}
                  {product.specifications.printSpeed.color && (
                    <span> • Couleur : {product.specifications.printSpeed.color}</span>
                  )}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900">Résolution</h4>
                <p className="text-gray-600">{product.specifications.resolution}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900">Connectivité</h4>
                <p className="text-gray-600">{product.specifications.connectivity.join(', ')}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900">Capacité papier</h4>
                <p className="text-gray-600">{product.specifications.paperCapacity}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900">Dimensions</h4>
                <p className="text-gray-600">{product.specifications.dimensions}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900">Poids</h4>
                <p className="text-gray-600">{product.specifications.weight}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3">
          <Button
            size="lg"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            asChild
          >
            <Link href={`/devis?product=${product.id}`}>
              Demander un devis
            </Link>
          </Button>
          
          <Button
            size="lg"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => window.location.href = 'tel:+261337106334'}
          >
            <PhoneIcon className="mr-2 h-5 w-5" />
            Appeler 033 71 063 34
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
            onClick={() => window.open('https://m.me/TsenaImprimante', '_blank')}
          >
            <ChatBubbleLeftRightIcon className="mr-2 h-5 w-5" />
            Messenger
          </Button>
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowLightbox(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={product.images.gallery[selectedImage]}
              alt={product.name}
              width={800}
              height={600}
              className="object-contain"
            />
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}