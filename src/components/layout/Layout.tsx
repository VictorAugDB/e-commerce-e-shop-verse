import { NextFontWithVariable } from 'next/dist/compiled/@next/font'
import { ReactNode, useContext } from 'react'
import { twMerge } from 'tailwind-merge'

import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import Loading from '@/components/Loading'

import { LoadingContext } from '@/contexts/LoadingProvider'

export default function Layout({
  children,
  font,
}: {
  children: ReactNode
  font: NextFontWithVariable
}) {
  const { loading } = useContext(LoadingContext)

  // Put Header or Footer Here
  return (
    <main
      className={twMerge(
        font.variable,
        'grid w-full grid-rows-[1fr_1fr_1fr] font-sans',
      )}
    >
      <Header />
      <div>{children}</div>
      {loading && <Loading />}
      <Footer />
    </main>
  )
}
