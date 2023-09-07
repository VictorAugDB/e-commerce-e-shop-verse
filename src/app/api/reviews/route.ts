import { NextResponse } from 'next/server'

import { MongoDBReviews, Review } from '@/lib/db/mongodb/reviews'

export async function POST(req: Request) {
  const data = await req.json()
  const {
    comment,
    evaluation,
    recommended,
    title,
    userId,
    userName,
    productId,
  } = data

  const mongoDbReviewsClient = new MongoDBReviews()
  const id = await mongoDbReviewsClient.insertReview({
    comment,
    evaluation,
    recommended,
    title,
    userId,
    userName,
    productId,
  })

  return NextResponse.json(id)
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const { skip, limit, productId, userId } = {
    skip: searchParams.get('skip'),
    limit: searchParams.get('limit'),
    productId: searchParams.get('productId'),
    userId: searchParams.get('userId'),
  }

  if (!productId && !userId) {
    throw new Error('Missing userId or productId!')
  }

  const mongoDbReviewsClient = new MongoDBReviews()
  if (productId) {
    const reviews: Review[] = await mongoDbReviewsClient.getReviewsByProductId(
      productId,
      Number(skip),
      Number(limit),
    )
    return NextResponse.json(reviews)
  } else if (userId) {
    const reviews: Review[] = await mongoDbReviewsClient.getReviewsByUserId(
      userId,
      Number(skip),
      Number(limit),
    )
    return NextResponse.json(reviews)
  }

  return NextResponse.json(null)
}

export async function PATCH(req: Request) {
  const data = await req.json()

  const { comment, evaluation, recommended, title, id } = data

  const mongoDbReviewsClient = new MongoDBReviews()
  await mongoDbReviewsClient.updateReview({
    comment,
    evaluation,
    recommended,
    title,
    id,
  })

  return NextResponse.json(null)
}

export async function DELETE(req: Request) {
  const data = await req.json()
  const { id } = data

  const mongoDbReviewsClient = new MongoDBReviews()
  await mongoDbReviewsClient.deleteReview(id)

  return NextResponse.json(null)
}
