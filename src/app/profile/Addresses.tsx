import * as Collapsible from '@radix-ui/react-collapsible'
import { AnimatePresence, motion } from 'framer-motion'
import { Dispatch, SetStateAction, useState } from 'react'
import { ChevronDown, ChevronRight } from 'react-feather'

import { Address } from '@/lib/db/mongodb/addresses'

import Button from '@/components/buttons/Button'
import { zipCodeRegexp } from '@/components/RRFInput'

import { AddAddress } from '@/app/profile/manage-address/AddAddress'
import { EditAddress } from '@/app/profile/manage-address/EditAddress'

type AddressesProps = {
  addresses: Address[]
  userId: string
  setAddresses: Dispatch<SetStateAction<Address[]>>
  defaultAddress: Address | undefined
  setDefaultAddress: (address: Address | undefined) => void
}

export function Addresses({
  addresses,
  setAddresses,
  userId,
  defaultAddress,
  setDefaultAddress,
}: AddressesProps) {
  const [showOtherAddresses, setShowOtherAddresses] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [openAddressId, setOpenAddressId] = useState<string | null>(null)

  function handleToggleOtherAddresses() {
    setShowOtherAddresses(!showOtherAddresses)
  }

  async function handleSetDefaultAddress(
    address: Address,
    isCurrentDefault = false,
  ) {
    await fetch('/api/users', {
      method: 'PATCH',
      body: JSON.stringify({
        userId,
        defaultAddressId: address.id,
      }),
    }).then((res) => res.json())

    setDefaultAddress(address)

    if (defaultAddress) {
      if (!isCurrentDefault) {
        setAddresses(
          addresses.map((a) => (a.id === address.id ? defaultAddress : a)),
        )
      } else {
        setAddresses(addresses.filter((a) => a.id !== address.id))
      }
    } else {
      setAddresses(addresses.filter((a) => a.id !== address.id))
    }
  }

  function toogleIsAdding() {
    setIsAdding(!isAdding)
  }

  return (
    <>
      {defaultAddress ? (
        <div className="space-y-4">
          <p className="font-medium">Default Address</p>
          <EditAddress
            key={defaultAddress.id}
            setAddresses={setAddresses}
            userId={userId}
            newDefault={addresses[0]}
            handleSetDefaultAddress={handleSetDefaultAddress}
            address={defaultAddress}
            isDefault={true}
          />
          {addresses.length > 0 && (
            <p
              onClick={handleToggleOtherAddresses}
              className="w-fit cursor-pointer font-medium text-green-700 transition-all hover:font-bold"
            >
              {!showOtherAddresses
                ? 'Show other addresses'
                : 'Hide other addresses'}
            </p>
          )}

          <AnimatePresence>
            {showOtherAddresses && (
              <motion.div
                key="addresses"
                className="space-y-4"
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <AnimatePresence>
                  {addresses.map((a, idx) => (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0 }}
                      exit={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CollapsibleAddress
                        setAddresses={setAddresses}
                        open={openAddressId === a.id}
                        setOpen={() =>
                          openAddressId === a.id
                            ? setOpenAddressId(null)
                            : setOpenAddressId(a.id)
                        }
                        address={a}
                        idx={idx}
                        handleSetDefaultAddress={() =>
                          handleSetDefaultAddress(a)
                        }
                        userId={userId}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
            {isAdding ? (
              <motion.div
                key="address"
                className="space-y-4 rounded border border-gray-400 p-2"
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <AddAddress
                  userId={userId}
                  setIsAdding={setIsAdding}
                  setAddresses={setAddresses}
                />
              </motion.div>
            ) : (
              <motion.div
                key="button"
                className="space-y-4"
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Button onClick={toogleIsAdding} variant="green">
                  + Add address
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.length > 0 ? (
            <>
              <p className="font-bold">
                We've identified that you don't have a default address please
                set one
              </p>
              {addresses.map((a, idx) => (
                <AddressComponent
                  setAddresses={setAddresses}
                  key={a.id}
                  address={a}
                  idx={idx}
                  handleSetDefaultAddress={() => handleSetDefaultAddress(a)}
                  userId={userId}
                />
              ))}
            </>
          ) : (
            <>
              <p className="font-bold">Please add your first address.</p>
              <AddAddress
                userId={userId}
                setIsAdding={setIsAdding}
                setAddresses={setAddresses}
              />
            </>
          )}
        </div>
      )}
    </>
  )
}

type AddressProps = {
  address: Address
  idx: number
  handleSetDefaultAddress: (
    address: Address,
    isCurrentDefault?: boolean,
  ) => void
  userId: string
  setAddresses: Dispatch<SetStateAction<Address[]>>
}

function AddressComponent({
  address,
  idx,
  userId,
  handleSetDefaultAddress,
  setAddresses,
}: AddressProps) {
  return (
    <>
      <p className="font-medium">Address {idx + 1}</p>
      <EditAddress
        setAddresses={setAddresses}
        handleSetDefaultAddress={handleSetDefaultAddress}
        userId={userId}
        address={address}
        isDefault={false}
      />
      <div className="flex flex-wrap items-center gap-2">
        <p>Set as default address?</p>
        <Button
          onClick={() => handleSetDefaultAddress(address)}
          variant="green"
        >
          Yes
        </Button>
      </div>
    </>
  )
}

type CollapsibleAddressProps = {
  address: Address
  idx: number
  handleSetDefaultAddress: (address: Address) => void
  open: boolean
  setOpen: (id: string | null) => void
  userId: string
  setAddresses: Dispatch<SetStateAction<Address[]>>
}

function CollapsibleAddress({
  address,
  idx,
  userId,
  handleSetDefaultAddress,
  open,
  setOpen,
  setAddresses,
}: CollapsibleAddressProps) {
  return (
    <Collapsible.Root
      open={open}
      onOpenChange={() => setOpen(address.id)}
      className="flex flex-col gap-2 rounded border border-gray-400 p-2"
    >
      <Collapsible.Trigger>
        <div className="flex items-center">
          <p>{!open ? <ChevronRight /> : <ChevronDown />}</p>
          <p>
            {zipCodeRegexp(address.zipCode)}, {address.city}, {address.street},{' '}
            {address.number}
          </p>
        </div>
      </Collapsible.Trigger>
      <Collapsible.Content className="space-y-2 overflow-hidden data-[state='closed']:animate-collapsibleSlideUp data-[state='open']:animate-collapsibleSlideDown">
        <AddressComponent
          setAddresses={setAddresses}
          address={address}
          userId={userId}
          idx={idx}
          handleSetDefaultAddress={handleSetDefaultAddress}
        />
      </Collapsible.Content>
    </Collapsible.Root>
  )
}
