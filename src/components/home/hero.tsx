'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PhoneIcon, ChatBubbleLeftRightIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

const heroSlides = [
  {
    id: 1,
    title: 'Imprimantes à réservoir d\'encre',
    subtitle: 'Économisez jusqu\'à 90% sur vos coûts d\'impression',
    image: 'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg',
    cta: 'Voir les modèles'
  },
  {
    id: 2,
    title: 'Imprimantes laser professionnelles',
    subtitle: 'Rapidité et qualité pour vos documents',
    image: 'https://images.pexels.com/photos/4792728/pexels-photo-4792728.jpeg',
    cta: 'Découvrir'
  },
  {
    id: 3,
    title: 'Multifonctions Wi-Fi',
    subtitle: 'Imprimez depuis votre smartphone',
    image: 'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg',
    cta: 'Explorer'
  }
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slider */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <motion.div
            key={slide.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentSlide ? 1 : 0 }}
            transition={{ duration: 1 }}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-yellow-400">Tongasoa</span> eto amin'ny
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-6">
            Tsena Imprimante sy ny tontolony
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-200">
            Votre spécialiste en imprimantes à Madagascar
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            asChild
          >
            <Link href="/catalogue">
              Voir le catalogue
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg"
            asChild
          >
            <Link href="/devis">
              Demander un devis
            </Link>
          </Button>
          
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
            onClick={() => window.location.href = 'tel:+261337106334'}
          >
            <PhoneIcon className="mr-2 h-5 w-5" />
            Appeler 033 71 063 34
          </Button>
        </motion.div>

        {/* Slide Indicators */}
        <div className="flex justify-center space-x-2 mt-8">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  )
}