import { Collection, Document, Filter, ObjectId } from 'mongodb'

import { MongoDB } from '@/lib/db/mongodb/index'
import { errorHandler } from '@/lib/helpers/errorHandler'

import { Product } from '@/contexts/ProductsContext'

type ProductRes = Omit<Product, 'id'> & {
  _id: ObjectId
}

export type QueryOptions = {
  skip?: number
  limit?: number
  category?: string
  sort?: Array<{
    fieldName: keyof Product
    order: 'asc' | 'desc'
  }>
  discount?: {
    order: 'gte' | 'lte'
    value: number
  }
}

const ORDER = {
  asc: 1,
  desc: -1,
}

type UpdateProduct = Omit<Product, 'createdAt' | 'numberOfSales'>
export class MongoDBProducts extends MongoDB {
  private collectionObj: Promise<Collection<Product & Document>>

  constructor() {
    super('e-shopverse', 'products')
    this.collectionObj = this.init<Product>()
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const collection = await this.collectionObj

      const product = await collection.findOne<ProductRes>(new ObjectId(id))
      if (!product) {
        return null
      }

      return formatProduct(product)
    } catch (err) {
      throw errorHandler(err)
    }
  }

  async getProducts(options: QueryOptions = {}): Promise<Product[]> {
    try {
      const res = await this.createFindQuery({}, options)

      const products = await res.toArray()

      return products.map((p) => formatProduct(p))
    } catch (err) {
      throw errorHandler(err)
    }
  }

  async getProductsByIds(
    ids: string[],
    options: QueryOptions = {},
  ): Promise<Product[]> {
    try {
      const res = await this.createFindQuery(
        {
          _id: { $in: ids.map((id) => new ObjectId(id)) },
        },
        options,
      )
      const products = await res.toArray()

      return products.map((p) => formatProduct(p))
    } catch (err) {
      throw errorHandler(err)
    }
  }

  async decreaseQuantityIncreaseSales(id: string, quantity: number) {
    const collection = await this.collectionObj

    await collection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $inc: {
          quantity: -quantity,
          numberOfSales: quantity,
        },
      },
    )
  }

  async updateProduct(data: Partial<UpdateProduct>) {
    const collection = await this.collectionObj

    // Remove props with undefined
    const { id: _, ...updatePayload } = Object.entries(data).reduce(
      (
        acc: Record<keyof UpdateProduct, unknown>,
        [key, val]: [string, unknown],
      ) => {
        if (!val) {
          return acc
        }

        acc[key as keyof UpdateProduct] = val
        return acc
      },
      {} as Record<keyof UpdateProduct, unknown>,
    )

    await collection.updateOne(
      {
        _id: new ObjectId(data.id),
      },
      {
        $set: updatePayload,
      },
    )
  }

  private async createFindQuery(
    customQuery: Filter<Product & Document>,
    options: QueryOptions,
  ) {
    const collection = await this.collectionObj

    const query: Filter<Product & Document> = {
      ...customQuery,
    }

    if (options.category) {
      query.category = options.category
    }

    if (options.discount) {
      query.discount = {
        [`$${[options.discount.order]}`]: options.discount.value,
      }
    }

    const sortQuery =
      options.sort && options.sort.length > 0
        ? options.sort.reduce(
            (acc: Record<keyof Product, number>, curr) => {
              acc[curr.fieldName] = ORDER[curr.order]

              return acc
            },
            {} as Record<keyof Product, number>,
          )
        : {}

    return collection
      .find<ProductRes>(query)
      .skip(options.skip ?? 0)
      .limit(options.limit ?? 1000)
      .sort(sortQuery)
  }
}

function formatProduct(product: ProductRes): Product {
  const { _id, ...rest } = product

  return {
    id: _id.toString(),
    ...rest,
  }
}
