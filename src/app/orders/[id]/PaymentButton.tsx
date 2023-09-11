'use client'

import { ComponentPropsWithRef } from 'react'
import { twMerge } from 'tailwind-merge'

import Button from '@/components/buttons/Button'

import { CheckoutData } from '@/app/actions'
import getStripe from '@/utils/getStripe'

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
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify(checkoutData),
    }).then((res) => res.json())

    const stripe = await getStripe()

    stripe?.redirectToCheckout({
      sessionId: response.id,
    })
  }

  return (
    <form action={handleGoToPayment}>
      <Button
        type="submit"
        variant="green"
        className={twMerge('px-12', className)}
        {...props}
      >
        Go to payment
      </Button>
    </form>
  )
}
