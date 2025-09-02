export interface Product {
  id: string
  name: string
  brand: string
  model: string
  type: 'inkjet' | 'laser' | 'tank'
  category: 'multifunction' | 'printer'
  price: {
    base: number
    withKit?: number
  }
  features: {
    color: boolean
    wifi: boolean
    adf: boolean
    duplex: boolean
    fax?: boolean
    maxFormat: string
    tankSystem?: boolean
  }
  specifications: {
    printSpeed: {
      blackWhite: string
      color?: string
    }
    resolution: string
    connectivity: string[]
    paperCapacity: string
    dimensions: string
    weight: string
  }
  images: {
    main: string
    gallery: string[]
  }
  description: string
  idealFor: string[]
  inStock: boolean
}

export interface ProductFilter {
  type?: string[]
  brand?: string[]
  color?: boolean
  wifi?: boolean
  adf?: boolean
  duplex?: boolean
  priceRange?: [number, number]
  format?: string[]
}