import { Collection, Document, ObjectId } from 'mongodb'

import { MongoDB } from '@/lib/db/mongodb'
import { errorHandler } from '@/lib/helpers/errorHandler'

export type Review = {
  id: string
  title: string
  comment: string
  evaluation: number
  userName: string
  recommended: boolean
  helpfulQuantity: number
  unhelpfulQuantity: number
  createdAt: string
  userId: string
}

type ReviewInput = Omit<
  Review,
  'id' | 'createdAt' | 'helpfulQuantity' | 'unhelpfulQuantity'
>

type ReviewMongoRes = Omit<Review, 'id'> & {
  _id: ObjectId
}

type UpdateReview = Omit<ReviewInput, 'userId' | 'userName'> & { id: string }

export class MongoDBReviews extends MongoDB {
  private collectionObj: Promise<Collection<Omit<Review, 'id'> & Document>>

  constructor() {
    super('e-shopverse', 'reviews')
    this.collectionObj = this.init<Omit<Review, 'id'>>()
  }

  async deleteReview(id: string) {
    const collection = await this.collectionObj
    await collection.deleteOne({
      _id: new ObjectId(id),
    })
  }

  async insertReview(data: ReviewInput) {
    const review: Omit<Review, 'id'> = {
      ...data,
      createdAt: new Date().toISOString(),
      helpfulQuantity: 0,
      unhelpfulQuantity: 0,
    }

    const collection = await this.collectionObj

    const res = await collection.insertOne(review)

    return res.insertedId
  }

  async updateReview(data: Partial<UpdateReview>) {
    const collection = await this.collectionObj

    // Remove props with undefined
    const updatePayload = { ...data }
    Object.entries(updatePayload).reduce(
      (
        acc: Record<keyof UpdateReview, unknown>,
        [key, val]: [string, unknown],
      ) => {
        if (!val) {
          return acc
        }

        acc[key as keyof UpdateReview] = val
        return acc
      },
      {} as Record<keyof UpdateReview, unknown>,
    )

    await collection.updateOne(
      {
        _id: new ObjectId(data.id),
      },
      {
        $set: updatePayload,
      },
    )
  }

  async getReviews(skip = 0, limit = 10) {
    try {
      const collection = await this.collectionObj
      const res = collection.find<ReviewMongoRes>({}).skip(skip).limit(limit)

      const reviews = await res.toArray()

      return reviews.map((r) => formatReview(r))
    } catch (err) {
      throw errorHandler(err)
    }
  }
}

function formatReview(user: ReviewMongoRes): Review {
  const { _id, ...rest } = user

  return {
    id: _id.toString(),
    ...rest,
  }
}
