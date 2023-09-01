'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import useSWR, { SWRResponse } from 'swr'

import { Address } from '@/lib/db/mongodb/addresses'

import Steps from '@/components/Steps'

import { Addresses } from '@/app/profile/Addresses'
import { useLoading } from '@/contexts/LoadingProvider'

export type CustomAddress = Address & {
  isDefault: boolean
}

const fetcher = (args: string) =>
  fetch(args).then((res) => {
    if (res.status !== 200) {
      return undefined
    }
    return res.json()
  })

export default function ProfilePage() {
  const { data: session } = useSession()
  const addressesIds = session && session.user && session.user.addresses
  const query = addressesIds?.map((id) => `ids[]=${id}`)?.join('&')
  const {
    data: serverAddresses,
    error: _,
    isLoading,
  }: SWRResponse<Address[]> = useSWR(`/api/addresses?${query}`, fetcher)
  const [addresses, setAddresses] = useState<CustomAddress[]>([])

  const { setLoading } = useLoading()

  useEffect(() => {
    if (serverAddresses && serverAddresses.length) {
      const defaultAddressId = session?.user.defaultAddressId

      const addrs: CustomAddress[] = serverAddresses.map((a) => ({
        ...a,
        isDefault: a.id === defaultAddressId,
      }))
      setAddresses(addrs)

      setLoading(false)
    } else {
      setLoading(true)
    }

    if (!serverAddresses && !isLoading) {
      setLoading(false)
    }
  }, [serverAddresses, session?.user.defaultAddressId, setLoading, isLoading])

  return (
    <div className="px-2 md:px-8 2xl:px-[8.4375rem]">
      <div className="flex items-center justify-between">
        <Steps flow="profile" currentStep={1} />
        <p className="hidden sm:block">
          Welcome! {session && session.user.name}
        </p>
      </div>
      <div className="space-y-6 rounded bg-white px-2 py-10 lg:px-20">
        <div className="space-y-6">
          <p className="font-medium">Edit Your Profile</p>
          <div className="space-y-4">
            <h4>Addresses</h4>
            <Addresses
              addressesWithDefault={addresses}
              setAddresses={setAddresses}
              userId={session ? session.user.id : ''}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
