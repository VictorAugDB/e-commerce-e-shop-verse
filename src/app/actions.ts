'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Stripe from 'stripe'

import { stripe } from '@/lib/stripe'

import { CURRENCY } from '@/config'
import { Product } from '@/contexts/ProductsContext'
import { formatAmountForStripe } from '@/utils/stripeHelpers'

type CheckoutProduct = {
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
}

export async function generateCheckoutProductPayload(
  product: Product,
  quantity: number,
): Promise<CheckoutProduct> {
  return {
    boughtQuantity: quantity,
    category: product.category,
    description: product.description,
    images: product.images,
    price: product.price,
    productId: product.id,
    productName: product.name,
  }
}

export async function createCheckoutSession({
  checkoutProducts,
  orderId,
}: CheckoutData): Promise<void> {
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

  redirect(checkoutSession.url as string)
}

export async function redirectToHome() {
  return '/'
}
