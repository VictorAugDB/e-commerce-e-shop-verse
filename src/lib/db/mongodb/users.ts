import { Collection } from 'mongodb'

import { MongoDB } from '@/lib/db/mongodb'

export class MongoDBUsers extends MongoDB {
  private collectionObj: Promise<Collection<Document>>

  constructor() {
    super('e-shopverse', 'users')
    this.collectionObj = this.init()
  }

  async userExists(email: string) {
    const collection = await this.collectionObj
    const user = await collection.findOne({ email })
    return !!user
  }
}
