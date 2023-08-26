// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { MongoDBOrders } from '@/lib/db/mongodb/orders'
import { MongoDBUsers } from '@/lib/db/mongodb/users'

import { authOptions } from '@/app/api/auth/authOptions'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!(session && session.user && session.user.email)) {
    throw new Error('Internal Server Error')
  }
  const mongoDbUsersClient = new MongoDBUsers()
  const user = await mongoDbUsersClient.getUser(session.user.email)

  if (!user) {
    throw new Error('Internal Server Error')
  }

  const data = await req.json()
  const mongoDbOrdersClient = new MongoDBOrders()
  const id = await mongoDbOrdersClient.insertOrder(data)
  await mongoDbUsersClient.linkOrder(user._id.toString(), id)

  return NextResponse.json({ id })
}
