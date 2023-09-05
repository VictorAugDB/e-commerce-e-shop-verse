'use client'

import { useContext } from 'react'

import { LoadingSpinner } from '@/components/loading/LoadingSpinner'

import { LoadingContext } from '@/contexts/LoadingProvider'

export default function Loading() {
  const { loading } = useContext(LoadingContext)

  return (
    <>
      {loading && (
        <div className="fixed top-0 flex h-full w-full items-center justify-center bg-black/80 text-white">
          <LoadingSpinner className="h-12 w-12" />
        </div>
      )}
    </>
  )
}
