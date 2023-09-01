import { Dispatch, SetStateAction } from 'react'

import Button from '@/components/buttons/Button'

import { AddAddress as AddAddressComponent } from '@/app/profile/manage-address/AddAddress'
import { CustomAddress } from '@/app/profile/page'

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
        <AddAddressComponent
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
