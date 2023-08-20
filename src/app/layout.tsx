import { Metadata } from 'next'
import { NextFontWithVariable } from 'next/dist/compiled/@next/font'
import { Poppins } from 'next/font/google'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

import '@/styles/globals.css'

import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import Loading from '@/components/Loading'

import { ErrorProvider } from '@/contexts/ErrorProvider'
import { LoadingProvider } from '@/contexts/LoadingProvider'
import { ProductsProvider } from '@/contexts/ProductsContext'

export const metadata: Metadata = {
  title: 'My Page Title',
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
