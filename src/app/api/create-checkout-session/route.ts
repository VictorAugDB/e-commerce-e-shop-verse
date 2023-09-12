import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

import { stripe } from '@/lib/stripe'

import { CheckoutData } from '@/app/actions'
import { createCreatePayload } from '@/utils/stripeHelpers'

export async function POST(req: Request) {
  const { orderId, checkoutProducts, shipping }: CheckoutData = await req.json()

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create({
      ...createCreatePayload({ checkoutProducts, orderId, shipping }),
      success_url: `${headers().get(
        'origin',
      )}/checkout/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${headers().get('origin')}/orders/${orderId}`,
    })

  return NextResponse.json({ id: checkoutSession.id })
}
