import { Collection, Document, ObjectId } from 'mongodb'

import { MongoDB } from '@/lib/db/mongodb'
import { errorHandler } from '@/lib/helpers/errorHandler'

export class MongoDBUsers extends MongoDB {
  private collectionObj: Promise<Collection<Document>>

  constructor() {
    super('e-shopverse', 'users')
    this.collectionObj = this.init()
  }

  async linkOrder(userId: string, orderId: string) {
    const collection = await this.collectionObj
    await collection.updateOne(
      {
        _id: new ObjectId(userId),
      },
      { $push: { orders: new ObjectId(orderId) } },
    )
  }

  async getUser(email: string) {
    try {
      const collection = await this.collectionObj
      const user = (await collection.findOne({ email })) as any
      return {
        ...user,
        orders: user.orders.map((o: any) => o.toString()),
      }
    } catch (err) {
      throw errorHandler(err)
    }
  }
}
