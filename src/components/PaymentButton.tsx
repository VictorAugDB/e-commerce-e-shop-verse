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
    // Remove this if you want to put this in live mode
    alert(
      'The payment is on test mode then you must use this card number in the card on the checkout page: 4242 4242 4242 4242.',
    )

    await createCheckoutSession(checkoutData)
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
