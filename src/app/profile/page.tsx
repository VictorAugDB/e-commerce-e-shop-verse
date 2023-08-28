import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { MongoDbAddresses } from '@/lib/db/mongodb/addresses'
import { linkUserAddressDataWithAddressData } from '@/lib/helpers/linkUserAddressDataWithAddressData'

import Steps from '@/components/Steps'

import { UserAddress } from '@/@types/next-auth'
import { authOptions } from '@/app/api/auth/authOptions'
import { Addresses } from '@/app/profile/Addresses'

export default async function Profile() {
  const session = await getServerSession(authOptions)

  const mongoDbAddressesClient = new MongoDbAddresses()
  const dbAddresses =
    session && session.user && session.user.addresses.length > 0
      ? await mongoDbAddressesClient.getAddressesByIds(
          session.user.addresses.map((a) => a.id),
        )
      : []
  const defaultAddressId = session?.user.defaultAddressId
  const addresses =
    dbAddresses.length > 0
      ? linkUserAddressDataWithAddressData(
          session?.user.addresses as Array<UserAddress & { id: string }>,
          dbAddresses,
          defaultAddressId,
        )
      : []

  if (!session) {
    redirect('/')
  }

  return (
    <div className="px-2 md:px-8 2xl:px-[8.4375rem]">
      <div className="flex items-center justify-between">
        <Steps flow="profile" currentStep={1} />
        <p className="hidden sm:block">Welcome! {session.user.name}</p>
      </div>
      <div className="space-y-6 rounded bg-white px-2 py-10 lg:px-20">
        <div className="space-y-6">
          <p className="font-medium">Edit Your Profile</p>
          <div className="space-y-4">
            <h4>Addresses</h4>
            {addresses.length > 0 ? (
              <Addresses addresses={addresses} userId={session.user.id} />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
