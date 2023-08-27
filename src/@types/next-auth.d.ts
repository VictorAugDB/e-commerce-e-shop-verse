import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      ordersIds: string[]
      addressesIds: string[]
    } & DefaultSession['user']
  }
}

declare module 'next-auth/adapters' {
  interface AdapterUser {
    orders: ObjectId[]
  }
}
