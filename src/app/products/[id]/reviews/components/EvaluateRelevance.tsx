import { ReactNode } from 'react'

type EvaluateRelevanceProps = {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  handleEvaluate: (reviewId: string) => Promise<void>
  isEvaluated: boolean
  reviewId: string
  children: ReactNode
}

export function EvaluateRelevance({
  isLoading,
  setIsLoading,
  handleEvaluate,
  isEvaluated,
  reviewId,
  children,
}: EvaluateRelevanceProps) {
  async function evaluateRelevance(reviewId: string) {
    setIsLoading(true)
    await handleEvaluate(reviewId)
    setIsLoading(false)
  }

  return (
    <button
      data-evaluated={isEvaluated}
      disabled={isLoading}
      onClick={() => evaluateRelevance(reviewId)}
      className="w-20 cursor-pointer px-2 py-1 transition-all hover:font-bold disabled:cursor-not-allowed data-[evaluated=true]:font-bold"
    >
      {children}
    </button>
  )
}
