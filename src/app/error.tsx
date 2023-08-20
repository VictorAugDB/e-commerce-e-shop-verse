'use client'

import { useEffect } from 'react'
import { RiAlarmWarningFill } from 'react-icons/ri'

import Button from '@/components/buttons/Button'
import ArrowLink from '@/components/links/ArrowLink'

import { useLoading } from '@/contexts/LoadingProvider'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  const { setLoading } = useLoading()

  useEffect(() => {
    setLoading(false)
  }, [error, reset, setLoading])

  return (
    <div className="layout flex h-error-screen flex-col items-center justify-center gap-6 text-center text-black">
      <RiAlarmWarningFill size={60} className="animate-flicker text-red-500" />
      <h1>{error.message ?? 'Something went wrong!'}</h1>

      <div className="flex items-center justify-center gap-8">
        <Button variant="green" className="px-12 py-3" onClick={() => reset()}>
          Try again
        </Button>
        <ArrowLink className="mt-4 md:text-lg" href="/">
          Back to Home
        </ArrowLink>
      </div>
    </div>
  )
}
