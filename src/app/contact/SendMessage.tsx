'use client'

import { useEffect } from 'react'

import Button from '@/components/buttons/Button'

import { useError } from '@/contexts/ErrorProvider'

export function SendMessage() {
  const { catchAsyncFunction, clearErrorState, error } = useError()

  useEffect(() => {
    if (error) {
      const aux = error
      clearErrorState()

      throw aux
    }
  }, [error, clearErrorState])

  async function handleSendMessage() {
    const f = async () => {
      throw new Error('An Error Ocurred')
    }

    catchAsyncFunction(f)
  }

  return (
    <Button
      onClick={handleSendMessage}
      variant="green"
      className="ml-auto px-12 py-4"
    >
      Send Message
    </Button>
  )
}
