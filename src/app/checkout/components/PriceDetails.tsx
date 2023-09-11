type PriceDetailsProps = {
  subtotal: number
  discounts: number
  shipping: number
}

export function PriceDetails({
  discounts,
  shipping,
  subtotal,
}: PriceDetailsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p>Subtotal:</p>
        <p>${subtotal}</p>
      </div>
      <span className="h-px w-full bg-gray-400"></span>
      <div className=" flex items-center justify-between">
        <p>Shipping:</p>
        <p>{shipping === 0 ? 'Free' : `$${shipping}`}</p>
      </div>
      <span className="h-px w-full bg-gray-400"></span>
      <div className="flex items-center justify-between">
        <p>Discounts:</p>
        <p>${discounts}</p>
      </div>
      <span className="h-px w-full bg-gray-400"></span>

      <div className="flex items-center justify-between">
        <p>Total:</p>
        <p>${subtotal + shipping - discounts}</p>
      </div>
    </div>
  )
}
