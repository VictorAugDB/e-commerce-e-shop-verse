import data from 'public/db.json'

import { Coupon } from '@/contexts/ProductsContext'

export function getCouponsData(): Promise<Coupon[]> {
  // it will fetch data from a database in the future, that's necessary to getStaticPaths and getStaticProps fetch data
  const coupons: Coupon[] = data.coupons
  return new Promise((resolve) => resolve(coupons))
}
