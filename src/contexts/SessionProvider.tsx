'use client'

import { SessionProvider as NAuthSessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

type SessionProviderProps = {
  children: ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  return <NAuthSessionProvider>{children}</NAuthSessionProvider>
}
