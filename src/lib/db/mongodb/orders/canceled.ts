import { Collection, Document, ObjectId } from 'mongodb'

import { MongoDB } from '@/lib/db/mongodb'
import { errorHandler } from '@/lib/helpers/errorHandler'

import { CanceledOrder } from '@/app/orders/cancellations/Cancellations'

type Order = Omit<CanceledOrder, 'id' | 'products'> & {
  products: ObjectId[]
}

type OrderMongoRes = Omit<Order, 'id'> & {
  _id: ObjectId
}

export class MongoDBCanceledOrders extends MongoDB {
  private collectionObj: Promise<Collection<Order & Document>>

  constructor() {
    super('e-shopverse', 'canceled-orders')
    this.collectionObj = this.init<Order>()
  }

  async insertOrder(order: Order & { id: string }): Promise<string> {
    const collection = await this.collectionObj
    const { products, ...restOrder } = order

    const res = await collection.insertOne({
      ...restOrder,
      _id: new ObjectId(restOrder.id),
      products: products.map((p) => new ObjectId(p)),
    })
    return res.insertedId.toString()
  }

  async getOrdersByIds(ids: string[]): Promise<CanceledOrder[]> {
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

  async getOrders(): Promise<CanceledOrder[]> {
    try {
      const collection = await this.collectionObj
      const res = collection.find<OrderMongoRes>({})

      const orders = await res.toArray()

      return orders.map((o) => formatOrder(o))
    } catch (err) {
      throw errorHandler(err)
    }
  }

  async getOrderById(id: string): Promise<CanceledOrder | null> {
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

function formatOrder(order: OrderMongoRes): CanceledOrder {
  const { _id, products, ...rest } = order

  return {
    id: _id.toString(),
    products: products.map((p) => p.toString()),
    ...rest,
  }
}
