import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/app/api/auth/authOptions'
import ProfilePage from '@/app/profile/ProfilePage'

export default async function Profile() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/sign-in')
  }

  return <ProfilePage />
}
