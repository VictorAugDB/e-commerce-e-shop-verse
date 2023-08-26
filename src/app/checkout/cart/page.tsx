'use client'

import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { ComponentProps, useContext, useRef, useState } from 'react'
import useSWR from 'swr'

import ApplyCoupon from '@/components/ApplyCoupon'
import Button from '@/components/buttons/Button'
import InputBorderBottom from '@/components/InputBorderBottom'
import NextImage from '@/components/NextImage'
import PaymentSuccess from '@/components/PaymentSuccess'
import Steps from '@/components/Steps'

import { Order } from '@/app/orders/page'
import { ProductsContext } from '@/contexts/ProductsContext'
import { LocalStorage } from '@/models/localStorage'

const fetcher = (args: any) => fetch(args).then((res) => res.json())

export default function Checkout() {
  const searchParams = useSearchParams()
  const id = searchParams && searchParams.get('id')
  const { data: product, error } = useSWR(`/api/products/${id}`, fetcher)
  const [orderId, setorderId] = useState<string | null>(null)

  const quantity = Number(searchParams && searchParams.get('quantity'))
  const inputsRef = {
    firstName: useRef<HTMLInputElement>(null),
    companyName: useRef<HTMLInputElement>(null),
    streetAddress: useRef<HTMLInputElement>(null),
    apartment: useRef<HTMLInputElement>(null),
    city: useRef<HTMLInputElement>(null),
    phoneNumber: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
  }

  const { subtotal, discounts, products, shipping, setCartQuantity } =
    useContext(ProductsContext)

  async function handleFinishOrder() {
    // TODO payment provider calls

    // Order
    const order: Omit<Order, 'id'> = {
      address: 'Some address',
      createdAt: new Date().toISOString(),
      status: 'Order Placed',
      discounts,
      products: product ? [product.id] : products.map((p) => p.id),
      shipping,
      subtotal,
    }
    const { id } = await fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    }).then((res) => res.json())

    setorderId(id)
    localStorage.removeItem(LocalStorage.CART)
    setCartQuantity(0)
  }

  return (
    <>
      {orderId ? (
        <PaymentSuccess id={orderId} />
      ) : (
        <div className="px-2 sm:px-8 2xl:px-[8.4375rem]">
          <Steps
            flow="product-checkout"
            currentStep={3}
            category={product?.category ?? ''}
            productName={product?.name ?? ''}
          />
          <h1 className="text-center md:text-start">Billing Details</h1>
          <div className="mt-10 grid w-full grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex w-full flex-col gap-6 md:max-w-[28.1875rem]">
              <InputBorderBottom
                name="first-name"
                id="first-name"
                ref={inputsRef.firstName}
                placeholder="First Name"
              />
              <InputBorderBottom
                name="company-name"
                id="company-name"
                ref={inputsRef.companyName}
                placeholder="Company Name. (optional)"
              />
              <InputBorderBottom
                name="street-address"
                id="street-address"
                ref={inputsRef.streetAddress}
                placeholder="Street Address"
              />
              <InputBorderBottom
                name="apartment"
                id="apartment"
                ref={inputsRef.apartment}
                placeholder="Apartment, floor, etc. (optional)"
              />
              <InputBorderBottom
                name="town/city"
                id="town/city"
                ref={inputsRef.city}
                placeholder="Town/City"
              />
              <InputBorderBottom
                name="phone-number"
                id="phone-number"
                ref={inputsRef.phoneNumber}
                placeholder="Phone Number"
              />
              <InputBorderBottom
                name="e-mail"
                id="e-mail"
                ref={inputsRef.email}
                placeholder="E-mail"
              />
            </div>
            <div className="flex flex-col items-center gap-8 md:items-start">
              <div className="flex max-w-[26.5625rem] flex-col gap-8">
                {!product ? (
                  <>
                    {products.map((p) => (
                      <ProductDetails
                        key={p.id}
                        imagePath={p.images[0]}
                        name={p.name}
                        price={p.price}
                      />
                    ))}
                  </>
                ) : (
                  <ProductDetails
                    key={product.id}
                    imagePath={product.images[0]}
                    name={product.name}
                    price={product.price}
                  />
                )}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <p>Subtotal:</p>
                    <p>${subtotal}</p>
                  </div>
                  <span className="h-px w-full bg-gray-400"></span>
                  <div className=" flex items-center justify-between">
                    <p>Shipping:</p>
                    <p>{shipping === 0 ? 'Free' : `$${shipping}`}</p>
                  </div>
                  <span className="h-px w-full bg-gray-400"></span>
                  <div className="flex items-center justify-between">
                    <p>Discounts:</p>
                    <p>${discounts}</p>
                  </div>
                  <span className="h-px w-full bg-gray-400"></span>

                  <div className="flex items-center justify-between">
                    <p>Total:</p>
                    <p>${subtotal + shipping - discounts}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <RadioButton
                    id="bank"
                    defaultChecked
                    name="payment-type"
                    label="Bank"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <NextImage
                      width={42}
                      height={28}
                      src="/images/visa.png"
                      alt="visa"
                    />
                    <NextImage
                      width={42}
                      height={28}
                      src="/images/mastercard.png"
                      alt="mastercard"
                    />
                  </div>
                </div>
                <RadioButton
                  id="cash"
                  name="payment-type"
                  label="Cash on delivery"
                />
              </div>
              <ApplyCoupon
                customSubtotal={product ? product.price * quantity : undefined}
              />
              <Button
                onClick={handleFinishOrder}
                variant="green"
                className="mx-auto w-fit px-12 py-4 xl:mx-0"
              >
                Place Order
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

type RadioButtonProps = ComponentProps<typeof motion.input> & {
  name: string
  id: string
  label: string
}

function RadioButton({ name, id, label, ...props }: RadioButtonProps) {
  return (
    <div className="flex items-center gap-4">
      <motion.input
        type="radio"
        id={id}
        name={name}
        className="h-6 w-6 cursor-pointer text-black ring-black checked:border-2 checked:bg-none checked:ring checked:ring-inset checked:ring-offset-[3px] focus:ring-black"
        {...props}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      />
      <label htmlFor={name}>{label}</label>
    </div>
  )
}

type ProductDetailsProps = {
  imagePath: string
  name: string
  price: number
}

function ProductDetails({ imagePath, name, price }: ProductDetailsProps) {
  return (
    <div className="flex items-center justify-between text-center">
      <div className="flex items-center gap-6 truncate text-center">
        <img
          alt="product-image"
          src={imagePath}
          className="inline-block h-[2.8125rem] w-[3.125rem]"
        ></img>
        {name}
      </div>
      <div className="text-center">${price}</div>
    </div>
  )
}
