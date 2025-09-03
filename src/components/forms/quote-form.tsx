'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { validateMadagascarPhone } from '@/lib/utils'
import { products, regions } from '@/data/products'
import { motion } from 'framer-motion'
import { useToast } from '@/components/ui/toast'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

const quoteSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  company: z.string().optional(),
  phone: z.string().refine(validateMadagascarPhone, 'Numéro de téléphone malgache invalide'),
  email: z.string().email('Email invalide'),
  region: z.string().min(1, 'Veuillez sélectionner une région'),
  products: z.string().min(1, 'Veuillez sélectionner au moins un produit'),
  usage: z.string().min(1, 'Veuillez décrire votre usage'),
  volume: z.string().min(1, 'Veuillez estimer votre volume mensuel'),
  message: z.string().optional()
})

type QuoteFormData = z.infer<typeof quoteSchema>

interface QuoteFormProps {
  selectedProduct?: string
}

export default function QuoteForm({ selectedProduct }: QuoteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { showToast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      products: selectedProduct || ''
    }
  })

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true)
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Quote form data:', data)
      setIsSubmitted(true)
      showToast({
        type: 'success',
        title: 'Demande envoyée !',
        message: 'Nous vous contacterons dans les plus brefs délais.'
      })
      reset()
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Erreur',
        message: 'Une erreur est survenue. Veuillez réessayer.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Misaotra ! Votre demande a été envoyée
          </h3>
          <p className="text-green-700">
            Nous vous contacterons dans les plus brefs délais pour établir votre devis personnalisé.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() => window.location.href = 'tel:+261337106334'}
          >
            Appeler 033 71 063 34
          </Button>
          <Button variant="outline" asChild>
            <Link href="/catalogue">Retour au catalogue</Link>
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom complet *
          </label>
          <Input
            {...register('name')}
            placeholder="Votre nom complet"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Entreprise (optionnel)
          </label>
          <Input
            {...register('company')}
            placeholder="Nom de votre entreprise"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Téléphone *
          </label>
          <Input
            {...register('phone')}
            placeholder="033 XX XXX XX"
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <Input
            {...register('email')}
            type="email"
            placeholder="votre@email.com"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Région *
          </label>
          <Select
            {...register('region')}
            className={errors.region ? 'border-red-500' : ''}
          >
            <option value="">Sélectionnez votre région</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </Select>
          {errors.region && (
            <p className="text-red-500 text-sm mt-1">{errors.region.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Produit(s) souhaité(s) *
          </label>
          <Select
            {...register('products')}
            className={errors.products ? 'border-red-500' : ''}
          >
            <option value="">Sélectionnez un produit</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - À partir de {formatPrice(product.price.base)}
              </option>
            ))}
          </Select>
          {errors.products && (
            <p className="text-red-500 text-sm mt-1">{errors.products.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Usage prévu *
        </label>
        <Select
          {...register('usage')}
          className={errors.usage ? 'border-red-500' : ''}
        >
          <option value="">Sélectionnez votre usage</option>
          <option value="domestique">Usage domestique</option>
          <option value="bureau-petit">Petit bureau (1-5 personnes)</option>
          <option value="bureau-moyen">Bureau moyen (5-20 personnes)</option>
          <option value="bureau-grand">Grand bureau (20+ personnes)</option>
          <option value="ecole">École/Université</option>
          <option value="commerce">Commerce/Magasin</option>
        </Select>
        {errors.usage && (
          <p className="text-red-500 text-sm mt-1">{errors.usage.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Volume mensuel estimé *
        </label>
        <Select
          {...register('volume')}
          className={errors.volume ? 'border-red-500' : ''}
        >
          <option value="">Sélectionnez votre volume</option>
          <option value="0-100">0-100 pages/mois</option>
          <option value="100-500">100-500 pages/mois</option>
          <option value="500-1000">500-1000 pages/mois</option>
          <option value="1000-3000">1000-3000 pages/mois</option>
          <option value="3000+">Plus de 3000 pages/mois</option>
        </Select>
        {errors.volume && (
          <p className="text-red-500 text-sm mt-1">{errors.volume.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message complémentaire
        </label>
        <Textarea
          {...register('message')}
          placeholder="Décrivez vos besoins spécifiques, questions ou contraintes..."
          rows={4}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
      >
        {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande de devis'}
      </Button>

      <p className="text-sm text-gray-500 text-center">
        En soumettant ce formulaire, vous acceptez d'être contacté par notre équipe.
      </p>
    </motion.form>
  )
}