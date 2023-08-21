import { getProductsData } from '@/lib/data'

import { ListProducts } from '@/app/products/ListProducts'

export default async function Products() {
  const products = await getProductsData()

  return (
    <div className="space-y-4  pt-20 sm:px-8 2xl:px-[8.4375rem]">
      <ListProducts products={products} />
    </div>
  )
}
