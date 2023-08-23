import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import NextAuth, { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

import clientPromise from '@/lib/mongo'

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: 'e-shopverse',
  }),
}

const handler = NextAuth({
  ...authOptions,
})

export { handler as GET, handler as POST }
