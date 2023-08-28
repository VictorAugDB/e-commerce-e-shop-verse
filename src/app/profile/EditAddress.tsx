'use client'

import { useRef } from 'react'

import { CustomAddress } from '@/lib/helpers/linkUserAddressDataWithAddressData'

import InputBorderBottom from '@/components/InputBorderBottom'

type EditAddressProps = CustomAddress

export function EditAddress({
  city,
  number,
  street,
  zipCode,
  apartmentName,
  complement,
}: EditAddressProps) {
  const inputsRef = {
    zipCode: useRef<HTMLInputElement>(null),
    streetAddress: useRef<HTMLInputElement>(null),
    apartmentName: useRef<HTMLInputElement>(null),
    number: useRef<HTMLInputElement>(null),
    complement: useRef<HTMLInputElement>(null),
    city: useRef<HTMLInputElement>(null),
  }

  return (
    <div className="grid gap-x-4 md:grid-cols-2 lg:grid-cols-3">
      <InputBorderBottom
        name="zip-code"
        id="zip-code"
        defaultValue={zipCode}
        ref={inputsRef.zipCode}
        placeholder="Zip Code"
      />
      <InputBorderBottom
        name="street-address"
        id="street-address"
        defaultValue={street}
        ref={inputsRef.streetAddress}
        placeholder="Street Address"
      />
      <InputBorderBottom
        name="apartmentName"
        id="apartmentName"
        defaultValue={apartmentName}
        ref={inputsRef.apartmentName}
        placeholder="ApartmentName, floor, etc. (optional)"
      />
      <InputBorderBottom
        name="house-number"
        id="house-number"
        defaultValue={number}
        ref={inputsRef.number}
        placeholder="House Number / ApartmentName Number"
      />
      <InputBorderBottom
        name="complement"
        id="complement"
        defaultValue={complement}
        ref={inputsRef.complement}
        placeholder="Complement"
      />
      <InputBorderBottom
        name="town/city"
        id="town/city"
        defaultValue={city}
        ref={inputsRef.city}
        placeholder="Town/City"
      />
    </div>
  )
}
