import { useContext } from 'react'

import { Address } from '@/lib/db/mongodb/addresses'

import ApplyCoupon from '@/components/ApplyCoupon'
import Button from '@/components/buttons/Button'

import { CheckoutData, generateCheckoutProductPayload } from '@/app/actions'
import { PriceDetails } from '@/app/checkout/components/PriceDetails'
import { ProductDetails } from '@/app/checkout/components/ProductDetails'
import { Order } from '@/app/orders/page'
import { ProductsContext } from '@/contexts/ProductsContext'
import { LocalStorage } from '@/models/localStorage'

type ListCartProductsProps = {
  selectedAddress: Address | null
  setCheckoutData: (checkoutData: CheckoutData | null) => void
}

export function ListCartProducts({
  selectedAddress,
  setCheckoutData,
}: ListCartProductsProps) {
  const {
    products,
    subtotal,
    shipping,
    discounts,
    productsQuantity,
    currentCoupon,
    setProducts,
    setNumberOfProductsInCart,
    setProductsQuantity,
    setCurrentCoupon,
  } = useContext(ProductsContext)

  function cleanup() {
    setProducts([])
    localStorage.removeItem(LocalStorage.CART)
    setNumberOfProductsInCart(0)
    setProductsQuantity(new Map())
    setCurrentCoupon(null)
  }

  async function handleFinishOrder() {
    if (!selectedAddress) {
      alert('You need to select an address to continue')
      return
    }

    const { zipCode, city, street, number } = selectedAddress

    // Order
    const order: Omit<Order, 'id'> = {
      address: `${zipCode}, ${city}, ${street}, ${number}`,
      createdAt: new Date().toISOString(),
      status: 'Order Placed',
      discounts,
      products: products.map((p) => ({
        id: p.id,
        quantity: productsQuantity.get(p.id) ?? 1,
      })),
      shipping,
      subtotal,
    }
    const { id } = await fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    }).then((res) => res.json())

    setCheckoutData({
      orderId: id,
      checkoutProducts: await Promise.all(
        products.map((p) =>
          generateCheckoutProductPayload(p, productsQuantity.get(p.id) ?? 1),
        ),
      ),
    })

    if (currentCoupon) {
      await fetch('/api/coupons', {
        method: 'PATCH',
        body: JSON.stringify({
          id: currentCoupon.id,
          quantity: currentCoupon.quantity - 1,
        }),
      })
    }

    cleanup()
  }

  return (
    <>
      <div className="flex w-full max-w-[26.5625rem] flex-col gap-8">
        {products.map((p) => (
          <ProductDetails
            key={p.id}
            imagePath={p.images[0]}
            name={p.name}
            price={p.price}
            quantity={productsQuantity.get(p.id) ?? 1}
          />
        ))}
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
