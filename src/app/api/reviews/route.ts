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

  const { skip, limit, productId } = {
    skip: searchParams.get('skip'),
    limit: searchParams.get('limit'),
    productId: searchParams.get('productId'),
  }

  if (!productId) {
    throw new Error('Missing product!')
  }

  const mongoDbReviewsClient = new MongoDBReviews()
  const reviews: Review[] = await mongoDbReviewsClient.getReviewsByProductId(
    productId,
    Number(skip),
    Number(limit),
  )

  return NextResponse.json(reviews)
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
