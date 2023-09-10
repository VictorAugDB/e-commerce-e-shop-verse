'use client'

import { ComponentPropsWithRef } from 'react'
import { twMerge } from 'tailwind-merge'

import Button from '@/components/buttons/Button'

import { CheckoutData, createCheckoutSession } from '@/app/actions'

type PaymentButtonProps = ComponentPropsWithRef<'button'> & {
  checkoutData: CheckoutData
}

export default function PaymentButton({
  checkoutData,
  className,
  ...props
}: PaymentButtonProps) {
  async function handleGoToPayment() {
    createCheckoutSession(checkoutData)
  }

  return (
    <Button
      onClick={handleGoToPayment}
      variant="green"
      className={twMerge('px-12 py-3', className)}
      {...props}
    >
      Go to payment
    </Button>
  )
}
