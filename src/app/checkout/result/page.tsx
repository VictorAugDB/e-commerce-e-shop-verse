import { Check } from 'react-feather'
import type { Stripe } from 'stripe'

import { IntlHelper } from '@/lib/helpers/Intl'
import { stripe } from '@/lib/stripe'

import { LeaveButton } from '@/app/checkout/result/LeaveButton'
import { CURRENCY } from '@/config'
import { formatAmountForDisplay } from '@/utils/stripeHelpers'

export default async function ResultPage({
  searchParams,
}: {
  searchParams: { session_id: string }
}): Promise<JSX.Element> {
  if (!searchParams.session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...`)')

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.retrieve(searchParams.session_id, {
      expand: ['line_items', 'payment_intent'],
    })

  const paymentIntent = checkoutSession.payment_intent as Stripe.PaymentIntent

  function generateInfoMessage() {
    switch (paymentIntent.status) {
      case 'succeeded':
        return "We've received your payment"
      case 'processing':
        return "We're processing your payment"
    }
  }

  function getOrderAddress() {
    const orderId = checkoutSession?.metadata?.orderId

    return `/orders/${orderId}`
  }

  return (
    <div className="flex flex-col items-center gap-6 rounded bg-white p-6 shadow-lg">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white ring-[14px] ring-green-200">
        <Check />
      </div>
      <p className="font-medium text-gray-600">{generateInfoMessage()}</p>
      <h4>
        {formatAmountForDisplay(
          (checkoutSession.amount_total ?? 0) / 100,
          CURRENCY,
        )}
      </h4>
      <div className="h-px w-full bg-gray-400" />
      <div className="flex items-center gap-2">
        <p className="text-gray-600">Payment Time:</p>
        <p className="font-medium">
          {IntlHelper.formatDateMonthLongWithTime(
            new Date(checkoutSession.created * 1000).toISOString(),
            'en-US',
          )}
        </p>
      </div>
      <div className="h-px w-full bg-gray-400" />
      <div className="flex w-full items-center gap-2">
        <LeaveButton variant="light" to="/products" text="Go back shopping" />
        <LeaveButton
          variant="green"
          to={getOrderAddress()}
          text="Track order"
        />
      </div>
    </div>
  )
}
