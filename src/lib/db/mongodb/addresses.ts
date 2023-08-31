import { Collection, Document, ObjectId } from 'mongodb'

import { MongoDB } from '@/lib/db/mongodb'
import { errorHandler } from '@/lib/helpers/errorHandler'

export type Address = {
  id: string
  zipCode: string
  city: string
  street: string
  number: string
  apartmentName?: string
  complement?: string
}

type AddressWithoutId = Omit<Address, 'id'>

type AddressMongoRes = Omit<Address, 'id'> & {
  _id: ObjectId
}

export class MongoDbAddresses extends MongoDB {
  private collectionObj: Promise<Collection<AddressWithoutId & Document>>

  constructor() {
    super('e-shopverse', 'addresses')
    this.collectionObj = this.init<AddressWithoutId>()
  }

  async getAddressesByIds(ids: string[]): Promise<Address[]> {
    try {
      const collection = await this.collectionObj
      ids = Array.from(new Set(ids).keys())

      const res = collection.find<AddressMongoRes>({
        _id: { $in: ids.map((id) => new ObjectId(id)) },
      })

      const addresses = await res.toArray()

      return addresses.map((a) => {
        const { _id, ...rest } = a

        return {
          id: _id.toString(),
          ...rest,
        }
      })
    } catch (err) {
      throw errorHandler(err)
    }
  }

  async insertAddress(address: AddressWithoutId): Promise<ObjectId> {
    const collection = await this.collectionObj

    const res = await collection.insertOne(address)
    return res.insertedId
  }

  async updateAddress(address: Address) {
    const collection = await this.collectionObj
    const { id, ...rest } = address

    await collection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: rest,
      },
    )
  }
}
