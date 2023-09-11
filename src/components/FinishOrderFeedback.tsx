import Link from 'next/link'
import { ShoppingBag } from 'react-feather'

import Button from '@/components/buttons/Button'
import Divider from '@/components/Divider'
import PaymentButton from '@/components/PaymentButton'

import { CheckoutData } from '@/app/actions'

type FinishOrderFeedbackProps = {
  checkoutData: CheckoutData
}

export default function FinishOrderFeedback({
  checkoutData,
}: FinishOrderFeedbackProps) {
  return (
    <div className="flex items-center justify-center px-2 pt-2 md:h-payment-screen">
      <div className="flex w-full max-w-[31.3125rem] flex-col items-center justify-center gap-8 rounded bg-brown-300 p-8 text-white">
        <ShoppingBag />
        <div className="space-y-4">
          <div>
            <p className="text-center text-sm">
              Thanks for placing order {checkoutData.orderId}
            </p>
            <p className="text-center text-sm">
              We will send you a notification within 2 days when it ships
            </p>
          </div>
          <Divider />
          <div>
            <p className="text-center">
              Get in touch with us if you have any questions or concerns
            </p>
          </div>
        </div>
        <div className="w-full space-y-4">
          <PaymentButton checkoutData={checkoutData} className="block w-full" />
          <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
            <Link href="/products" className="w-full flex-1">
              <Button variant="light" className="block h-12 w-full text-center">
                Go back shopping
              </Button>
            </Link>
            <Link
              href={`/orders/${checkoutData.orderId}`}
              className="w-full flex-1"
            >
              <Button variant="green" className="block h-12 w-full text-center">
                Track order
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
