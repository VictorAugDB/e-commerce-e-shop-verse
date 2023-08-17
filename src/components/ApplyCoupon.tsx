import { useContext, useRef, useState } from 'react'

import Button from '@/components/buttons/Button'

import { ProductsContext } from '@/contexts/ProductsContext'

type ApplyCouponProps = {
  customSubtotal?: number
}

export default function ApplyCoupon({ customSubtotal }: ApplyCouponProps) {
  const [isEmpty, setIsEmpty] = useState(true)

  const couponRef = useRef<HTMLInputElement>(null)
  const { handleApplyCoupon } = useContext(ProductsContext)

  function handleCheckIsEmpty() {
    setIsEmpty(couponRef.current && !couponRef.current.value ? true : false)
  }

  return (
    <div className="flex h-fit w-full max-w-[32.9375rem] flex-wrap items-center justify-center gap-4">
      <input
        name="discount"
        ref={couponRef}
        type="text"
        onChange={handleCheckIsEmpty}
        className="w-full max-w-[18.75rem] rounded border border-gray-800 bg-transparent py-4 pl-6 focus:border-gray-600 focus:ring-green-600"
        placeholder="Coupon here"
      />
      <Button
        onClick={() => handleApplyCoupon(couponRef, customSubtotal)}
        variant="green"
        className="px-12 py-4"
        disabled={isEmpty}
      >
        Apply Coupon
      </Button>
    </div>
  )
}
