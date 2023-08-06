import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { ComponentProps, useContext, useEffect } from 'react'

import ApplyCoupon from '@/components/ApplyCoupon'
import Button from '@/components/buttons/Button'
import InputBorderBottom from '@/components/InputBorderBottom'
import NextImage from '@/components/NextImage'
import Steps from '@/components/Steps'

import { ProductsContext } from '@/contexts/ProductsContext'

export default function Checkout() {
  const searchParams = useSearchParams()

  const from = searchParams.get('from')
  const { subtotal, discounts, products, shipping, calculateShipping } =
    useContext(ProductsContext)

  useEffect(() => {
    ;(async () => {
      if (shipping === 0) {
        await calculateShipping()
      }
    })()
  }, [shipping, calculateShipping])

  return (
    <div className="px-[8.4375rem]">
      {from === 'cart' ? (
        <Steps flow="buy" currentStep={0} />
      ) : (
        <Steps flow="buy" currentStep={0} />
      )}
      <h1>Billing Details</h1>
      <div className="mt-10 grid grid-cols-2 gap-4">
        <div className="flex max-w-[28.1875rem] flex-col gap-6">
          <InputBorderBottom
            name="first-name"
            id="first-name"
            placeholder="First Name"
          />
          <InputBorderBottom
            name="company-name"
            id="company-name"
            placeholder="Company Name. (optional)"
          />
          <InputBorderBottom
            name="stree-address"
            id="stree-address"
            placeholder="Street Address"
          />
          <InputBorderBottom
            name="apartment"
            id="apartment"
            placeholder="Apartment, floor, etc. (optional)"
          />
          <InputBorderBottom
            name="town/city"
            id="town/city"
            placeholder="Town/City"
          />
          <InputBorderBottom
            name="phone-number"
            id="phone-number"
            placeholder="Phone Number"
          />
          <InputBorderBottom name="e-mail" id="e-mail" placeholder="E-mail" />
        </div>
        <div className="flex flex-col gap-8">
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
                <p>${subtotal - discounts + shipping}</p>
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
          <Button variant="green" className="w-fit px-12 py-4">
            Place Order
          </Button>
        </div>
      </div>
    </div>
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
      <div className="flex items-center gap-6 text-center">
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
