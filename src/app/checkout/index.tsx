'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Address } from '@/lib/db/mongodb/addresses'

import FinishOrderFeedback from '@/components/FinishOrderFeedback'
import Steps from '@/components/Steps'

import { CheckoutData } from '@/app/actions'
import { ListCartProducts } from '@/app/checkout/components/ListCartProducts'
import { ListUserAddresses } from '@/app/checkout/components/ListUserAddresses'
import { ShowProduct } from '@/app/checkout/components/ShowProduct'
import { Product } from '@/contexts/ProductsContext'

type ClientSideCheckoutProps = {
  addresses: Address[]
  defaultAddressId: string | undefined
  product: Product | undefined
  productQuantity: number | undefined
  productSize: string | undefined
}

export function ClientSideCheckout({
  addresses,
  defaultAddressId,
  product,
  productQuantity,
  productSize,
}: ClientSideCheckoutProps) {
  const router = useRouter()

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)

  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>()

  useEffect(() => {
    if (addresses.length === 0) {
      alert('Please add an address before continue')
      router.push('/profile')
    } else {
      setSelectedAddress(
        defaultAddressId
          ? addresses.find((a) => a.id === defaultAddressId) ?? addresses[0]
          : addresses[0],
      )
    }
  }, [addresses, defaultAddressId, router])

  return (
    <>
      {checkoutData ? (
        <FinishOrderFeedback checkoutData={checkoutData} />
      ) : (
        <div className="px-2 sm:px-8 2xl:px-[8.4375rem]">
          <Steps
            flow="product-checkout"
            currentStep={3}
            category=""
            productName=""
          />
          <div className="mt-10 grid w-full grid-cols-1 gap-4 md:grid-cols-2">
            <ListUserAddresses
              addresses={addresses}
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
            />
            <div className="flex flex-col items-center gap-8 md:items-start">
              {product ? (
                <ShowProduct
                  product={product}
                  selectedAddress={selectedAddress}
                  setCheckoutData={setCheckoutData}
                  quantity={productQuantity as number}
                  size={productSize}
                />
              ) : (
                <ListCartProducts
                  selectedAddress={selectedAddress}
                  setCheckoutData={setCheckoutData}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
