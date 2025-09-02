import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tsena Imprimante - Spécialiste imprimantes Madagascar | Catalogue & Devis',
  description: 'Tsena Imprimante sy ny tontolony - Votre spécialiste en imprimantes à Madagascar. Jet d\'encre, laser, réservoir d\'encre. Livraison province, installation gratuite Tana. Devis gratuit.',
  keywords: 'imprimante Madagascar, Canon, HP, Epson, Brother, jet encre, laser, réservoir encre, Antananarivo, livraison province, installation gratuite',
  authors: [{ name: 'Tsena Imprimante' }],
  creator: 'Tsena Imprimante',
  publisher: 'Tsena Imprimante',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'fr_MG',
    url: 'https://tsena-imprimante.mg',
    siteName: 'Tsena Imprimante',
    title: 'Tsena Imprimante - Spécialiste imprimantes Madagascar',
    description: 'Votre spécialiste en imprimantes à Madagascar. Catalogue complet, conseils d\'experts, livraison en province.',
    images: [
      {
        url: 'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg',
        width: 1200,
        height: 630,
        alt: 'Tsena Imprimante Madagascar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tsena Imprimante - Spécialiste imprimantes Madagascar',
    description: 'Votre spécialiste en imprimantes à Madagascar. Catalogue complet, conseils d\'experts, livraison en province.',
    images: ['https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Tsena Imprimante",
              "description": "Spécialiste en imprimantes et matériels informatiques à Madagascar",
              "url": "https://tsena-imprimante.mg",
              "telephone": "+261337106334",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "MG",
                "addressLocality": "Antananarivo"
              },
              "sameAs": [
                "https://www.facebook.com/TsenaImprimante"
              ]
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}