import { ChangeEvent } from 'react'
import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
} from 'react-hook-form'
import * as z from 'zod'

import { getAddressByZipCode } from '@/lib/helpers/getAddressByZipCode'

import RRFInput from '@/components/RRFInput'

export const addressFormSchema = z.object({
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

export type AddressFormInputs = z.infer<typeof addressFormSchema>

type AddressFormProps = {
  register: UseFormRegister<AddressFormInputs>
  handleSubmitWrapper: UseFormHandleSubmit<AddressFormInputs>
  handleSubmit: (data: AddressFormInputs) => void
  setValue: UseFormSetValue<AddressFormInputs>
  trigger: UseFormTrigger<AddressFormInputs>
  errors: FieldErrors<AddressFormInputs>
  isEditting?: boolean
  isAdding?: boolean
  id?: string
}

export function AddressForm({
  register,
  handleSubmitWrapper,
  handleSubmit,
  setValue,
  trigger,
  errors,
  isEditting = false,
  isAdding = false,
  id,
}: AddressFormProps) {
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

  return (
    <form
      id={`form${id ?? ''}`}
      onSubmit={handleSubmitWrapper(handleSubmit)}
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      <div className="space-y-1">
        <RRFInput
          id={`zip-code${id ?? ''}`}
          mask="zipCode"
          handleChange={handleUpdateZipCode}
          readOnly={!isEditting && !isAdding}
          placeholder="Zip Code"
          {...register('zipCode')}
        />
        {errors.zipCode && (
          <span className="block text-red-700">{errors.zipCode.message}</span>
        )}
      </div>

      <div className="space-y-1">
        <RRFInput
          id={`street-address${id ?? ''}`}
          readOnly
          placeholder="Street Address"
          {...register('street')}
        />
        {errors.street && (
          <span className="block text-red-700">{errors.street.message}</span>
        )}
      </div>

      <div className="space-y-1">
        <RRFInput
          id={`apartmentName${id ?? ''}`}
          readOnly={!isEditting && !isAdding}
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
          readOnly={!isEditting && !isAdding}
          placeholder="House Number / Apartment Number"
          {...register('number')}
        />
        {errors.number && (
          <span className="block text-red-700">{errors.number.message}</span>
        )}
      </div>

      <div className="space-y-1">
        <RRFInput
          id={`complement${id ?? ''}`}
          readOnly={!isEditting && !isAdding}
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
          id={`town/city${id ?? ''}`}
          readOnly
          placeholder="Town/City"
          {...register('city')}
        />
        {errors.city && (
          <span className="block text-red-700">{errors.city.message}</span>
        )}
      </div>
    </form>
  )
}
