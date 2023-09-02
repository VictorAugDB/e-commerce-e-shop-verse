// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { MongoDBUncanceledOrders } from '@/lib/db/mongodb/orders'
import { MongoDBCanceledOrders } from '@/lib/db/mongodb/orders/canceled'
import { MongoDBUsers } from '@/lib/db/mongodb/users'

import { authOptions } from '@/app/api/auth/authOptions'
import { Order } from '@/app/orders/page'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const userId = session && session.user && session.user.id

  if (!userId) {
    throw new Error('Internal Server Error')
  }

  const data = await req.json()
  const mongoDbOrdersClient = new MongoDBUncanceledOrders()
  const id = await mongoDbOrdersClient.insertOrder(data)
  const mongoDbUsersClient = new MongoDBUsers()
  await mongoDbUsersClient.linkOrder(userId, id)

  // TODO remove this and add asynchrous job that update the status of the order
  // or add an Observable that listen to events and update the status
  await mongoDbOrdersClient.updateOrderStatus(id, 'Order Processed')

  return NextResponse.json({ id })
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  const userId = session && session.user && session.user.id

  if (!userId) {
    throw new Error('Internal Server Error')
  }

  const { id, discounts, productsIds, shipping, subtotal }: Order =
    await req.json()

  const mongoDbOrdersClient = new MongoDBUncanceledOrders()
  await mongoDbOrdersClient.deleteOrder(id)

  const mongoDbUsersClient = new MongoDBUsers()
  await mongoDbUsersClient.unlinkOrder(userId, id)

  const mongoDBCanceledOrdersClient = new MongoDBCanceledOrders()
  const canceledOrderId = await mongoDBCanceledOrdersClient.insertOrder({
    id,
    createdAt: new Date().toISOString(),
    discounts,
    products: productsIds.map((p) => new ObjectId(p)),
    repayStatus: 'uncompleted',
    shipping,
    subtotal,
  })
  await mongoDbUsersClient.linkCanceledOrder(userId, canceledOrderId)

  return NextResponse.json({ id })
}
