import { Collection, Document, ObjectId } from 'mongodb'

import { MongoDB } from '@/lib/db/mongodb'
import { errorHandler } from '@/lib/helpers/errorHandler'

import { UserAddress } from '@/@types/next-auth'

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

  async linkAddress(userId: string, address: UserAddress & { _id: ObjectId }) {
    const collection = await this.collectionObj
    await collection.updateOne(
      {
        _id: new ObjectId(userId),
      },
      { $push: { addresses: address } },
    )
  }

  async updateAddress(userId: string, address: UserAddress & { _id: string }) {
    const collection = await this.collectionObj
    await collection.updateOne(
      {
        _id: new ObjectId(userId),
        'addresses._id': new ObjectId(address._id),
      },
      { $set: { addresses: address } },
    )
  }

  async deleteAddress(userId: string, addressId: string) {
    const collection = await this.collectionObj
    console.log(userId, addressId)
    await collection.updateOne(
      {
        _id: new ObjectId(userId),
      },
      { $pull: { addresses: { _id: new ObjectId(addressId) } } },
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
