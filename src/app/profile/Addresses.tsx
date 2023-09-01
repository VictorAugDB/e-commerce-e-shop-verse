import * as Collapsible from '@radix-ui/react-collapsible'
import { AnimatePresence, motion } from 'framer-motion'
import { Dispatch, SetStateAction, useState } from 'react'
import { ChevronDown, ChevronRight } from 'react-feather'

import { Address } from '@/lib/db/mongodb/addresses'

import Button from '@/components/buttons/Button'
import { zipCodeRegexp } from '@/components/RRFInput'

import { AddAddress } from '@/app/profile/manage-address/AddAddress'
import { EditAddress } from '@/app/profile/manage-address/EditAddress'
import { CustomAddress } from '@/app/profile/page'

type AddressesProps = {
  addressesWithDefault: CustomAddress[]
  userId: string
  setAddresses: Dispatch<SetStateAction<CustomAddress[]>>
}

export function Addresses({
  addressesWithDefault,
  setAddresses,
  userId,
}: AddressesProps) {
  const [showOtherAddresses, setShowOtherAddresses] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [openAddressId, setOpenAddressId] = useState<string | null>(null)
  const defaultAddress = addressesWithDefault.find((a) => a.isDefault)

  const addresses = defaultAddress
    ? addressesWithDefault.filter((a) => a.id !== defaultAddress.id)
    : addressesWithDefault

  function handleToggleOtherAddresses() {
    setShowOtherAddresses(!showOtherAddresses)
  }

  async function handleSetDefaultAddress(id: string) {
    await fetch('/api/users', {
      method: 'PATCH',
      body: JSON.stringify({
        userId,
        defaultAddressId: id,
      }),
    }).then((res) => res.json())

    setAddresses((state) =>
      state
        .map((a) => ({ ...a, isDefault: false }))
        .map((a) => (a.id === id ? { ...a, isDefault: true } : a)),
    )
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
            newDefault={addresses[0] && addresses[0].id}
            address={defaultAddress}
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
                          handleSetDefaultAddress(a.id)
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
                <Address
                  setAddresses={setAddresses}
                  key={a.id}
                  address={a}
                  idx={idx}
                  handleSetDefaultAddress={() => handleSetDefaultAddress(a.id)}
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
  address: CustomAddress
  idx: number
  handleSetDefaultAddress: (id: string) => void
  userId: string
  setAddresses: Dispatch<SetStateAction<CustomAddress[]>>
}

function Address({
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
        userId={userId}
        address={address}
      />
      <div className="flex flex-wrap items-center gap-2">
        <p>Set as default address?</p>
        <Button
          onClick={() => handleSetDefaultAddress(address.id)}
          variant="green"
        >
          Yes
        </Button>
      </div>
    </>
  )
}

type CollapsibleAddressProps = {
  address: CustomAddress
  idx: number
  handleSetDefaultAddress: (id: string) => void
  open: boolean
  setOpen: (id: string | null) => void
  userId: string
  setAddresses: Dispatch<SetStateAction<CustomAddress[]>>
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
        <Address
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
