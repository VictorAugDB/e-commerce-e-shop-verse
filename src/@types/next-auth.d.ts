import { DefaultSession } from 'next-auth'

export type UserAddress = {
  number: string
  apartmentName?: string
  complement?: string
}

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id: string
      ordersIds: string[]
      canceledOrdersIds: string[]
      addresses: string[]
      defaultAddressId?: string
    } & DefaultSession['user']
  }
}

declare module 'next-auth/adapters' {
  interface AdapterUser {
    orders?: ObjectId[]
    canceledOrders?: ObjectId[]
    addresses?: ObjectId[]
    defaultAddressId: ObjectId
  }
}
