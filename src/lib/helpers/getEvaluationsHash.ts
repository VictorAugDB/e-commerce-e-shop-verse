export type Evaluations = {
  '1': number
  '2': number
  '3': number
  '4': number
  '5': number
}

export function getEvaluationsHash(evaluations: string[]) {
  return evaluations.reduce(
    (acc, curr) => {
      acc[curr.toString() as keyof Evaluations]++

      return acc
    },
    {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
    },
  )
}
