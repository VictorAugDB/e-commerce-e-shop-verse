import { zodResolver } from '@hookform/resolvers/zod'
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { Trash2 } from 'react-feather'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { getAddressByZipCode } from '@/lib/helpers/getAddressByZipCode'

import Button from '@/components/buttons/Button'
import RRFInput from '@/components/RRFInput'

import { CustomAddress } from '@/app/profile/page'
import { useLoading } from '@/contexts/LoadingProvider'

type AddAddress = {
  action: 'add'
  setIsAdding: (isAdding: boolean) => void
  setAddresses: Dispatch<SetStateAction<CustomAddress[]>>
  newDefault?: never
}

type EditAddress = {
  action: 'edit'
  setIsAdding?: never
  setAddresses: Dispatch<SetStateAction<CustomAddress[]>>
  newDefault?: string
}

type ManageAddressProps = Partial<CustomAddress> &
  (AddAddress | EditAddress) & {
    userId: string
  }

const manageAddressFormSchema = z.object({
  apartmentName: z.string().optional(),
  complement: z.string().optional(),
  number: z.string().nonempty('The Number is required'),
  street: z.string(),
  city: z.string(),
  zipCode: z
    .string()
    .nonempty('The Zip Code is required')
    .refine(
      (zipCode) => zipCode.length === 10,
      'Zip Code must have 9 characters',
    )
    .transform((zipCode) => zipCode.replace(/[\D]/g, '')),
})

type ManageAddressFormInputs = z.infer<typeof manageAddressFormSchema>

export function ManageAddress({
  action,
  setIsAdding,
  setAddresses,
  userId,
  newDefault,
  ...address
}: ManageAddressProps) {
  const { city, number, street, zipCode, apartmentName, complement, id } =
    address

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    setFocus,
    setValue,
    trigger,
  } = useForm<ManageAddressFormInputs>({
    resolver: zodResolver(manageAddressFormSchema),
    defaultValues: {
      apartmentName,
      city,
      complement,
      number,
      street,
      zipCode,
    },
  })

  const { setLoading } = useLoading()
  const [isEditting, setIsEditting] = useState(false)

  useEffect(() => {
    if (errors.zipCode) {
      setFocus('zipCode')
    }
  }, [errors, setFocus])

  function handleCancelEdit() {
    reset()

    setIsEditting(false)
  }

  async function handleEditAddress(data: ManageAddressFormInputs) {
    if (action === 'edit') {
      setLoading(true)
      const addressId: string | null = await fetch('/api/addresses', {
        method: 'PUT',
        body: JSON.stringify({
          ...data,
          id: address.id,
        }),
      }).then((res) =>
        res.json().catch((err) => {
          throw new Error(err)
        }),
      )

      const prevAddressId = address.id as string

      const newAddress: CustomAddress = {
        ...data,
        id: addressId ? addressId : prevAddressId,
        isDefault: address.isDefault ?? false,
      }

      setAddresses((addresses) =>
        addresses.map((a) => (a.id !== address.id ? a : newAddress)),
      )
      setIsEditting(false)
      setLoading(false)
    }
  }

  async function handleDeleteAddress() {
    setLoading(true)
    await fetch('/api/addresses', {
      method: 'DELETE',
      body: JSON.stringify({
        userId,
        addressId: address.id,
        newDefault: address.isDefault ? newDefault : undefined,
      }),
    }).then((res) => res.json())

    setAddresses((addresses) => addresses.filter((a) => a.id !== address.id))

    setLoading(false)
  }

  async function handleUpdateZipCode(e: ChangeEvent<HTMLInputElement>) {
    const zipCodeVal = e.target.value.replace(/[\D]/g, '')
    if (zipCodeVal.length !== 9) {
      setValue('street', '')
      setValue('city', '')
    } else {
      const { city, street } = await getAddressByZipCode(e.target.value)
      setValue('street', street)
      setValue('city', city)
    }
    trigger('zipCode')
  }

  async function handleAddAddress(data: ManageAddressFormInputs) {
    if (action === 'add') {
      try {
        setLoading(true)
        const addressId = await fetch('/api/addresses', {
          method: 'POST',
          body: JSON.stringify({ ...data, userId }),
        }).then(async (res) => {
          if (res.status === 400) {
            const err = await res.json()
            throw new Error(err.message)
          }

          return res.json()
        })

        const newAddress: CustomAddress = {
          ...data,
          id: addressId,
          isDefault: false,
        }

        setAddresses((state) => [...state, newAddress])
        setIsAdding(false)
      } catch (err) {
        if (err instanceof Error) alert(err.message)
      }

      reset()
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <form
        id={`form-${id}`}
        onSubmit={handleSubmit(
          action === 'add' ? handleAddAddress : handleEditAddress,
        )}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        <div className="space-y-1">
          <RRFInput
            id={`zip-code-${id}`}
            mask="zipCode"
            defaultValue={zipCode}
            handleChange={handleUpdateZipCode}
            readOnly={!isEditting && action !== 'add'}
            placeholder="Zip Code"
            {...register('zipCode')}
          />
          {errors.zipCode && (
            <span className="block text-red-700">{errors.zipCode.message}</span>
          )}
        </div>

        <div className="space-y-1">
          <RRFInput
            id={`street-address-${id}`}
            readOnly
            defaultValue={street}
            placeholder="Street Address"
            {...register('street')}
          />
          {errors.street && (
            <span className="block text-red-700">{errors.street.message}</span>
          )}
        </div>

        <div className="space-y-1">
          <RRFInput
            id={`apartmentName-${id}`}
            readOnly={!isEditting && action !== 'add'}
            defaultValue={apartmentName}
            placeholder="Apartment name, floor, etc. (optional)"
            {...register('apartmentName')}
          />
          {errors.apartmentName && (
            <span className="block text-red-700">
              {errors.apartmentName.message}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <RRFInput
            readOnly={!isEditting && action !== 'add'}
            defaultValue={number}
            placeholder="House Number / Apartment Number"
            {...register('number')}
          />
          {errors.number && (
            <span className="block text-red-700">{errors.number.message}</span>
          )}
        </div>

        <div className="space-y-1">
          <RRFInput
            id={`complement-${id}`}
            readOnly={!isEditting && action !== 'add'}
            defaultValue={complement}
            placeholder="Complement"
            {...register('complement')}
          />
          {errors.complement && (
            <span className="block text-red-700">
              {errors.complement.message}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <RRFInput
            id={`town/city-${id}`}
            readOnly
            defaultValue={city}
            placeholder="Town/City"
            {...register('city')}
          />
          {errors.city && (
            <span className="block text-red-700">{errors.city.message}</span>
          )}
        </div>
      </form>
      {isEditting || action === 'add' ? (
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
      ) : (
        <div className="flex items-center justify-between">
          <Button onClick={() => setIsEditting(true)} variant="green">
            Edit
          </Button>
          <div
            onClick={handleDeleteAddress}
            className="cursor-pointer rounded bg-white p-2 text-red-700 transition-all hover:bg-gray-100"
          >
            <Trash2 />
          </div>
        </div>
      )}
    </div>
  )
}
