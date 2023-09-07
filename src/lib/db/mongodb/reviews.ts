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
  helpfulEvaluationsUsersIds: string[]
  unhelpfulEvaluationsUsersIds: string[]
  createdAt: string
  userId: string
  productId: string
}

type InsertReview = Omit<Review, 'id' | 'userId' | 'productId'> & {
  productId: ObjectId
  userId: ObjectId
}

type ReviewInput = Omit<
  Review,
  | 'id'
  | 'createdAt'
  | 'helpfulEvaluationsUsersIds'
  | 'unhelpfulEvaluationsUsersIds'
> & {
  productId: string
}

export type ReviewMongoRes = Omit<Review, 'id'> & {
  _id: ObjectId
  productId: ObjectId
  helpfulEvaluationsUsersIds: ObjectId[]
  unhelpfulEvaluationsUsersIds: ObjectId[]
}

type UpdateReview = Omit<ReviewInput, 'userId' | 'userName'> & { id: string }

export class MongoDBReviews extends MongoDB {
  private collectionObj: Promise<Collection<InsertReview & Document>>

  constructor() {
    super('e-shopverse', 'reviews')
    this.collectionObj = this.init<InsertReview>()
  }

  async deleteReview(id: string) {
    const collection = await this.collectionObj
    await collection.deleteOne({
      _id: new ObjectId(id),
    })
  }

  async insertReview(data: ReviewInput) {
    const review: InsertReview = {
      ...data,
      createdAt: new Date().toISOString(),
      helpfulEvaluationsUsersIds: [],
      unhelpfulEvaluationsUsersIds: [],
      productId: new ObjectId(data.productId),
      userId: new ObjectId(data.userId),
    }

    const collection = await this.collectionObj

    const res = await collection.insertOne(review)

    return res.insertedId
  }

  async updateReview(data: Partial<UpdateReview>) {
    const collection = await this.collectionObj

    // Remove props with undefined
    const { id: _, ...updatePayload } = Object.entries(data).reduce(
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

  async toogleHelpfulUserId(
    id: string,
    userId: string,
  ): Promise<'removed' | 'added'> {
    const collection = await this.collectionObj

    const review = await collection.findOne(new ObjectId(id))

    if (
      review &&
      review.helpfulEvaluationsUsersIds.find((r) => r.toString() === userId)
    ) {
      await collection.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $pull: { helpfulEvaluationsUsersIds: new ObjectId(userId) },
        },
      )

      return 'removed'
    } else {
      await collection.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $push: { helpfulEvaluationsUsersIds: new ObjectId(userId) },
        },
      )

      // It's not allowed to have both helpful and unhelpful
      if (
        review &&
        review.unhelpfulEvaluationsUsersIds.find((r) => r.toString() === userId)
      ) {
        await collection.updateOne(
          {
            _id: new ObjectId(id),
          },
          {
            $pull: { unhelpfulEvaluationsUsersIds: new ObjectId(userId) },
          },
        )
      }

      return 'added'
    }
  }

  async toogleUnhelpfulUserId(
    id: string,
    userId: string,
  ): Promise<'removed' | 'added'> {
    const collection = await this.collectionObj

    const review = await collection.findOne(new ObjectId(id))

    if (
      review &&
      review.unhelpfulEvaluationsUsersIds.find((r) => r.toString() === userId)
    ) {
      await collection.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $pull: { unhelpfulEvaluationsUsersIds: new ObjectId(userId) },
        },
      )

      return 'removed'
    } else {
      await collection.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $push: { unhelpfulEvaluationsUsersIds: new ObjectId(userId) },
        },
      )

      // It's not allowed to have both helpful and unhelpful
      if (
        review &&
        review.helpfulEvaluationsUsersIds.find((r) => r.toString() === userId)
      ) {
        await collection.updateOne(
          {
            _id: new ObjectId(id),
          },
          {
            $pull: { helpfulEvaluationsUsersIds: new ObjectId(userId) },
          },
        )
      }

      return 'added'
    }
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

  async getReviewsByUserId(userId: string, skip = 0, limit = 10) {
    try {
      const collection = await this.collectionObj
      const res = collection
        .find<ReviewMongoRes>({
          userId: new ObjectId(userId),
        })
        .skip(skip)
        .limit(limit)

      const reviews = await res.toArray()

      return reviews.map((r) => formatReview(r))
    } catch (err) {
      throw errorHandler(err)
    }
  }

  async getReviewsByProductId(productId: string, skip = 0, limit = 10) {
    try {
      const collection = await this.collectionObj
      const res = collection
        .find<ReviewMongoRes>({
          productId: new ObjectId(productId),
        })
        .skip(skip)
        .limit(limit)

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
