'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PhoneIcon, ChatBubbleLeftRightIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Catalogue', href: '/catalogue' },
  { name: 'Conseils', href: '/conseils' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Tsena Imprimante</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center space-x-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              onClick={() => window.open('https://m.me/TsenaImprimante', '_blank')}
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4" />
              <span>Messenger</span>
            </Button>
            
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => window.location.href = 'tel:+261337106334'}
            >
              <PhoneIcon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Appeler</span>
              <span className="sm:hidden">033 71 063 34</span>
            </Button>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 bg-white"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="px-3 py-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-center border-blue-600 text-blue-600 hover:bg-blue-50"
                    onClick={() => {
                      window.open('https://m.me/TsenaImprimante', '_blank')
                      setMobileMenuOpen(false)
                    }}
                  >
                    <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                    Messenger
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}