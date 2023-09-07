import { NextResponse } from 'next/server'

import { Coupon, MongoDBCoupons } from '@/lib/db/mongodb/coupons'

export async function GET() {
  const mongoDbReviewsClient = new MongoDBCoupons()

  const coupons: Coupon[] = await mongoDbReviewsClient.getCoupons()

  return NextResponse.json(coupons)
}
