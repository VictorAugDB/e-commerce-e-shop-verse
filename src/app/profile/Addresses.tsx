'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

import { CustomAddress } from '@/lib/helpers/linkUserAddressDataWithAddressData'

import Button from '@/components/buttons/Button'

import { ManageAddress } from '@/app/profile/ManageAddress'

type AddressesProps = {
  addresses: CustomAddress[]
  userId: string
}

export function Addresses({
  addresses: serverAddresses,
  userId,
}: AddressesProps) {
  const [defaultAddress, setDefaultAddress] = useState(
    serverAddresses.length > 0
      ? serverAddresses.find((a) => a.isDefault)
      : null,
  )
  const [addresses, setAddresses] = useState(
    serverAddresses.filter((sa) => !sa.isDefault),
  )
  const [showOtherAddresses, setShowOtherAddresses] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

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

    setDefaultAddress(addresses.find((a) => a.id === id))
    setAddresses(serverAddresses.filter((a) => a.id !== id))
  }

  function toogleIsAdding() {
    setIsAdding(!isAdding)
  }

  return (
    <>
      {defaultAddress ? (
        <div className="space-y-4">
          <p className="font-medium">Default Address</p>
          <ManageAddress userId={userId} action="edit" {...defaultAddress} />
          <AnimatePresence>
            {showOtherAddresses && (
              <>
                {addresses.map((a, idx) => (
                  <motion.div
                    key={a.id}
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Address
                      address={a}
                      idx={idx}
                      handleSetDefaultAddress={handleSetDefaultAddress}
                      userId={userId}
                    />
                  </motion.div>
                ))}
                {isAdding ? (
                  <motion.div
                    key="address"
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ManageAddress
                      userId={userId}
                      action="add"
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
              </>
            )}
          </AnimatePresence>

          <p
            onClick={handleToggleOtherAddresses}
            className="w-fit cursor-pointer font-medium text-green-700 transition-all hover:font-bold"
          >
            {!showOtherAddresses
              ? 'Show other addresses'
              : 'Hide other addresses'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="font-bold">
            We identified that you don't have a default please set one
          </p>
          {addresses.map((a, idx) => (
            <Address
              key={a.id}
              address={a}
              idx={idx}
              handleSetDefaultAddress={handleSetDefaultAddress}
              userId={userId}
            />
          ))}
        </div>
      )}
    </>
  )
}

type ListAddressesProps = {
  address: CustomAddress
  idx: number
  handleSetDefaultAddress: (id: string) => void
  userId: string
}

function Address({
  address,
  idx,
  userId,
  handleSetDefaultAddress,
}: ListAddressesProps) {
  return (
    <>
      <p className="font-medium">Address {idx + 1}</p>
      <ManageAddress userId={userId} action="edit" {...address} />
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
