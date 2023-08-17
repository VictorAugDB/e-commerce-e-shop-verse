import { Coupon, Product } from '@/contexts/ProductsContext'

type GetProducts = {
  limit?: number
  category?: string
  discount?: number
  bestSelling?: boolean
  revalidate?: number
}

export const getProducts = async ({
  limit,
  category,
  discount,
  bestSelling,
  revalidate,
}: GetProducts = {}): Promise<Product[]> => {
  let query = ''

  if (limit) {
    query += `?_limit=${limit}`
  }

  if (category) {
    query += `${query ? '&' : '?'}category=${category}`
  }

  if (discount !== undefined) {
    query += `${query ? '&' : '?'}discount_gte=${discount}`
  }

  if (bestSelling) {
    query += `${query ? '&' : '?'}_sort=numberOfSales&_order=desc`
  }

  const res = await fetch('http://localhost:3000/api/products' + query, {
    next: {
      revalidate: revalidate ? 60 * 60 * revalidate : 0,
    }, // X hours
  })

  return await res.json()
}

export const getProductById = async (id: string): Promise<Product> => {
  const res = await fetch(`http://localhost:3000/api/products/${id}`, {
    next: { revalidate: 60 * 60 * 12 },
  }) // 12 hours

  return res.status === 204 ? null : res.json()
}

export const getProductsByIds = async (ids: string[]): Promise<Product[]> => {
  if (!ids.length) {
    return []
  }

  const queryParams = ids.map((id) => `id=${id}`).join('&')
  const res = await fetch(`http://localhost:3000/api/products?${queryParams}`)
  return res.json()
}

export const getCoupons = async (): Promise<Coupon[]> => {
  const res = await fetch('http://localhost:3000/api/coupons')
  return await res.json()
}
