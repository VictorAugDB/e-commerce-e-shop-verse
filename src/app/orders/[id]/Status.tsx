import { Check } from 'react-feather'

type StatusProps = {
  isChecked: boolean
}

export function Status({ isChecked }: StatusProps) {
  return (
    <div
      data-is-checked={isChecked}
      className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white data-[is-checked=false]:opacity-30"
    >
      <Check className="w-4" />
    </div>
  )
}
