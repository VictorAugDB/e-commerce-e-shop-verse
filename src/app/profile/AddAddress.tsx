import { Dispatch, SetStateAction } from 'react'

import { CustomAddress } from '@/lib/helpers/linkUserAddressDataWithAddressData'

import Button from '@/components/buttons/Button'

import { ManageAddress } from '@/app/profile/ManageAddress'

type AddAddressProps = {
  userId: string
  isAdding: boolean
  setIsAdding: (isAdding: boolean) => void
  setAddresses: Dispatch<SetStateAction<CustomAddress[]>>
}

export function AddAddress({
  userId,
  isAdding,
  setIsAdding,
  setAddresses,
}: AddAddressProps) {
  function toogleIsAdding() {
    setIsAdding(!isAdding)
  }

  return (
    <>
      {isAdding ? (
        <ManageAddress
          action="add"
          setIsAdding={setIsAdding}
          setAddresses={setAddresses}
          userId={userId}
        />
      ) : (
        <Button onClick={toogleIsAdding} variant="green">
          + Add address
        </Button>
      )}
    </>
  )
}