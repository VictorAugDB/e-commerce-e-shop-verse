import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import { AuthOptions, Session } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

import clientPromise from '@/lib/mongo'

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.ordersIds = user.orders
        ? user.orders.map((o) => o.toString())
        : []

      session.user.canceledOrdersIds = user.canceledOrders
        ? user.canceledOrders.map((co) => co.toString())
        : []

      session.user.addresses = user.addresses
        ? user.addresses.map((a) => a.toString())
        : []

      session.user.id = user.id.toString()

      session.user.defaultAddressId =
        user.defaultAddressId && user.defaultAddressId.toString()

      return session as Session
    },
  },
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: 'e-shopverse',
  }),
  pages: {
    signIn: '/signIn',
  },
}
