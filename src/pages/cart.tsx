import Link from 'next/link'
import { useRouter } from 'next/router'
import React, {
  ChangeEvent,
  Fragment,
  useContext,
  useEffect,
  useState,
} from 'react'

import { getProducts } from '@/lib/http'

import ApplyCoupon from '@/components/ApplyCoupon'
import Button from '@/components/buttons/Button'
import Steps from '@/components/Steps'

import { Product, ProductsContext } from '@/contexts/ProductsContext'

export default function Cart() {
  const {
    products,
    discounts,
    setProducts,
    shipping,
    handleChangeQuantity,
    subtotal,
  } = useContext(ProductsContext)
  const [isMobileSize, setIsMobileSize] = useState(false)

  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      const productsData = await getProducts()
      // call shipping api and set shipping val
      setProducts(productsData)
    })()
  }, [setProducts])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    const handler = () => {
      setIsMobileSize(mediaQuery.matches)
    }

    mediaQuery.addEventListener('change', handler)

    return () => {
      mediaQuery.removeEventListener('change', () => handler)
    }
  }, [])

  function redirectToCheckout() {
    router.push({
      pathname: '/checkout',
      query: {
        from: 'cart',
      },
    })
  }

  return (
    <div className="px-2 sm:px-8 2xl:px-[8.4375rem]">
      <Steps flow="buy" currentStep={0} />
      <div className="flex flex-col items-center gap-6">
        {!isMobileSize ? (
          <table className="w-full table-fixed">
            <thead className="bg-white">
              <tr className="rounded">
                <th className="rounded py-6 pl-10 text-center">Product</th>
                <th className="py-6 text-center">Price</th>
                <th className="py-6 text-center">Quantity</th>
                <th className="rounded py-6 pr-10 text-center">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <Fragment key={product.id}>
                  <tr className="h-10"></tr>
                  <tr data-testid="product-row" className="rounded bg-white">
                    <td
                      className="rounded py-10 pl-10 align-middle"
                      data-heading="Product: "
                    >
                      <div className="flex items-center gap-[1.375rem]">
                        <img
                          alt="product-image"
                          src={product.images[0]}
                          className="inline-block h-[2.8125rem] w-[3.125rem]"
                        ></img>
                        <p className="w-fit text-center">{product.name}</p>
                      </div>
                    </td>
                    <td className="py-10 text-center " data-heading="Price: ">
                      ${product.price}
                    </td>
                    <td className="py-10 text-center" data-heading="Quantity: ">
                      <input
                        type="number"
                        value={product.quantity}
                        onChange={(e) => handleChangeQuantity(e, product.id)}
                        className="w-[4.5rem] rounded border border-gray-600 py-[.375rem]"
                        data-testid="quantity-input"
                      />
                    </td>
                    <td
                      className="rounded py-10 pr-10 text-center"
                      data-heading="Subtotal: "
                      data-testid="product-subtotal-val"
                    >
                      ${product.price * product.quantity}
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          <MobileCartProducts
            products={products}
            handleChangeQuantity={handleChangeQuantity}
          />
        )}

        <div className="flex w-full justify-center md:justify-start">
          <Link href="/products">
            <Button
              variant="ghost"
              className="border border-gray-800 px-12 py-4"
            >
              Return To Shop
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-8 pt-20 xl:justify-between">
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

type MobileCartProductsProps = {
  products: Product[]
  handleChangeQuantity: (
    event: ChangeEvent<HTMLInputElement>,
    id: string,
  ) => void
}

function MobileCartProducts({
  products,
  handleChangeQuantity,
}: MobileCartProductsProps) {
  return (
    <div className="w-full">
      {products.map((product) => (
        <Fragment key={product.id}>
          <span className="block h-5"></span>
          <div
            data-testid="product-row"
            className="grid grid-cols-[30%_1fr] gap-4 rounded bg-white p-4"
          >
            <img
              alt="product-image"
              src={product.images[0]}
              className="inline-block self-center"
            ></img>
            <div className="flex w-full flex-col items-center gap-2">
              <p className="">{product.name}</p>
              <span className="block">Price: ${product.price}</span>
              <input
                type="number"
                value={product.quantity}
                onChange={(e) => handleChangeQuantity(e, product.id)}
                className="w-[4.5rem] rounded border border-gray-600 py-[.375rem]"
                data-testid="quantity-input"
              />

              <div data-testid="product-subtotal-val">
                Subtotal: ${product.price * product.quantity}
              </div>
            </div>

            <div className="flex items-center justify-center gap-8"></div>
          </div>
        </Fragment>
      ))}
    </div>
  )
}
