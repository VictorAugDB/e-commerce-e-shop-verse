import { Collection, ObjectId } from 'mongodb'

import { MongoDB } from '@/lib/db/mongodb'
import { errorHandler } from '@/lib/helpers/errorHandler'

import { Order } from '@/app/orders/page'

export class MongoDBOrders extends MongoDB {
  private collectionObj: Promise<Collection<Document>>

  constructor() {
    super('e-shopverse', 'orders')
    this.collectionObj = this.init()
  }

  async getOrdersByIds(ids: string[]): Promise<Order[]> {
    try {
      const collection = await this.collectionObj
      const orders = collection.find<Order>({
        _id: { $in: ids.map((id) => new ObjectId(id)) },
      })
      return orders.toArray()
    } catch (err) {
      throw errorHandler(err)
    }
  }

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const collection = await this.collectionObj
      const order = await collection.findOne<Order>({
        _id: new ObjectId(id),
      })
      return order
    } catch (err) {
      throw errorHandler(err)
    }
  }
}
