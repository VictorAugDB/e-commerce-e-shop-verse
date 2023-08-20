'use client'

import { createContext, ReactNode, useContext, useState } from 'react'

type ErrorProps = {
  catchAsyncFunction: (f: () => Promise<unknown>) => Promise<void>
  clearErrorState: () => void
  error: unknown
}

type ErrorContextProps = {
  children: ReactNode
}

export const ErrorContext = createContext<ErrorProps>({} as ErrorProps)

export const useError = () => useContext(ErrorContext)

export const ErrorProvider = ({ children }: ErrorContextProps) => {
  const [error, setError] = useState<unknown | null>(null)

  function clearErrorState() {
    setError(false)
  }

  async function catchAsyncFunction(f: () => Promise<unknown>): Promise<void> {
    try {
      await f()
    } catch (err) {
      setError(err)
    }
  }

  return (
    <ErrorContext.Provider
      value={{ catchAsyncFunction, clearErrorState, error }}
    >
      {children}
    </ErrorContext.Provider>
  )
}
