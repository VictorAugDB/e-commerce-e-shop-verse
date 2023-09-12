'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Stripe from 'stripe'

import { stripe } from '@/lib/stripe'

import { createCreatePayload } from '@/utils/stripeHelpers'

export type CheckoutProduct = {
  productName: string
  productId: string
  price: number
  boughtQuantity: number
  category: string
  description: string
  images: string[]
}

export type CheckoutData = {
  orderId: string
  checkoutProducts: CheckoutProduct[]
  shipping: number
}

export async function createCheckoutSession({
  checkoutProducts,
  orderId,
  shipping,
}: CheckoutData): Promise<void> {
  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create({
      ...createCreatePayload({ checkoutProducts, orderId, shipping }),
      success_url: `${headers().get(
        'origin',
      )}/checkout/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${headers().get('origin')}/orders/${orderId}`,
    })

  redirect(checkoutSession.url as string)
}

export async function redirectToHome() {
  return '/'
}
