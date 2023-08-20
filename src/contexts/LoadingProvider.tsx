'use client'

import { createContext, ReactNode, useContext, useState } from 'react'

type LoadingProps = {
  loading: boolean
  setLoading: (loading: boolean) => void
}

type LoadingContextProps = {
  children: ReactNode
}

export const LoadingContext = createContext<LoadingProps>({
  loading: false,
  setLoading: () => null,
})

export const useLoading = () => useContext(LoadingContext)

export const LoadingProvider = ({ children }: LoadingContextProps) => {
  const [loading, setLoading] = useState<boolean>(false)

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}
