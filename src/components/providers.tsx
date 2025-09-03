'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ToastProvider } from '@/components/ui/toast'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  getTotalItems: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === newItem.id)
      
      if (existingItem) {
        return currentItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      
      return [...currentItems, { ...newItem, quantity: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id))
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <ToastProvider>
      <CartContext.Provider value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalItems
      }}>
        {children}
      </CartContext.Provider>
    </ToastProvider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}