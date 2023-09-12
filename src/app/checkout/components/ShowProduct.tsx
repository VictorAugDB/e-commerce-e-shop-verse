import { useContext } from 'react'

import { Address } from '@/lib/db/mongodb/addresses'

import ApplyCoupon from '@/components/ApplyCoupon'
import Button from '@/components/buttons/Button'

import { CheckoutData } from '@/app/actions'
import { PriceDetails } from '@/app/checkout/components/PriceDetails'
import { ProductDetails } from '@/app/checkout/components/ProductDetails'
import { Order } from '@/app/orders/page'
import { Product, ProductsContext } from '@/contexts/ProductsContext'
import { generateCheckoutProductPayload } from '@/utils/stripeHelpers'

type ShowProductProps = {
  product: Product
  selectedAddress: Address | null
  quantity: number
  size?: string
  setCheckoutData: (checkoutData: CheckoutData | null) => void
}

export function ShowProduct({
  product,
  selectedAddress,
  quantity,
  size: _, // use when size is added in order.products collection
  setCheckoutData,
}: ShowProductProps) {
  const { currentCoupon, shipping, setCurrentCoupon } =
    useContext(ProductsContext)

  const subtotal = product.price * quantity
  const discounts = currentCoupon
    ? Math.min(
        currentCoupon.limit,
        (product.price * currentCoupon.percentage) / 100,
      )
    : 0

  function cleanup() {
    setCurrentCoupon(null)
  }

  async function handleFinishOrder() {
    if (!selectedAddress) {
      alert('You need to select an address to continue')
      return
    }

    const { zipCode, city, street, number } = selectedAddress

    const order: Omit<Order, 'id'> = {
      address: `${zipCode}, ${city}, ${street}, ${number}`,
      createdAt: new Date().toISOString(),
      status: 'Order Placed',
      discounts,
      products: [{ id: product.id, quantity }],
      shipping,
      subtotal,
    }
    const { id } = await fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    }).then((res) => res.json())

    setCheckoutData({
      orderId: id,
      checkoutProducts: [
        await generateCheckoutProductPayload(
          product,
          quantity,
          currentCoupon?.percentage,
        ),
      ],
      shipping,
    })

    cleanup()
  }

  return (
    <>
      <div className="flex w-full max-w-[26.5625rem] flex-col gap-8">
        <ProductDetails
          key={product.id}
          imagePath={product.images[0]}
          name={product.name}
          price={product.price}
          quantity={quantity}
        />

        <PriceDetails
          subtotal={subtotal}
          shipping={shipping}
          discounts={discounts}
        />
      </div>
      <ApplyCoupon />
      <Button
        onClick={handleFinishOrder}
        variant="green"
        className="mx-auto w-fit px-12 py-4 xl:mx-0"
      >
        Place Order
      </Button>
    </>
  )
}
