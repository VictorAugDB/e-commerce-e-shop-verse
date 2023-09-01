import { zodResolver } from '@hookform/resolvers/zod'
import { Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import Button from '@/components/buttons/Button'

import { AddressForm } from '@/app/profile/manage-address'
import { CustomAddress } from '@/app/profile/page'
import { useLoading } from '@/contexts/LoadingProvider'

type AddAddressProps = {
  setIsAdding: (isAdding: boolean) => void
  setAddresses: Dispatch<SetStateAction<CustomAddress[]>>
  userId: string
}

const addAddressFormSchema = z.object({
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

type AddAddressFormInputs = z.infer<typeof addAddressFormSchema>

export function AddAddress({
  setIsAdding,
  setAddresses,
  userId,
}: AddAddressProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    setValue,
    trigger,
  } = useForm<AddAddressFormInputs>({
    resolver: zodResolver(addAddressFormSchema),
  })

  const { setLoading } = useLoading()

  async function handleAddAddress(data: AddAddressFormInputs) {
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

  return (
    <div className="space-y-2">
      <AddressForm
        errors={errors}
        handleSubmit={handleAddAddress}
        handleSubmitWrapper={handleSubmit}
        register={register}
        setValue={setValue}
        isAdding={true}
        trigger={trigger}
      />
      <div className="flex flex-wrap items-center gap-4">
        <p className="font-medium">Add Address?</p>
        <div className="flex items-center gap-2">
          <Button
            disabled={isSubmitting}
            onClick={() => setIsAdding(false)}
            variant="light"
          >
            Cancel
          </Button>
          <Button
            disabled={isSubmitting}
            form="form"
            type="submit"
            variant="green"
          >
            Yes
          </Button>
        </div>
      </div>
    </div>
  )
}
