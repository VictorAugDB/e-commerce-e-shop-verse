import { Coupon } from '@/lib/db/mongodb/coupons'

import { Product } from '@/contexts/ProductsContext'

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
    const disocuntCriteria: {
      order: 'gte' | 'lte'
      value: number
    } = {
      order: 'gte',
      value: discount,
    }

    query += `${query ? '&' : '?'}discount_gte=${JSON.stringify(
      disocuntCriteria,
    )}`
  }

  if (bestSelling) {
    const sortingCriteria: {
      fieldName: keyof Product
      order: 'asc' | 'desc'
    } = {
      fieldName: 'numberOfSales',
      order: 'desc',
    }

    query += `${query ? '&' : '?'}_sort[]=${JSON.stringify(sortingCriteria)}`
  }

  const res = await fetch('/api/products' + query, {
    next: {
      revalidate: revalidate ? 60 * 60 * revalidate : 0,
    }, // X hours
  })

  return await res.json()
}

export const getProductById = async (id: string): Promise<Product> => {
  const res = await fetch(`/api/products/${id}`, {
    next: { revalidate: 60 * 60 * 12 },
  }) // 12 hours

  return res.status === 204 ? null : res.json()
}

export const getProductsByIds = async (ids: string[]): Promise<Product[]> => {
  if (!ids.length) {
    return []
  }

  const queryParams = ids.map((id) => `id[]=${id}`).join('&')
  const res = await fetch(`/api/products?${queryParams}`)

  return res.json()
}

export const getCoupons = async (): Promise<Coupon[]> => {
  const res = await fetch('/api/coupons')
  return await res.json()
}
