'use client'

import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronUp, Trash } from 'react-feather'

import { getProductsByIds } from '@/lib/http'

import ApplyCoupon from '@/components/ApplyCoupon'
import Button from '@/components/buttons/Button'
import { ConfirmationDialog } from '@/components/dialogs/ConfirmationDialog'
import NextImage from '@/components/NextImage'
import Steps from '@/components/Steps'

import { Product, ProductsContext } from '@/contexts/ProductsContext'
import { LocalStorage, LSCart } from '@/models/localStorage'

export default function Cart() {
  const {
    products,
    discounts,
    setProducts,
    shipping,
    subtotal,
    setCartQuantity,
  } = useContext(ProductsContext)
  const [isMobileSize, setIsMobileSize] = useState(false)

  const router = useRouter()

  useEffect(() => {
    setProducts([])
    if (typeof window !== 'undefined') {
      ;(async () => {
        const cartProducts: LSCart[] = JSON.parse(
          localStorage.getItem(LocalStorage.CART) ?? '[]',
        )
        const map = new Map(cartProducts.map((cp) => [cp.id, cp.quantity]))

        if (!cartProducts) {
          return { props: { products: [] } }
        }

        const apiProducts = await getProductsByIds(
          cartProducts.map((cp) => cp.id),
        )

        setProducts(
          apiProducts.map((p) => ({
            ...p,
            cartQuantity: map.get(p.id),
          })),
        )
      })()
    }
  }, [setProducts])

  function handleRemoveProduct(id: string) {
    setProducts(products.filter((p) => p.id !== id))

    const cartProducts: LSCart[] = JSON.parse(
      localStorage.getItem(LocalStorage.CART) ?? '[]',
    )
    const filteredCartProducts = cartProducts.filter((cp) => cp.id !== id)

    if (!filteredCartProducts.length) {
      localStorage.removeItem(LocalStorage.CART)
    } else {
      localStorage.setItem(
        LocalStorage.CART,
        JSON.stringify(filteredCartProducts),
      )
    }

    setCartQuantity((state) => state - 1)
  }

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
      {products.length ? (
        <>
          <div className="flex flex-col items-center gap-6">
            {!isMobileSize ? (
              <table className="w-full table-fixed">
                <thead className="bg-white">
                  <tr className="rounded">
                    <th className="rounded py-6 pl-10 text-center">Product</th>
                    <th className="py-6 text-center">Price</th>
                    <th className="py-6 text-center">Quantity</th>
                    <th className="rounded py-6 text-center">Subtotal</th>
                    <th className="rounded py-6 pr-10 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <Fragment key={product.id}>
                      <tr className="h-10"></tr>
                      <tr
                        data-testid="product-row"
                        className="rounded bg-white"
                      >
                        <td className="rounded py-10 pl-10 align-middle">
                          <div className="flex items-center gap-[1.375rem]">
                            <img
                              alt="product-image"
                              src={product.images[0]}
                              className="inline-block h-[2.8125rem] w-[3.125rem]"
                            ></img>
                            <p className="w-fit text-center">{product.name}</p>
                          </div>
                        </td>
                        <td className="py-10 text-center ">${product.price}</td>
                        <td className="py-10">
                          <QuantityInput
                            defaultValue={product.cartQuantity ?? 1}
                            productId={product.id}
                            productsQuantity={product.quantity}
                          />
                        </td>
                        <td
                          className="rounded py-10 text-center"
                          data-testid="product-subtotal-val"
                        >
                          ${product.price * (product.cartQuantity ?? 1)}
                        </td>
                        <td className="py-10 pr-10 text-center align-middle">
                          <ConfirmationDialog
                            openButton={
                              <Button variant="ghost" className="text-red-400">
                                <Trash className="mx-auto" />
                              </Button>
                            }
                            actionButton={
                              <Button
                                variant="green"
                                onClick={() => handleRemoveProduct(product.id)}
                              >
                                Yes, Remove from the cart
                              </Button>
                            }
                            description={`Confirm that you really want to remove ${product.name} from your cart`}
                          ></ConfirmationDialog>
                        </td>
                      </tr>
                    </Fragment>
                  ))}
                </tbody>
              </table>
            ) : (
              <MobileCartProducts
                products={products}
                handleRemoveProduct={handleRemoveProduct}
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
                  <p data-testid="total-val">
                    ${subtotal + shipping - discounts}
                  </p>
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
        </>
      ) : (
        <div className="w-full space-y-4">
          <h4 className="text-center">
            There's nothing here, add some products!
          </h4>
          <Link className="mx-auto block w-fit" href="/products">
            <Button
              variant="ghost"
              className="border border-gray-800 px-12 py-4"
            >
              Return To Shop
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

type MobileCartProductsProps = {
  products: Product[]
  handleRemoveProduct: (id: string) => void
}

function MobileCartProducts({
  products,
  handleRemoveProduct,
}: MobileCartProductsProps) {
  return (
    <div className="w-full">
      {products.map((product) => (
        <Fragment key={product.id}>
          <span className="block h-5"></span>
          <div
            data-testid="product-row"
            className="flex items-center gap-4 rounded bg-white p-4"
          >
            <div className="relative h-[139px] w-full max-w-[11.125rem]">
              <NextImage
                alt="product-image"
                src={product.images[0]}
                fill
                style={{
                  objectFit: 'contain',
                }}
              ></NextImage>
            </div>
            <div className="flex w-full flex-col items-center gap-2">
              <p className="">{product.name}</p>
              <span className="block">Price: ${product.price}</span>
              <QuantityInput
                defaultValue={product.cartQuantity ?? 1}
                productId={product.id}
                productsQuantity={product.quantity}
              />

              <div data-testid="product-subtotal-val" className="text-center">
                Subtotal: ${product.price * (product.cartQuantity ?? 1)}
              </div>
            </div>

            <ConfirmationDialog
              openButton={
                <Button variant="ghost" className="text-red-400">
                  <Trash className="mx-auto" />
                </Button>
              }
              actionButton={
                <Button
                  variant="green"
                  onClick={() => handleRemoveProduct(product.id)}
                >
                  Yes, Remove from the cart
                </Button>
              }
              description={`Confirm that you really want to remove ${product.name} from your cart`}
            ></ConfirmationDialog>
          </div>
        </Fragment>
      ))}
    </div>
  )
}

type QuantityInputProps = {
  defaultValue: number
  productId: string
  productsQuantity: number
}

function QuantityInput({
  defaultValue,
  productId,
  productsQuantity,
}: QuantityInputProps) {
  const { setProducts } = useContext(ProductsContext)

  const ref = useRef<HTMLInputElement>(null)

  function handleIncreaseQuantity(id: string) {
    const currentRef = ref.current
    if (currentRef) {
      currentRef.value = (Number(currentRef.value) + 1).toString()
    }

    handleChangeQuantity(id)
  }

  function handleDecreaseQuantity(id: string) {
    const currentRef = ref.current
    if (currentRef) {
      currentRef.value = (Number(currentRef.value) - 1).toString()
    }

    handleChangeQuantity(id)
  }

  function handleChangeQuantity(id: string) {
    const currentRef = ref.current
    let quantity = Number(currentRef?.value)

    if (quantity <= 0) {
      if (currentRef) {
        currentRef.value = '1'
        quantity = Number(currentRef.value)
      }
      return
    }

    if (productsQuantity < quantity) {
      if (currentRef) {
        currentRef.value = productsQuantity.toString()
        quantity = Number(currentRef.value)
      }
    }

    const cartProducts: LSCart[] = JSON.parse(
      localStorage.getItem(LocalStorage.CART) ?? '[]',
    )

    const productIdx = cartProducts.findIndex((cp) => cp.id === id)

    cartProducts[productIdx].quantity = quantity
    localStorage.setItem(LocalStorage.CART, JSON.stringify(cartProducts))

    setProducts((products) =>
      products.map((p) => (p.id === id ? { ...p, cartQuantity: quantity } : p)),
    )
  }

  return (
    <div className="mx-auto flex w-fit items-center rounded border border-gray-600 py-px pl-2 pr-px focus-within:border-[--tw-ring-offset-color] focus-within:ring-2">
      <input
        type="text"
        ref={ref}
        defaultValue={defaultValue}
        onBlur={() => handleChangeQuantity(productId)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            ref.current && ref.current.blur()
          }
        }}
        className="w-[2.5rem] rounded border-0 p-0 focus:ring-0"
        data-testid="quantity-input"
      />
      <div>
        <button
          onClick={() => handleIncreaseQuantity(productId)}
          disabled={productsQuantity === Number(ref.current?.value)}
          className="block cursor-pointer rounded transition hover:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          data-testid="increase-quantity"
        >
          <ChevronUp className="h-4 md:h-5" />
        </button>
        <button
          onClick={() => handleDecreaseQuantity(productId)}
          disabled={Number(ref.current?.value) === 1}
          className="not:disabled:hover:bg-gray-400 block cursor-pointer rounded transition hover:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          data-testid="decrease-quantity"
        >
          <ChevronDown className="h-4 md:h-5" />
        </button>
      </div>
    </div>
  )
}
