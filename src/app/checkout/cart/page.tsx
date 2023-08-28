'use client'

import { motion } from 'framer-motion'
import { redirect } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ComponentProps, useContext, useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import { SWRResponse } from 'swr'

import { Address } from '@/lib/db/mongodb/addresses'
import {
  CustomAddress,
  linkUserAddressDataWithAddressData,
} from '@/lib/helpers/linkUserAddressDataWithAddressData'

import ApplyCoupon from '@/components/ApplyCoupon'
import Button from '@/components/buttons/Button'
import NextImage from '@/components/NextImage'
import PaymentSuccess from '@/components/PaymentSuccess'
import Steps from '@/components/Steps'

import { UserAddress } from '@/@types/next-auth'
import { Order } from '@/app/orders/page'
import { useLoading } from '@/contexts/LoadingProvider'
import { ProductsContext } from '@/contexts/ProductsContext'
import { LocalStorage } from '@/models/localStorage'

const fetcher = (args: string) =>
  fetch(args).then((res) => {
    if (res.status !== 200) {
      return undefined
    }
    return res.json()
  })

export default function Checkout() {
  const { data: session } = useSession()
  const [selectedAddress, setSelectedAddress] = useState<CustomAddress | null>(
    null,
  )
  const query =
    session &&
    session.user &&
    session.user.addresses.length > 0 &&
    session.user.addresses.map((a) => `ids[]=${a.id}`).join('&')
  const {
    data: addressesRes,
    error: _,
    isLoading: isAddressesLoading,
  }: SWRResponse<Address[]> = useSWR(`/api/addresses?${query}`, fetcher)
  const [addresses, setAddresses] = useState<CustomAddress[]>([])
  const { setLoading } = useLoading()

  useEffect(() => {
    setLoading(isAddressesLoading)

    if (!addressesRes && !isAddressesLoading) {
      alert('Please add an address before continue')
      setLoading(false)
      redirect('/profile')
    }

    if (addressesRes && !isAddressesLoading && session?.user.addresses) {
      const customAddresses = linkUserAddressDataWithAddressData(
        session.user.addresses as Array<UserAddress & { id: string }>,
        addressesRes as Address[],
        session?.user.defaultAddressId,
      )

      setAddresses(customAddresses)
      const defaultAddress = customAddresses.find((ca) => ca.isDefault)
      setSelectedAddress(defaultAddress ?? customAddresses[0])
    }
  }, [
    addressesRes,
    session?.user.addresses,
    session?.user.defaultAddressId,
    isAddressesLoading,
    setLoading,
  ])

  const [orderId, setorderId] = useState<string | null>(null)

  const inputsRef = {
    firstName: useRef<HTMLInputElement>(null),
    companyName: useRef<HTMLInputElement>(null),
    streetAddress: useRef<HTMLInputElement>(null),
    apartment: useRef<HTMLInputElement>(null),
    city: useRef<HTMLInputElement>(null),
    phoneNumber: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
  }

  const {
    subtotal,
    discounts,
    products,
    shipping,
    setCartQuantity,
    calculateShipping,
  } = useContext(ProductsContext)

  useEffect(() => {
    calculateShipping()
  }, [calculateShipping])

  async function handleFinishOrder() {
    // TODO payment provider calls

    if (!selectedAddress) {
      alert('You need to select an address to continue')
      return
    }

    // Order
    const order: Omit<Order, 'id'> = {
      address: {
        id: selectedAddress.id,
        number: selectedAddress.number,
        apartmentName: selectedAddress.apartmentName,
        complement: selectedAddress.complement,
      },
      createdAt: new Date().toISOString(),
      status: 'Order Placed',
      discounts,
      products: products.map((p) => p.id),
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

    // TODO If currenCoupon decrement the quantity
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
            category=""
            productName=""
          />
          <h1 className="text-center md:text-start">Billing Details</h1>
          <div className="mt-10 grid w-full grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex w-full flex-col gap-6 md:max-w-[28.1875rem]">
              {addresses.length &&
                addresses.map((a) => (
                  <div key={a.id} className="space-y-2">
                    <div
                      onClick={() => setSelectedAddress(a)}
                      data-selected={
                        selectedAddress && selectedAddress.id === a.id
                      }
                      className="cursor-pointer space-y-1 rounded border border-gray-400 bg-white p-4 ring-green-700 data-[selected=true]:ring-2"
                    >
                      <p>CEP: {a.zipCode}</p>
                      <p>
                        {a.city}, {a.street}, {a.number}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex flex-col items-center gap-8 md:items-start">
              <div className="flex max-w-[26.5625rem] flex-col gap-8">
                {products.map((p) => (
                  <ProductDetails
                    key={p.id}
                    imagePath={p.images[0]}
                    name={p.name}
                    price={p.price}
                  />
                ))}

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
              <ApplyCoupon />
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
