'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckIcon, XMarkIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }
    setToasts(prev => [...prev, newToast])

    // Auto remove after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, toast.duration || 5000)
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return <CheckIcon className="h-5 w-5" />
      case 'error':
        return <XMarkIcon className="h-5 w-5" />
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5" />
      case 'info':
        return <InformationCircleIcon className="h-5 w-5" />
    }
  }

  const getColors = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className={`max-w-sm w-full border rounded-lg p-4 shadow-lg ${getColors(toast.type)}`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {getIcon(toast.type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{toast.title}</h4>
                  {toast.message && (
                    <p className="text-sm mt-1 opacity-90">{toast.message}</p>
                  )}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 opacity-70 hover:opacity-100"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}