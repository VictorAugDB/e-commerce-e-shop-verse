import { Address } from '@/lib/db/mongodb/addresses'

import ProfilePage from '@/app/profile/ProfilePage'

export type CustomAddress = Address & {
  isDefault: boolean
}

export default async function Profile() {
  return <ProfilePage />
}
