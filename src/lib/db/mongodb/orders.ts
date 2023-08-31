import { Collection, Document, ObjectId } from 'mongodb'

import { MongoDB } from '@/lib/db/mongodb'
import { errorHandler } from '@/lib/helpers/errorHandler'

import { Order as OrderWithId } from '@/app/orders/page'

type Order = Omit<OrderWithId, 'id' | 'products'> & {
  products: ObjectId[]
}

type OrderMongoRes = Omit<Order, 'id'> & {
  _id: ObjectId
}

export class MongoDBOrders extends MongoDB {
  private collectionObj: Promise<Collection<Order & Document>>

  constructor() {
    super('e-shopverse', 'orders')
    this.collectionObj = this.init<Order>()
  }

  async insertOrder(order: Order): Promise<string> {
    const collection = await this.collectionObj
    const { products, ...restOrder } = order

    const res = await collection.insertOne({
      ...restOrder,
      products: products.map((p) => new ObjectId(p.id)),
    })
    return res.insertedId.toString()
  }

  async getOrdersByIds(ids: string[]): Promise<OrderWithId[]> {
    try {
      const collection = await this.collectionObj
      const res = collection.find<OrderMongoRes>({
        _id: { $in: ids.map((id) => new ObjectId(id)) },
      })

      const orders = await res.toArray()

      return orders.map((o) => formatOrder(o))
    } catch (err) {
      throw errorHandler(err)
    }
  }

  async getOrders(): Promise<OrderWithId[]> {
    try {
      const collection = await this.collectionObj
      const res = collection.find<OrderMongoRes>({})

      const orders = await res.toArray()

      return orders.map((o) => formatOrder(o))
    } catch (err) {
      throw errorHandler(err)
    }
  }

  async getOrderById(id: string): Promise<OrderWithId | null> {
    try {
      const collection = await this.collectionObj
      const order = await collection.findOne<OrderMongoRes>({
        _id: new ObjectId(id),
      })
      if (!order) return null

      return formatOrder(order)
    } catch (err) {
      throw errorHandler(err)
    }
  }
}

function formatOrder(order: OrderMongoRes): OrderWithId {
  const { _id, products, ...rest } = order

  return {
    id: _id.toString(),
    products: products.map((p) => p.toString()),
    ...rest,
  }
}
