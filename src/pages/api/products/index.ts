// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next'

import { getProductsData } from '@/lib/data'

import { Product } from '@/contexts/ProductsContext'

export default async function getProducts(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const query = req.query
  const ids = query.id
  let products: Product[] = await getProductsData()

  if (query.limit) {
    const skip = Number(query.skip) ?? 0
    products = products.slice(skip, skip + Number(query.limit))
  }

  const category = query.category

  if (category && typeof category === 'string') {
    products = products.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase(),
    )
  }

  const sort = query._sort
  const order = query._order ?? 'asc'

  if (sort && typeof sort === 'string' && sort in products[0]) {
    if (typeof products[0][sort as keyof Product] === 'number') {
      products = products.sort((a, b) =>
        order === 'asc'
          ? (a[sort as keyof Product] as number) -
            (b[sort as keyof Product] as number)
          : (b[sort as keyof Product] as number) -
            (a[sort as keyof Product] as number),
      )
    }
  }

  const discountGreaterThanOrEqual = Number(query.discount_gte)

  if (discountGreaterThanOrEqual >= 0) {
    products = products.filter((p) => p.discount >= discountGreaterThanOrEqual)
  }

  if (ids && ids.length > 0) {
    res.status(200).json(products.filter((p) => ids.includes(p.id)))
  } else {
    res.status(200).json(products)
  }
}
