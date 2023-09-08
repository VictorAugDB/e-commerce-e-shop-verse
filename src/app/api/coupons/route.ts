import { NextResponse } from 'next/server'

import { Coupon, MongoDBCoupons } from '@/lib/db/mongodb/coupons'

export async function GET() {
  const mongoDbReviewsClient = new MongoDBCoupons()

  const coupons: Coupon[] = await mongoDbReviewsClient.getCoupons()

  return NextResponse.json(coupons)
}

export async function PATCH(req: Request) {
  const body = await req.json()

  const mongoDbReviewsClient = new MongoDBCoupons()

  await mongoDbReviewsClient.updateCoupon({
    id: body.id,
    limit: body.limit,
    minVal: body.minVal,
    name: body.name,
    percentage: body.percentage,
    quantity: body.quantity,
  })

  return NextResponse.json(null)
}
