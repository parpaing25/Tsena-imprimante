import Link from 'next/link'
import { PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold">Tsena Imprimante</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Votre spécialiste en imprimantes et matériels informatiques à Madagascar. 
              Livraison en province et installation gratuite à Antananarivo.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-5 w-5 text-green-400" />
                <a 
                  href="tel:+261337106334" 
                  className="text-green-400 hover:text-green-300 transition-colors font-medium"
                >
                  033 71 063 34
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">Antananarivo, Madagascar</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link href="/catalogue" className="text-gray-300 hover:text-white transition-colors">Catalogue</Link></li>
              <li><Link href="/conseils" className="text-gray-300 hover:text-white transition-colors">Conseils</Link></li>
              <li><Link href="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/devis" className="text-gray-300 hover:text-white transition-colors">Demander un devis</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Livraison en province</li>
              <li>Installation gratuite Tana</li>
              <li>Support technique</li>
              <li>Garantie constructeur</li>
              <li>Consommables</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Tsena Imprimante. Tous droits réservés.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="/mentions-legales" className="text-gray-400 hover:text-white text-sm transition-colors">
              Mentions légales
            </Link>
            <Link href="/politique-confidentialite" className="text-gray-400 hover:text-white text-sm transition-colors">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}