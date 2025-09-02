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