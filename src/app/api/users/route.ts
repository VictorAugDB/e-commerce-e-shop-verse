import { NextResponse } from 'next/server'

import { MongoDBUsers } from '@/lib/db/mongodb/users'

export async function PATCH(req: Request) {
  const data = await req.json()

  if (data.defaultAddressId) {
    const { userId, defaultAddressId } = data

    const mongoDbUsersClient = new MongoDBUsers()
    await mongoDbUsersClient.setDefaultAddress(userId, defaultAddressId)
  }

  return NextResponse.json(null)
}
