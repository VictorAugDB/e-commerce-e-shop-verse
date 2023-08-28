import { Address } from '@/lib/db/mongodb/addresses'

import { UserAddress } from '@/@types/next-auth'

export type CustomAddress = Address &
  UserAddress & {
    isDefault: boolean
  }

export function linkUserAddressDataWithAddressData(
  userAddresses: Array<UserAddress & { id: string }>,
  addresses: Address[],
  defaultAddressId?: string,
): CustomAddress[] {
  const userAddressesCustomInfo = userAddresses.reduce(
    (hash: { [key: string]: UserAddress }, address) => {
      const { id, ...rest } = address
      hash[id] = { ...rest }
      return hash
    },
    {},
  )

  return userAddressesCustomInfo
    ? addresses.map((a) => ({
        ...a,
        ...userAddressesCustomInfo[a.id],
        isDefault: defaultAddressId === a.id,
      }))
    : []
}
