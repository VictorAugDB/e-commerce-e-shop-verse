import { Collection } from 'mongodb'

import { MongoDB } from '@/lib/db/mongodb'
import { errorHandler } from '@/lib/helpers/errorHandler'

export class MongoDBUsers extends MongoDB {
  private collectionObj: Promise<Collection<Document>>

  constructor() {
    super('e-shopverse', 'users')
    this.collectionObj = this.init()
  }

  async getUser(email: string) {
    try {
      const collection = await this.collectionObj
      const user = await collection.findOne({ email })
      return user
    } catch (err) {
      throw errorHandler(err)
    }
  }
}
