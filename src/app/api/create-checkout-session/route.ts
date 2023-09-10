import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

import { stripe } from '@/lib/stripe'

import { CheckoutData } from '@/app/actions'
import { CURRENCY } from '@/config'
import { formatAmountForStripe } from '@/utils/stripeHelpers'

export async function POST(req: Request) {
  const { orderId, checkoutProducts }: CheckoutData = await req.json()

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      submit_type: 'pay',
      metadata: {
        orderId,
      },
      line_items: checkoutProducts.map((cp) => {
        const addictionalData: Stripe.MetadataParam = {
          product_id: cp.productId,
          category: cp.category,
        }

        return {
          quantity: cp.boughtQuantity,
          price_data: {
            currency: CURRENCY,
            product_data: {
              name: cp.productName,
              description: cp.description,
              metadata: addictionalData,
              images: cp.images,
            },
            unit_amount: formatAmountForStripe(cp.price, CURRENCY),
          },
        }
      }),
      success_url: `${headers().get(
        'origin',
      )}/checkout/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${headers().get('origin')}/orders/${orderId}`,
    })

  return NextResponse.json({ id: checkoutSession.id })
}
