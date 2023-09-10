'use client'

import { useRouter } from 'next/navigation'
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
  const router = useRouter()

  async function handleGoToPayment() {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify(checkoutData),
    }).then((res) => res.json())

    const stripe = await getStripe()

    stripe?.redirectToCheckout({
      sessionId: response.id,
    })

    console.log(response)
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
