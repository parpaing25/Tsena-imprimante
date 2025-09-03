import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-MG', {
    style: 'currency',
    currency: 'MGA',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price).replace('MGA', 'MGA')
}

export function formatPhoneNumber(phone: string): string {
  // Format Madagascar phone numbers
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('261')) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`
  }
  if (cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`
  }
  return phone
}

export function validateMadagascarPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  // Madagascar mobile numbers start with 03X
  return /^(261)?0[3][0-9]{8}$/.test(cleaned)
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}