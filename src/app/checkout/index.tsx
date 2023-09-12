'use client'

import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'

import { Address } from '@/lib/db/mongodb/addresses'
import { calculateShipping } from '@/lib/shipping'

import FinishOrderFeedback from '@/components/FinishOrderFeedback'
import Steps from '@/components/Steps'

import { CheckoutData } from '@/app/actions'
import { ListCartProducts } from '@/app/checkout/components/ListCartProducts'
import { ListUserAddresses } from '@/app/checkout/components/ListUserAddresses'
import { ShowProduct } from '@/app/checkout/components/ShowProduct'
import { Product, ProductsContext } from '@/contexts/ProductsContext'

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

  const { shipping, setShipping } = useContext(ProductsContext)

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

  useEffect(() => {
    if (!shipping) {
      setShipping(calculateShipping())
    }
  }, [shipping, setShipping])

  return (
    <>
      <Steps
        flow={product ? 'product-checkout' : 'buy'}
        currentStep={
          product && !checkoutData
            ? 3
            : product && checkoutData
            ? 4
            : !product && !checkoutData
            ? 1
            : 2
        }
        category={product?.category ?? ''}
        productName={product?.name ?? ''}
        className="px-global"
      />
      {checkoutData ? (
        <FinishOrderFeedback checkoutData={checkoutData} />
      ) : (
        <div className="px-global">
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
