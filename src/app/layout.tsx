import { Metadata, ResolvedMetadata } from 'next'
import { NextFontWithVariable } from 'next/dist/compiled/@next/font'
import { Poppins } from 'next/font/google'
import { headers } from 'next/headers'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

import '@/styles/globals.css'

import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import Loading from '@/components/Loading'

import { ErrorProvider } from '@/contexts/ErrorProvider'
import { LoadingProvider } from '@/contexts/LoadingProvider'
import { ProductsProvider } from '@/contexts/ProductsContext'

type MetadataProps = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: MetadataProps,
  parent: ResolvedMetadata,
): Promise<Metadata> {
  const headersList = headers()
  const activePath = headersList.get('x-invoke-path')
  const routes = [
    '/',
    '/contact',
    '/about',
    '/products',
    '/cart',
    '/wishlist',
    '/sign-in',
    '/sign-up',
  ]

  function currentPage() {
    if (activePath && routes.includes(activePath)) {
      const currPath = activePath.slice(1).split('-')

      if (currPath[0] === '') {
        return 'Home'
      } else {
        return currPath
          .map((cp) => `${cp.slice(0, 1).toUpperCase()}${cp.slice(1)}`)
          .join(' ')
      }
    } else {
      return 'Not found'
    }
  }

  return {
    title: `E-Shopverse | ${currentPage()}`,
    icons: {
      icon: '/favicon/favicon.ico',
    },
  }
}

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
})

export default function RootLayout({
  children,
}: {
  children: ReactNode
  font: NextFontWithVariable
}) {
  // Put Header or Footer Here
  return (
    <html lang="en">
      <body>
        <ErrorProvider>
          <LoadingProvider>
            <ProductsProvider>
              <main
                className={twMerge(
                  poppins.variable,
                  'grid w-full grid-rows-[1fr_1fr_1fr] font-sans',
                )}
              >
                <Header />

                <div className="block h-full w-full">{children}</div>
                <Loading />

                <Footer />
              </main>
            </ProductsProvider>
          </LoadingProvider>
        </ErrorProvider>
      </body>
    </html>
  )
}
