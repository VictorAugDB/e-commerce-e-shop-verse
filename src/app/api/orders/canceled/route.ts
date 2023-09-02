// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { MongoDBCanceledOrders } from '@/lib/db/mongodb/orders/canceled'

import { authOptions } from '@/app/api/auth/authOptions'

export async function GET() {
  const session = await getServerSession(authOptions)

  const ordersIds = session && session.user && session.user.canceledOrdersIds
  if (!ordersIds) {
    return NextResponse.json([])
  }

  const mongoDbOrdersClient = new MongoDBCanceledOrders()
  const orders = await mongoDbOrdersClient.getOrdersByIds(ordersIds)

  return NextResponse.json(orders)
}
