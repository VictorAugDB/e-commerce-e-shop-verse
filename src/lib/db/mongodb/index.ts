import { Collection, Document } from 'mongodb'

import clientPromise from '@/lib/mongo'

export class MongoDB {
  constructor(
    private readonly dbName: string,
    private readonly collection: string,
  ) {}

  async init<T extends Document>(): Promise<Collection<T>> {
    const client = await clientPromise
    return client.db(this.dbName).collection(this.collection)
  }
}
