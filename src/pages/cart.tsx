import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'

import { getProducts } from '@/lib/http'

import ApplyCoupon from '@/components/ApplyCoupon'
import Button from '@/components/buttons/Button'
import Steps from '@/components/Steps'

import { ProductsContext } from '@/contexts/ProductsContext'

export default function Cart() {
  const {
    products,
    discounts,
    setProducts,
    shipping,
    handleChangeQuantity,
    subtotal,
  } = useContext(ProductsContext)

  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      const productsData = await getProducts()
      // call shipping api and set shipping val
      setProducts(productsData)
    })()
  }, [setProducts])

  function redirectToCheckout() {
    router.push({
      pathname: '/checkout',
      query: {
        from: 'cart',
      },
    })
  }

  return (
    <div className="px-[8.4375rem]">
      <Steps flow="buy" currentStep={0} />
      <div className="flex flex-col items-center gap-6">
        <table className="w-full table-fixed">
          <thead className="hidden bg-white md:table-header-group">
            <tr className="rounded">
              <th className="rounded py-6 pl-10 text-center">Product</th>
              <th className="py-6 text-center">Price</th>
              <th className="py-6 text-center">Quantity</th>
              <th className="rounded py-6 pr-10 text-center">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <React.Fragment key={product.id}>
                <tr className="h-10"></tr>
                <tr data-testid="product-row" className="rounded bg-white">
                  <td
                    className="rounded py-10 pl-10 text-center align-middle before:content-[attr(data-heading)] md:before:content-[]"
                    data-heading="Product: "
                  >
                    <img
                      alt="product-image"
                      src={product.image}
                      className="mr-[1.375rem] inline-block h-[2.8125rem] w-[3.125rem]"
                    ></img>
                    {product.name}
                  </td>
                  <td
                    className="py-10 text-center before:content-[attr(data-heading)] md:before:content-[]"
                    data-heading="Price: "
                  >
                    ${product.price}
                  </td>
                  <td
                    className="py-10 text-center before:content-[attr(data-heading)] md:before:content-[]"
                    data-heading="Quantity: "
                  >
                    <input
                      type="number"
                      value={product.quantity}
                      onChange={(e) => handleChangeQuantity(e, product.id)}
                      className="w-[4.5rem] rounded border border-gray-600 py-[.375rem]"
                      data-testid="quantity-input"
                    />
                  </td>
                  <td
                    className="rounded py-10 pr-10 text-center before:content-[attr(data-heading)] md:before:content-[]"
                    data-heading="Subtotal: "
                    data-testid="product-subtotal-val"
                  >
                    ${product.price * product.quantity}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <div className="flex w-full items-center justify-between">
          <Button variant="ghost" className="border border-gray-800 px-12 py-4">
            Return To Shop
          </Button>
          <Button variant="ghost" className="border border-gray-800 px-12 py-4">
            Update Cart
          </Button>
        </div>
      </div>
      <div className="flex justify-between pt-20">
        <ApplyCoupon />
        <div className="w-full max-w-[29.375rem] rounded border-[1.5px] border-black px-6 py-8">
          <h4 className="mb-6">Cart Total</h4>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p>Subtotal:</p>
              <p data-testid="cart-subtotal-val">${subtotal}</p>
            </div>
            <span className="h-px w-full bg-gray-400"></span>
            <div className="flex items-center justify-between">
              <p>Shipping:</p>
              <p>{shipping === 0 ? 'Free' : `$${shipping}`}</p>
            </div>
            <span className="h-px w-full bg-gray-400"></span>
            <div className="flex items-center justify-between">
              <p>Discounts:</p>
              <p data-testid="discount-val">${discounts}</p>
            </div>
            <span className="h-px w-full bg-gray-400"></span>

            <div className="flex items-center justify-between">
              <p>Total:</p>
              <p data-testid="total-val">${subtotal + shipping - discounts}</p>
            </div>
            <Button
              onClick={redirectToCheckout}
              variant="green"
              className="mx-auto w-fit px-12 py-4"
            >
              Proceed to checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
