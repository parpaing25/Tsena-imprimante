import { Product } from '@/types/product'

export const products: Product[] = [
  {
    id: 'canon-pixma-g2470',
    name: 'Canon PIXMA G2470',
    brand: 'Canon',
    model: 'G2470',
    type: 'tank',
    category: 'multifunction',
    price: {
      base: 860000
    },
    features: {
      color: true,
      wifi: false,
      adf: false,
      duplex: false,
      maxFormat: 'A4',
      tankSystem: true
    },
    specifications: {
      printSpeed: {
        blackWhite: '8.8 ipm',
        color: '5.0 ipm'
      },
      resolution: '4800 x 1200 dpi',
      connectivity: ['USB'],
      paperCapacity: '100 feuilles',
      dimensions: '445 x 330 x 163 mm',
      weight: '5.9 kg'
    },
    images: {
      main: 'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg',
      gallery: [
        'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg',
        'https://images.pexels.com/photos/4792728/pexels-photo-4792728.jpeg'
      ]
    },
    description: 'Imprimante multifonction avec système de réservoir d\'encre intégré. Idéale pour un usage domestique et de bureau avec des coûts d\'impression très réduits.',
    idealFor: ['Usage domestique', 'Petits bureaux', 'Étudiants', 'Impression économique'],
    inStock: true
  },
  {
    id: 'canon-pixma-g3410',
    name: 'Canon PIXMA G3410',
    brand: 'Canon',
    model: 'G3410',
    type: 'tank',
    category: 'multifunction',
    price: {
      base: 850000
    },
    features: {
      color: true,
      wifi: true,
      adf: false,
      duplex: false,
      maxFormat: 'A4',
      tankSystem: true
    },
    specifications: {
      printSpeed: {
        blackWhite: '8.8 ipm',
        color: '5.0 ipm'
      },
      resolution: '4800 x 1200 dpi',
      connectivity: ['USB', 'Wi-Fi'],
      paperCapacity: '100 feuilles',
      dimensions: '445 x 330 x 163 mm',
      weight: '5.9 kg'
    },
    images: {
      main: 'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg',
      gallery: [
        'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg',
        'https://images.pexels.com/photos/4792728/pexels-photo-4792728.jpeg'
      ]
    },
    description: 'Imprimante multifonction avec Wi-Fi et système de réservoir. Parfaite pour l\'impression mobile et le partage en réseau.',
    idealFor: ['Bureaux connectés', 'Impression mobile', 'Partage familial', 'Télétravail'],
    inStock: true
  },
  {
    id: 'canon-isensys-mf3010',
    name: 'Canon i-SENSYS MF3010',
    brand: 'Canon',
    model: 'MF3010',
    type: 'laser',
    category: 'multifunction',
    price: {
      base: 1530000
    },
    features: {
      color: false,
      wifi: false,
      adf: false,
      duplex: false,
      maxFormat: 'A4',
      tankSystem: false
    },
    specifications: {
      printSpeed: {
        blackWhite: '18 ppm'
      },
      resolution: '1200 x 600 dpi',
      connectivity: ['USB'],
      paperCapacity: '150 feuilles',
      dimensions: '390 x 364 x 272 mm',
      weight: '11.7 kg'
    },
    images: {
      main: 'https://images.pexels.com/photos/4792728/pexels-photo-4792728.jpeg',
      gallery: [
        'https://images.pexels.com/photos/4792728/pexels-photo-4792728.jpeg',
        'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg'
      ]
    },
    description: 'Imprimante laser monochrome multifonction. Robuste et rapide, idéale pour les gros volumes de documents.',
    idealFor: ['Bureaux professionnels', 'Gros volumes', 'Documents officiels', 'Impression rapide'],
    inStock: true
  },
  {
    id: 'canon-mg2545s',
    name: 'Canon PIXMA MG2545S',
    brand: 'Canon',
    model: 'MG2545S',
    type: 'inkjet',
    category: 'multifunction',
    price: {
      base: 340000,
      withKit: 410000
    },
    features: {
      color: true,
      wifi: false,
      adf: false,
      duplex: false,
      maxFormat: 'A4',
      tankSystem: false
    },
    specifications: {
      printSpeed: {
        blackWhite: '8.0 ipm',
        color: '4.0 ipm'
      },
      resolution: '4800 x 600 dpi',
      connectivity: ['USB'],
      paperCapacity: '60 feuilles',
      dimensions: '426 x 306 x 145 mm',
      weight: '3.5 kg'
    },
    images: {
      main: 'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg',
      gallery: [
        'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg',
        'https://images.pexels.com/photos/4792728/pexels-photo-4792728.jpeg'
      ]
    },
    description: 'Imprimante multifonction compacte et abordable. Parfaite pour débuter avec une solution complète.',
    idealFor: ['Débutants', 'Usage occasionnel', 'Petits espaces', 'Budget serré'],
    inStock: true
  },
  {
    id: 'canon-tr4640',
    name: 'Canon PIXMA TR4640',
    brand: 'Canon',
    model: 'TR4640',
    type: 'inkjet',
    category: 'multifunction',
    price: {
      base: 500000,
      withKit: 590000
    },
    features: {
      color: true,
      wifi: true,
      adf: true,
      duplex: true,
      fax: true,
      maxFormat: 'A4',
      tankSystem: false
    },
    specifications: {
      printSpeed: {
        blackWhite: '8.8 ipm',
        color: '4.4 ipm'
      },
      resolution: '4800 x 1200 dpi',
      connectivity: ['USB', 'Wi-Fi'],
      paperCapacity: '100 feuilles',
      dimensions: '435 x 316 x 187 mm',
      weight: '6.6 kg'
    },
    images: {
      main: 'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg',
      gallery: [
        'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg',
        'https://images.pexels.com/photos/4792728/pexels-photo-4792728.jpeg'
      ]
    },
    description: 'Imprimante multifonction complète avec Wi-Fi, ADF, duplex et fax. Solution professionnelle pour les bureaux.',
    idealFor: ['Bureaux professionnels', 'PME', 'Impression recto-verso', 'Fax intégré'],
    inStock: true
  },
  {
    id: 'hp-deskjet-2720',
    name: 'HP DeskJet 2720',
    brand: 'HP',
    model: '2720',
    type: 'inkjet',
    category: 'multifunction',
    price: {
      base: 380000,
      withKit: 450000
    },
    features: {
      color: true,
      wifi: true,
      adf: false,
      duplex: false,
      maxFormat: 'A4',
      tankSystem: false
    },
    specifications: {
      printSpeed: {
        blackWhite: '7.5 ppm',
        color: '5.5 ppm'
      },
      resolution: '4800 x 1200 dpi',
      connectivity: ['USB', 'Wi-Fi'],
      paperCapacity: '60 feuilles',
      dimensions: '425 x 304 x 155 mm',
      weight: '3.42 kg'
    },
    images: {
      main: 'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg',
      gallery: [
        'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg',
        'https://images.pexels.com/photos/4792728/pexels-photo-4792728.jpeg'
      ]
    },
    description: 'Imprimante HP compacte avec Wi-Fi intégré. Idéale pour l\'impression mobile et les petits espaces.',
    idealFor: ['Usage domestique', 'Impression mobile', 'Étudiants', 'Petits bureaux'],
    inStock: true
  },
  {
    id: 'epson-ecotank-l3250',
    name: 'Epson EcoTank L3250',
    brand: 'Epson',
    model: 'L3250',
    type: 'tank',
    category: 'multifunction',
    price: {
      base: 920000
    },
    features: {
      color: true,
      wifi: true,
      adf: false,
      duplex: false,
      maxFormat: 'A4',
      tankSystem: true
    },
    specifications: {
      printSpeed: {
        blackWhite: '10.0 ipm',
        color: '5.0 ipm'
      },
      resolution: '5760 x 1440 dpi',
      connectivity: ['USB', 'Wi-Fi'],
      paperCapacity: '100 feuilles',
      dimensions: '375 x 347 x 179 mm',
      weight: '4.5 kg'
    },
    images: {
      main: 'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg',
      gallery: [
        'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg',
        'https://images.pexels.com/photos/4792728/pexels-photo-4792728.jpeg'
      ]
    },
    description: 'Imprimante Epson EcoTank avec réservoirs d\'encre haute capacité. Coût par page ultra-réduit.',
    idealFor: ['Gros volumes', 'Économies d\'encre', 'Bureaux', 'Écoles'],
    inStock: true
  },
  {
    id: 'brother-dcp-t720dw',
    name: 'Brother DCP-T720DW',
    brand: 'Brother',
    model: 'DCP-T720DW',
    type: 'tank',
    category: 'multifunction',
    price: {
      base: 780000
    },
    features: {
      color: true,
      wifi: true,
      adf: false,
      duplex: true,
      maxFormat: 'A4',
      tankSystem: true
    },
    specifications: {
      printSpeed: {
        blackWhite: '16 ppm',
        color: '9 ppm'
      },
      resolution: '6000 x 1200 dpi',
      connectivity: ['USB', 'Wi-Fi'],
      paperCapacity: '150 feuilles',
      dimensions: '435 x 374 x 193 mm',
      weight: '8.6 kg'
    },
    images: {
      main: 'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg',
      gallery: [
        'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg',
        'https://images.pexels.com/photos/4792728/pexels-photo-4792728.jpeg'
      ]
    },
    description: 'Imprimante Brother avec réservoirs d\'encre et impression recto-verso automatique. Robuste et économique.',
    idealFor: ['Bureaux moyens', 'Impression recto-verso', 'Durabilité', 'Coût réduit'],
    inStock: true
  }
]

export const brands = ['Canon', 'HP', 'Epson', 'Brother']
export const types = [
  { value: 'inkjet', label: 'Jet d\'encre' },
  { value: 'laser', label: 'Laser' },
  { value: 'tank', label: 'Réservoir d\'encre' }
]

export const regions = [
  'Antananarivo',
  'Antsirabe',
  'Fianarantsoa',
  'Toamasina',
  'Mahajanga',
  'Toliara',
  'Antsiranana',
  'Morondava',
  'Sambava',
  'Fort-Dauphin'
]