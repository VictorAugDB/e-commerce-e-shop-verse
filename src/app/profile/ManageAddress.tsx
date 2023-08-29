import { zodResolver } from '@hookform/resolvers/zod'
import { Dispatch, SetStateAction, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { getAddressByZipCode } from '@/lib/helpers/getAddressByZipCode'
import { CustomAddress } from '@/lib/helpers/linkUserAddressDataWithAddressData'

import Button from '@/components/buttons/Button'
import InputBorderBottom from '@/components/InputBorderBottom'

import { useLoading } from '@/contexts/LoadingProvider'

type AddAddress = {
  action: 'add'
  setIsAdding: (isAdding: boolean) => void
  setAddresses: Dispatch<SetStateAction<CustomAddress[]>>
}

type EditAddress = {
  action: 'edit'
  setIsAdding?: never
  setAddresses?: never
}

type FieldName = keyof Omit<CustomAddress, 'isDefault' | 'id'>

type ManageAddressProps = Partial<CustomAddress> &
  (AddAddress | EditAddress) & {
    userId: string
  }

const manageAddressFormSchema = z.object({
  zipCode: z.string(),
  street: z.string(),
  apartmentName: z.string().optional(),
  number: z.string(),
  complement: z.string().optional(),
  city: z.string(),
})

type ManageAddressFormInputs = z.infer<typeof manageAddressFormSchema>

export function ManageAddress({
  action,
  setIsAdding,
  setAddresses,
  userId,
  ...address
}: ManageAddressProps) {
  const { city, number, street, zipCode, apartmentName, complement, id } =
    address
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    getValues,
  } = useForm<ManageAddressFormInputs>({
    resolver: zodResolver(manageAddressFormSchema),
  })
  const { setLoading } = useLoading()
  const cityRef = useRef<HTMLInputElement | null>(null)
  const streetRef = useRef<HTMLInputElement | null>(null)

  const { ref: cityRefCb, ...cityRegister } = register('city')
  const { ref: streetRefCb, ...streetRegister } = register('street')

  const [editedFields, setEditedFields] = useState(new Set<FieldName>())

  async function handleAddEditFields(fieldName: FieldName) {
    const currValues = getValues()
    const currVal = currValues[fieldName]
    const defaultVal = address[fieldName] ?? ''

    // Add - Remove
    if (!editedFields.has(fieldName) && currVal !== defaultVal) {
      setEditedFields(new Set(editedFields.add(fieldName)))
    } else if (editedFields.has(fieldName) && currVal === defaultVal) {
      const newEditFields = new Set(editedFields)
      newEditFields.delete(fieldName)
      setEditedFields(new Set(newEditFields))
    }

    if (fieldName === 'zipCode') {
      if (currVal) {
        const { street, city } = await getAddressByZipCode(currVal)
        const currStreetRef = streetRef.current
        const currCityRef = cityRef.current
        if (currStreetRef && currCityRef) {
          currCityRef.value = city
          currStreetRef.value = street
          currCityRef.focus()
          currStreetRef.focus()
        }
      }
    }
  }

  function handleCancelEdit() {
    reset()

    setEditedFields(new Set())
  }

  function handleEditAddress() {
    return
  }

  async function handleAddAddress(data: ManageAddressFormInputs) {
    if (action === 'add') {
      setLoading(true)
      const addressId = await fetch('/api/addresses', {
        method: 'POST',
        body: JSON.stringify({ ...data, userId }),
      }).then((res) => res.json())

      const newAddress: CustomAddress = {
        ...data,
        id: addressId,
        isDefault: false,
      }

      setAddresses((state) => [...state, newAddress])
      setIsAdding(false)
      reset()
      setLoading(false)
    }
  }

  return (
    <div className="space-y-1">
      <form
        id={`form-${id}`}
        onSubmit={handleSubmit(
          action === 'add' ? handleAddAddress : handleEditAddress,
        )}
        className="grid gap-x-4 md:grid-cols-2 lg:grid-cols-3"
      >
        <InputBorderBottom
          id={`zip-code-${id}`}
          defaultValue={zipCode}
          handleBlur={() => handleAddEditFields('zipCode')}
          placeholder="Zip Code"
          {...register('zipCode')}
        />
        <InputBorderBottom
          id={`street-address-${id}`}
          readOnly
          defaultValue={street}
          placeholder="Street Address"
          {...streetRegister}
          ref={(e) => {
            streetRefCb(e)
            streetRef.current = e
          }}
        />
        <InputBorderBottom
          id={`apartmentName-${id}`}
          defaultValue={apartmentName}
          handleBlur={() => handleAddEditFields('apartmentName')}
          placeholder="Apartment name, floor, etc. (optional)"
          {...register('apartmentName')}
        />
        <InputBorderBottom
          id={`house-number-${id}`}
          defaultValue={number}
          handleBlur={() => handleAddEditFields('number')}
          placeholder="House Number / Apartment Number"
          {...register('number')}
        />
        <InputBorderBottom
          id={`complement-${id}`}
          defaultValue={complement}
          handleBlur={() => handleAddEditFields('complement')}
          placeholder="Complement"
          {...register('complement')}
        />
        <InputBorderBottom
          id={`town/city-${id}`}
          readOnly
          defaultValue={city}
          placeholder="Town/City"
          {...cityRegister}
          ref={(e) => {
            cityRefCb(e)
            cityRef.current = e
          }}
        />
      </form>
      {(editedFields.size > 0 || action === 'add') && (
        <div className="flex flex-wrap items-center gap-4">
          <p className="font-medium">
            {action === 'edit' ? 'Confirm Changes?' : 'Add Address?'}
          </p>
          <div className="flex items-center gap-2">
            <Button
              disabled={isSubmitting}
              onClick={
                action === 'edit' ? handleCancelEdit : () => setIsAdding(false)
              }
              variant="light"
            >
              Cancel
            </Button>
            <Button
              disabled={isSubmitting}
              form={`form-${id}`}
              type="submit"
              variant="green"
            >
              Yes
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
