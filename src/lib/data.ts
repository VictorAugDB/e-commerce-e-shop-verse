import data from 'db.json'

import { Coupon, Product } from '@/contexts/ProductsContext'

type GetProductsData = {
  limit?: number
  skip?: number
  category?: string
}

export function getProductsData({
  limit,
  category,
  skip = 0,
}: GetProductsData = {}): Promise<Product[]> {
  // it will fetch data from a database in the future, that's necessary to getStaticPaths and getStaticProps fetch data
  let products: Product[] = data.products

  if (limit) {
    products = products.slice(skip, skip + Number(limit))
  }

  if (category) {
    products = products.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase(),
    )
  }
  return new Promise((resolve) => resolve(products))
}

export function getProductDataByid(id: string): Promise<Product | undefined> {
  return new Promise((resolve) =>
    resolve(data.products.find((p) => p.id === id)),
  )
}

export function getProductsDataByIds(ids: string[]): Promise<Product[]> {
  return new Promise((resolve) =>
    resolve(data.products.filter((p) => ids.includes(p.id))),
  )
}

export function getCouponsData(): Promise<Coupon[]> {
  // it will fetch data from a database in the future, that's necessary to getStaticPaths and getStaticProps fetch data
  const coupons: Coupon[] = data.coupons
  return new Promise((resolve) => resolve(coupons))
}
