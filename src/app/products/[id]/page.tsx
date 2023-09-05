import { randomUUID } from 'crypto'
import { twMerge } from 'tailwind-merge'

import { MongoDBProducts } from '@/lib/db/mongodb/products'

import ImagesSwitch from '@/components/ImagesSwitch'
import ListProducts from '@/components/lists/ListProducts'
import Steps from '@/components/Steps'

import { Product as ProductPage } from '@/app/products/[id]/Product'
import { Reviews } from '@/app/products/[id]/reviews'

export async function generateStaticParams() {
  const mongoDbProductsClient = new MongoDBProducts()
  const products = await mongoDbProductsClient.getProducts({
    limit: 10000,
  })

  return products.map((p) => ({ id: p.id }))
}

export default async function Product({ params }: { params: { id: string } }) {
  const mongoDbProductsClient = new MongoDBProducts()
  const product = await mongoDbProductsClient.getProductById(params.id)

  if (!product) {
    return
  }

  const images = product.images.map((pi) => ({
    id: randomUUID(),
    image: pi,
  }))
  const relatedProducts = (
    await mongoDbProductsClient.getProducts({
      category: product.category,
      limit: 4,
    })
  ).filter((rp) => rp.id !== product.id)

  return (
    <div className="px-2 sm:px-8 xl:px-[5.4375rem] 2xl:px-[8.4375rem]">
      <Steps
        flow="product"
        currentStep={2}
        category={product.category}
        productName={product.name}
      />

      <div
        className={twMerge(
          'flex flex-col xl:flex-row w-full gap-[68px] items-center justify-center',
          relatedProducts.length && 'mb-[8.75rem]',
        )}
      >
        <div className="space-y-2">
          <p className="xl:hidden">{product.name}</p>
          <ImagesSwitch productImages={images} />
        </div>

        <ProductPage product={product} key={params.id} />
      </div>
      {relatedProducts.length > 0 && (
        <ListProducts products={relatedProducts} topic="Related Items" />
      )}
      <Reviews className="mt-8" productId={params.id} />
    </div>
  )
}
