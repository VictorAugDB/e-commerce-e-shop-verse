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
        <div className="flex flex-wrap items-center justify-center gap-8">
          <Link href="/products">
            <Button variant="light" className="px-4 py-3">
              Go back shopping
            </Button>
          </Link>
          <PaymentButton checkoutData={checkoutData} />
          <Link href={`/orders/${checkoutData.orderId}`}>
            <Button variant="green" className="px-12 py-3">
              Track order
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
