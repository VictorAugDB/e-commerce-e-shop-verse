// Amount must be in cents

import Stripe from 'stripe'

import { CheckoutData, CheckoutProduct } from '@/app/actions'
import { CURRENCY } from '@/config'
import { Product } from '@/contexts/ProductsContext'

export function formatAmountForDisplay(
  amount: number,
  currency: string,
): string {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  })
  return numberFormat.format(amount)
}

export function formatAmountForStripe(
  amount: number,
  currency: string,
): number {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  })
  const parts = numberFormat.formatToParts(amount)
  let zeroDecimalCurrency = true
  for (const part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false
    }
  }
  return zeroDecimalCurrency ? amount : Math.round(amount * 100)
}

export function generateCheckoutProductPayload(
  product: Product,
  quantity: number,
  discountPercentage: number | undefined,
): CheckoutProduct {
  const decimalPercentage = discountPercentage ? discountPercentage / 100 : 0

  return {
    boughtQuantity: quantity,
    category: product.category,
    description: product.description,
    images: product.images,
    price: product.price * (1 - decimalPercentage),
    productId: product.id,
    productName: product.name,
  }
}

export function createCreatePayload({
  checkoutProducts,
  orderId,
  shipping,
}: CheckoutData): Omit<
  Stripe.Checkout.SessionCreateParams,
  'success_url' | 'cancel_url'
> {
  return {
    mode: 'payment',
    payment_method_types: ['card'],
    submit_type: 'pay',
    metadata: {
      orderId,
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: formatAmountForStripe(shipping, CURRENCY),
            currency: CURRENCY,
          },
          display_name: shipping === 0 ? 'Free Shipping' : 'Shipping Rate',
          // TODO Add to the shipping this estimates
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 10,
            },
            maximum: {
              unit: 'business_day',
              value: 30,
            },
          },
        },
      },
    ],
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
  }
}
