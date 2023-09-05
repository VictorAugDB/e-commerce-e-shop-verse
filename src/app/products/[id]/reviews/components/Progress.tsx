type ProgressProps = {
  currentEvaluation: number
  numberOfCurrentEvaluations: number
  totalNumberOfEvaluations: number
}

export function Progress({
  currentEvaluation,
  numberOfCurrentEvaluations,
  totalNumberOfEvaluations,
}: ProgressProps) {
  return (
    <div className="flex h-fit w-full items-center gap-2">
      <p className="text-xs text-gray-600">{currentEvaluation}</p>
      <div className="h-2 flex-1 overflow-hidden rounded bg-gray-400">
        <span
          className="block h-full bg-yellow-500"
          style={{
            width: `${
              (numberOfCurrentEvaluations / totalNumberOfEvaluations) * 100
            }%`,
          }}
        ></span>
      </div>
    </div>
  )
}
