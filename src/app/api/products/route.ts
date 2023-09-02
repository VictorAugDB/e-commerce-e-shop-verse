// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextResponse } from 'next/server'

import { MongoDBProducts, QueryOptions } from '@/lib/db/mongodb/products'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const ids = searchParams.getAll('id[]')
  const skip = searchParams.get('skip')
  const limit = searchParams.get('limit')
  const category = searchParams.get('category')
  const _sort = searchParams.getAll('_sort[]')
  const discountGte = searchParams.get('discount_gte')

  const mongoDbProductsClient = new MongoDBProducts()

  const options: QueryOptions = {
    category: category ?? undefined,
    sort: _sort.map((s) => JSON.parse(s)),
    discount: discountGte && JSON.parse(discountGte),
    limit: limit ? Number(limit) : undefined,
    skip: skip ? Number(skip) : undefined,
  }

  if (ids && ids.length > 0) {
    const products = await mongoDbProductsClient.getProductsByIds(ids, options)
    return NextResponse.json(products)
  } else {
    const products = await mongoDbProductsClient.getProducts(options)
    return NextResponse.json(products)
  }
}
