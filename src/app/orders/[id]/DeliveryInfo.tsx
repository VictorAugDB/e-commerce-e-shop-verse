import { Status } from '@/app/orders/[id]/Status'

type DeliveryInfoProps = {
  title: string
  description: string
  hasDivider?: boolean
  isChecked?: boolean
}

export function DeliveryInfo({
  title,
  description,
  hasDivider,
  isChecked = false,
}: DeliveryInfoProps) {
  return (
    <>
      <div className="flex w-full max-w-[18rem] justify-between gap-3">
        <div className="flex flex-col items-center justify-end">
          {hasDivider && (
            <div
              data-is-checked={isChecked}
              className="block h-16 w-0.5 bg-green-700 data-[is-checked=false]:opacity-30"
            ></div>
          )}
          <Status isChecked={isChecked} />
        </div>
        <div className="mt-auto">
          <p className="text-end">{title}</p>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
      </div>
    </>
  )
}
