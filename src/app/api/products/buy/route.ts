import { NextResponse } from 'next/server'

import { MongoDBProducts } from '@/lib/db/mongodb/products'

export async function PATCH(req: Request) {
  const body = await req.json()

  const mongoDbReviewsClient = new MongoDBProducts()

  await mongoDbReviewsClient.decreaseQuantityIncreaseSales(
    body.id,
    body.quantity,
  )

  return NextResponse.json(null)
}
