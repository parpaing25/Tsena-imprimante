// Tarifs de livraison par région à Madagascar (en MGA TTC)
export interface DeliveryRate {
  region: string;
  distance: number; // Distance depuis Tana en km
  localTanaRate?: { min: number; max: number }; // Livraison locale Tana
  planeRate: number; // Par avion (5500 MGA/kg, min 40000)
  taxiBrousseRate: number; // Taxi-brousse (prix fixe)
  rapidServiceBaseRate: number; // Service rapide (1200 MGA/kg/100km, min 15000)
  estimatedDays: string;
}

export const deliveryRates: DeliveryRate[] = [
  {
    region: "Antananarivo",
    distance: 0,
    localTanaRate: { min: 5000, max: 12000 }, // Selon distance dans Tana
    planeRate: 40000, // Minimum
    taxiBrousseRate: 0, // Local
    rapidServiceBaseRate: 0, // Local
    estimatedDays: "Installation gratuite le jour même"
  },
  {
    region: "Antsirabe",
    distance: 170,
    planeRate: 40000,
    taxiBrousseRate: 20000, // Lite class
    rapidServiceBaseRate: Math.ceil(170 / 100) * 1200, // 2 tranches de 100km
    estimatedDays: "2-3 jours"
  },
  {
    region: "Fianarantsoa",
    distance: 410,
    planeRate: 40000,
    taxiBrousseRate: 40000, // Plafonné à 40.000 (au lieu de 45.000 Lite)
    rapidServiceBaseRate: Math.ceil(410 / 100) * 1200, // 5 tranches de 100km
    estimatedDays: "3-5 jours"
  },
  {
    region: "Toamasina",
    distance: 370,
    planeRate: 40000,
    taxiBrousseRate: 40000, // Lite class
    rapidServiceBaseRate: Math.ceil(370 / 100) * 1200, // 4 tranches de 100km
    estimatedDays: "3-5 jours"
  },
  {
    region: "Mahajanga",
    distance: 553,
    planeRate: 40000,
    taxiBrousseRate: 40000, // Plafonné à 40.000 (au lieu de 70.000 Lite)
    rapidServiceBaseRate: Math.ceil(553 / 100) * 1200, // 6 tranches de 100km
    estimatedDays: "4-6 jours"
  },
  {
    region: "Toliara",
    distance: 950,
    planeRate: 40000,
    taxiBrousseRate: 40000, // Plafonné à 40.000 (au lieu de 110.000 Premium)
    rapidServiceBaseRate: Math.ceil(950 / 100) * 1200, // 10 tranches de 100km
    estimatedDays: "5-7 jours"
  },
  {
    region: "Antsiranana",
    distance: 1100,
    planeRate: 40000,
    taxiBrousseRate: 40000, // Plafonné à 40.000 (au lieu de 155.000 Premium)
    rapidServiceBaseRate: Math.ceil(1100 / 100) * 1200, // 11 tranches de 100km
    estimatedDays: "4-6 jours"
  },
  {
    region: "Morondava",
    distance: 700,
    planeRate: 40000,
    taxiBrousseRate: 40000, // Plafonné à 40.000 (au lieu de 70.000)
    rapidServiceBaseRate: Math.ceil(700 / 100) * 1200, // 7 tranches de 100km
    estimatedDays: "5-7 jours"
  },
  {
    region: "Sambava",
    distance: 800,
    planeRate: 40000,
    taxiBrousseRate: 40000, // Plafonné à 40.000
    rapidServiceBaseRate: Math.ceil(800 / 100) * 1200, // 8 tranches de 100km
    estimatedDays: "6-8 jours"
  },
  {
    region: "Autre région",
    distance: 500,
    planeRate: 40000,
    taxiBrousseRate: 40000, // Plafonné à 40.000
    rapidServiceBaseRate: Math.ceil(500 / 100) * 1200, // 5 tranches de 100km
    estimatedDays: "4-7 jours (selon localisation)"
  }
];

export const getDeliveryRate = (region: string): DeliveryRate => {
  const rate = deliveryRates.find(r => r.region === region);
  return rate || deliveryRates[deliveryRates.length - 1]; // Default to "Autre région"
};

export type DeliveryType = 'local-tana' | 'plane' | 'taxi-brousse' | 'rapid-service';

export const calculateDeliveryPrice = (
  region: string, 
  totalWeight: number, 
  deliveryType: DeliveryType,
  distanceInTana?: number, // Pour livraison locale à Tana (0-5km)
  totalQuantity: number = 1 // Nombre total d'imprimantes
): number => {
  const rate = getDeliveryRate(region);
  
  switch (deliveryType) {
    case 'local-tana':
      if (region === 'Antananarivo' && rate.localTanaRate) {
        // Calcul linéaire entre min et max selon la distance (0-5km)
        const distance = Math.min(distanceInTana || 0, 5);
        const priceRange = rate.localTanaRate.max - rate.localTanaRate.min;
        const pricePerPrinter = rate.localTanaRate.min + (distance / 5) * priceRange;
        // Multiplier par le nombre d'imprimantes pour Antananarivo
        return pricePerPrinter * totalQuantity;
      }
      return 0;
      
    case 'plane':
      // 5500 MGA/kg, minimum 40000 MGA
      return Math.max(40000, 5500 * totalWeight);
      
    case 'taxi-brousse':
      // Prix fixe pour la première imprimante + moitié du prix pour chaque imprimante supplémentaire
      if (totalQuantity <= 1) {
        return rate.taxiBrousseRate;
      } else {
        const additionalPrinters = totalQuantity - 1;
        const additionalCost = (rate.taxiBrousseRate / 2) * additionalPrinters;
        return rate.taxiBrousseRate + additionalCost;
      }
      
    case 'rapid-service':
      // 1200 MGA/kg/100km, minimum 15000 MGA
      const basePrice = rate.rapidServiceBaseRate * totalWeight;
      return Math.max(15000, basePrice);
      
    default:
      return 0;
  }
};

export const getDeliveryOptions = (region: string) => {
  const rate = getDeliveryRate(region);
  const options = [];
  
  if (region === 'Antananarivo' && rate.localTanaRate) {
    options.push({
      type: 'local-tana' as DeliveryType,
      name: 'Livraison locale Tana',
      description: 'Dans un rayon de 5km du centre-ville',
      priceRange: `${formatPrice(rate.localTanaRate.min)} - ${formatPrice(rate.localTanaRate.max)} MGA`,
      estimatedDays: rate.estimatedDays
    });
  }
  
  options.push(
    {
      type: 'plane' as DeliveryType,
      name: 'Par avion',
      description: 'Madagascar Airlines - fret intérieur (5500 MGA/kg)',
      priceInfo: 'Minimum 40,000 MGA',
      estimatedDays: '1-2 jours'
    },
    {
      type: 'taxi-brousse' as DeliveryType,
      name: 'Taxi-brousse',
      description: 'Prix fixe par région',
      price: formatPrice(rate.taxiBrousseRate) + ' MGA',
      estimatedDays: rate.estimatedDays
    },
    {
      type: 'rapid-service' as DeliveryType,
      name: 'Service rapide',
      description: 'Livraison express par route (1200 MGA/kg/100km)',
      priceInfo: 'Minimum 15,000 MGA',
      estimatedDays: '2-4 jours'
    }
  );
  
  return options;
};

export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR').format(amount).replace(/\s/g, '.').replace(/\//g, '.');
};