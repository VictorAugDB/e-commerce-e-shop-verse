import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { Address } from '@/lib/db/mongodb/addresses'

import { authOptions } from '@/app/api/auth/authOptions'
import ProfilePage from '@/app/profile/ProfilePage'

export type CustomAddress = Address & {
  isDefault: boolean
}

export default async function Profile() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/sign-in')
  }

  return <ProfilePage />
}
