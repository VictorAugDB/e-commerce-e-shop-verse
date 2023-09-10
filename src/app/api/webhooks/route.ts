/* eslint-disable no-console */
import { NextResponse } from 'next/server'
import type { Stripe } from 'stripe'

import { MongoDBUncanceledOrders } from '@/lib/db/mongodb/orders'
import { MongoDBProducts } from '@/lib/db/mongodb/products'
import { stripe } from '@/lib/stripe'

type UpdateProductsQuantity = {
  id: string
  quantity: number
}

export async function POST(req: Request) {
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      await (await req.blob()).text(),
      req.headers.get('stripe-signature') as string,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    )
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    // On error, log and return the error message.
    if (err instanceof Error) console.log(err)
    console.log(`❌ Error message: ${errorMessage}`)
    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 },
    )
  }

  // Successfully constructed event.
  console.log('✅ Success:', event.id)

  const permittedEvents: string[] = [
    'checkout.session.completed',
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
  ]

  if (permittedEvents.includes(event.type)) {
    let data

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          data = event.data.object as Stripe.Checkout.Session
          if (data.payment_status === 'paid') {
            const mongoDbOrdersClient = new MongoDBUncanceledOrders()
            const orderId = data.metadata && data.metadata.orderId

            await mongoDbOrdersClient.updateOrderStatus(
              orderId as string,
              'Payment Confirmed',
            )

            const lineItems = await stripe.checkout.sessions.listLineItems(
              data.id,
              {
                expand: ['data.price.product'],
              },
            )

            const productsUpdateInfo: UpdateProductsQuantity[] =
              lineItems.data.map((li) => {
                const product = li.price?.product as Stripe.Product

                return {
                  quantity: li.quantity as number,
                  id: product.metadata.product_id,
                }
              })

            await Promise.all(
              productsUpdateInfo.map(async (puf) => {
                const mongoDbProductsClient = new MongoDBProducts()
                await mongoDbProductsClient.decreaseQuantityIncreaseSales(
                  puf.id,
                  puf.quantity,
                )
              }),
            )
          }

          break
        case 'payment_intent.payment_failed':
          data = event.data.object as Stripe.PaymentIntent
          console.log(`❌ Payment failed: ${data.last_payment_error?.message}`)
          break
        case 'payment_intent.succeeded':
          data = event.data.object as Stripe.PaymentIntent
          console.log(`💰 PaymentIntent status: ${data.status}`)
          break
        default:
          throw new Error(`Unhhandled event: ${event.type}`)
      }
    } catch (error) {
      console.log(error)
      return NextResponse.json(
        { message: 'Webhook handler failed' },
        { status: 500 },
      )
    }
  }
  // Return a response to acknowledge receipt of the event.
  return NextResponse.json({ message: 'Received' }, { status: 200 })
}
