import { twMerge } from 'tailwind-merge'

type DetailProps = {
  title: string
  value: string
  titleClassName?: string
  valueClassName?: string
}

export function Detail({
  title,
  value,
  valueClassName,
  titleClassName,
}: DetailProps) {
  return (
    <div className="flex justify-between gap-2">
      <p className={twMerge('text-gray-600', titleClassName)}>{title}</p>
      <p className={twMerge('text-end', valueClassName)}>{value}</p>
    </div>
  )
}
