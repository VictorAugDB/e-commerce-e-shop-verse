// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextResponse } from 'next/server'

import { getProductsData } from '@/lib/data'

import { Product } from '@/contexts/ProductsContext'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const ids = searchParams.getAll('id[]')
  const queryskip = searchParams.get('skip')
  const limit = searchParams.get('limit')
  const queryCategory = searchParams.get('category')
  const _sort = searchParams.get('_sort')
  const _order = searchParams.get('_order')
  const discountGte = searchParams.get('discount_gte')

  let products: Product[] = await getProductsData()

  if (limit) {
    const skip = Number(queryskip) ?? 0
    products = products.slice(skip, skip + Number(limit))
  }

  const category = queryCategory

  if (category && typeof category === 'string') {
    products = products.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase(),
    )
  }

  const sort = _sort
  const order = _order ?? 'asc'

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

  const discountGreaterThanOrEqual = Number(discountGte)

  if (discountGreaterThanOrEqual >= 0) {
    products = products.filter((p) => p.discount >= discountGreaterThanOrEqual)
  }

  if (ids && ids.length > 0) {
    return NextResponse.json(products.filter((p) => ids.includes(p.id)))
  } else {
    return NextResponse.json(products)
  }
}
