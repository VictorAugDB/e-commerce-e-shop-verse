'use client'

import { signIn } from 'next-auth/react'

import Button from '@/components/buttons/Button'

export function GoogleButton() {
  return (
    <Button
      onClick={() => signIn('google')}
      variant="ghost"
      className="flex w-full justify-center gap-4 rounded border border-gray-600 py-4"
    >
      <img src="/images/google-icon.png" alt="google-logo" />
      Sign in with Google
    </Button>
  )
}
