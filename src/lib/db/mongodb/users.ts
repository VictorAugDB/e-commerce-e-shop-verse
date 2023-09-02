import { Collection, Document, ObjectId } from 'mongodb'
import { AdapterUser } from 'next-auth/adapters'

import { MongoDB } from '@/lib/db/mongodb'
import { errorHandler } from '@/lib/helpers/errorHandler'

import { UserAddress } from '@/@types/next-auth'

type MongoUser = Omit<AdapterUser, 'id'> & {
  _id: ObjectId
}

type User = Omit<MongoUser, '_id' | 'orders' | 'addresses'> & {
  id: string
  orders: string[]
  addresses: Array<UserAddress & { id: string }>
}

export class MongoDBUsers extends MongoDB {
  private collectionObj: Promise<Collection<MongoUser & Document>>

  constructor() {
    super('e-shopverse', 'users')
    this.collectionObj = this.init<MongoUser>()
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

  async unlinkOrder(userId: string, orderId: string) {
    const collection = await this.collectionObj
    await collection.updateOne(
      {
        _id: new ObjectId(userId),
      },
      { $pull: { orders: new ObjectId(orderId) } },
    )
  }

  async linkCanceledOrder(userId: string, orderId: string) {
    const collection = await this.collectionObj
    await collection.updateOne(
      {
        _id: new ObjectId(userId),
      },
      { $push: { canceledOrders: new ObjectId(orderId) } },
    )
  }

  async linkAddress(userId: string, addressId: ObjectId) {
    const collection = await this.collectionObj
    const user = await collection.findOne<MongoUser>(new ObjectId(userId))
    if (!user) {
      throw new Error('User does not exist!')
    }

    await collection.updateOne(
      {
        _id: new ObjectId(userId),
      },
      { $push: { addresses: addressId } },
    )
  }

  async deleteAddress(userId: string, addressId: string) {
    const collection = await this.collectionObj
    await collection.updateOne(
      {
        _id: new ObjectId(userId),
      },
      { $pull: { addresses: new ObjectId(addressId) } },
    )
  }

  async setDefaultAddress(userId: string, id: string) {
    const collection = await this.collectionObj
    await collection.updateOne(
      {
        _id: new ObjectId(userId),
      },
      {
        $set: { defaultAddressId: id },
      },
    )
  }

  async getUser(email: string) {
    try {
      const collection = await this.collectionObj
      const user = await collection.findOne<MongoUser>({ email })
      if (!user) {
        return null
      }

      return formatUser(user)
    } catch (err) {
      throw errorHandler(err)
    }
  }
}

function formatUser(user: MongoUser): User {
  const { _id, addresses, orders, ...rest } = user

  return {
    id: _id.toString(),
    orders: orders ? orders.map((o) => o.toString()) : [],
    addresses: addresses
      ? addresses.map((a) => {
          const { _id: addressId, ...restAddress } = a
          return {
            id: addressId,
            ...restAddress,
          }
        })
      : [],
    ...rest,
  }
}
