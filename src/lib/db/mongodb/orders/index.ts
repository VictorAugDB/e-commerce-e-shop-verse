import { Collection, Document, ObjectId } from 'mongodb'

import { MongoDB } from '@/lib/db/mongodb'
import { errorHandler } from '@/lib/helpers/errorHandler'

import { Order as OrderWithId } from '@/app/orders/page'

type OrderInput = Omit<OrderWithId, 'id'>

type OrderQueryInput = Omit<OrderInput, 'products'> & {
  products: Array<{
    id: ObjectId
    quantity: number
  }>
}

type OrderMongoRes = Omit<OrderWithId, 'id' | 'products'> & {
  _id: ObjectId
  products: Array<{
    id: ObjectId
    quantity: number
  }>
}

export class MongoDBUncanceledOrders extends MongoDB {
  private collectionObj: Promise<Collection<OrderQueryInput & Document>>

  constructor() {
    super('e-shopverse', 'orders')
    this.collectionObj = this.init<OrderQueryInput>()
  }

  async insertOrder(order: OrderInput): Promise<string> {
    const collection = await this.collectionObj
    const { products, ...restOrder } = order

    const res = await collection.insertOne({
      ...restOrder,
      products: products.map((p) => ({
        id: new ObjectId(p.id),
        quantity: p.quantity,
      })),
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

  async deleteOrder(id: string): Promise<void> {
    try {
      const collection = await this.collectionObj
      await collection.deleteOne({
        _id: new ObjectId(id),
      })
    } catch (err) {
      throw errorHandler(err)
    }
  }

  async updateOrderStatus(
    id: string,
    status: OrderMongoRes['status'],
  ): Promise<void> {
    try {
      const collection = await this.collectionObj
      await collection.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: { status: status },
        },
      )
    } catch (err) {
      throw errorHandler(err)
    }
  }
}

function formatOrder(order: OrderMongoRes): OrderWithId {
  const { _id, products, ...rest } = order

  return {
    id: _id.toString(),
    products: products.map((p) => ({
      id: p.id.toString(),
      quantity: p.quantity,
    })),
    ...rest,
  }
}
