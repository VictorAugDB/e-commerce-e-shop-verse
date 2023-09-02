import { MongoDBProducts } from '@/lib/db/mongodb/products'

import { ListProducts } from '@/app/products/ListProducts'

export default async function Products() {
  const mongoDbProductsClient = new MongoDBProducts()
  const products = await mongoDbProductsClient.getProducts({
    limit: 10000,
  })

  return (
    <div className="space-y-4  pt-20 sm:px-8 2xl:px-[8.4375rem]">
      <ListProducts products={products} />
    </div>
  )
}
