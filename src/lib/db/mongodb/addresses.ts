import { Collection, Document, ObjectId } from 'mongodb'

import { MongoDB } from '@/lib/db/mongodb'
import { errorHandler } from '@/lib/helpers/errorHandler'

export type Address = {
  id: string
  zipCode: string
  city: string
  street: string
}

type AddressWithoutId = Omit<Address, 'id' | 'products'> & {
  products: ObjectId[]
}

type AddressMongoRes = Omit<Address, 'id'> & {
  _id: ObjectId
}

export class MongoDbAddresses extends MongoDB {
  private collectionObj: Promise<Collection<AddressWithoutId & Document>>

  constructor() {
    super('e-shopverse', 'addresses')
    this.collectionObj = this.init()
  }

  async getAddressesByIds(ids: string[]): Promise<Address[]> {
    try {
      const collection = await this.collectionObj

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
}
