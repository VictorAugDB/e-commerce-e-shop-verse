// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextResponse } from 'next/server'

import { MongoDBProducts } from '@/lib/db/mongodb/products'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const mongoDbProductsClient = new MongoDBProducts()

  const product = await mongoDbProductsClient.getProductById(params.id)

  if (product) {
    return NextResponse.json(product)
  } else {
    return NextResponse.json(null, {
      status: 404,
    })
  }
}
