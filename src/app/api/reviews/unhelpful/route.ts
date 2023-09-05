import { NextResponse } from 'next/server'

import { MongoDBReviews } from '@/lib/db/mongodb/reviews'

export async function PATCH(req: Request) {
  const data = await req.json()

  const { id, userId } = data

  const mongoDbReviewsClient = new MongoDBReviews()
  const res = await mongoDbReviewsClient.toogleUnhelpfulUserId(id, userId)

  return NextResponse.json({ operation: res })
}
