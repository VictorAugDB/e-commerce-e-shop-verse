import { Collection, Document, ObjectId } from 'mongodb'

import { MongoDB } from '@/lib/db/mongodb'
import { errorHandler } from '@/lib/helpers/errorHandler'

export type Coupon = {
  id: string
  name: string
  minVal: number
  percentage: number
  limit: number
  quantity: number
  createdAt: string
  expirationDate: string
}

type CouponInput = Omit<Coupon, 'id' | 'createdAt'>

export type CouponMongoRes = Omit<Coupon, 'id'> & {
  _id: ObjectId
}

type UpdateCoupon = Omit<CouponInput, 'expirationDate'> & {
  id: string
}

export class MongoDBCoupons extends MongoDB {
  private collectionObj: Promise<Collection<CouponInput & Document>>

  constructor() {
    super('e-shopverse', 'coupons')
    this.collectionObj = this.init<CouponInput>()
  }

  async updateCoupon(data: Partial<UpdateCoupon>) {
    const collection = await this.collectionObj

    // Remove props with undefined
    const { id: _, ...updatePayload } = Object.entries(data).reduce(
      (
        acc: Record<keyof UpdateCoupon, unknown>,
        [key, val]: [string, unknown],
      ) => {
        if (!val) {
          return acc
        }

        acc[key as keyof UpdateCoupon] = val
        return acc
      },
      {} as Record<keyof UpdateCoupon, unknown>,
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

  async getCoupons() {
    try {
      const collection = await this.collectionObj
      const res = collection.find<CouponMongoRes>({
        expirationDate: { $gte: new Date().toISOString() },
      })

      const coupons = await res.toArray()

      return coupons.map((r) => formatCoupon(r))
    } catch (err) {
      throw errorHandler(err)
    }
  }
}

function formatCoupon(user: CouponMongoRes): Coupon {
  const { _id, ...rest } = user

  return {
    id: _id.toString(),
    ...rest,
  }
}
