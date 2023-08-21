import { randomUUID } from 'crypto'
import { twMerge } from 'tailwind-merge'

import { getProductDataByid, getProductsData } from '@/lib/data'

import ImagesSwitch from '@/components/ImagesSwitch'
import ListProducts from '@/components/lists/ListProducts'
import Steps from '@/components/Steps'

import { Product as ProductPage } from '@/app/products/[id]/Product'

export async function generateStaticParams() {
  const products = await getProductsData()

  return products.map((p) => ({ id: p.id }))
}

export default async function Product({ params }: { params: { id: string } }) {
  const product = await getProductDataByid(params.id)

  if (!product) {
    return
  }

  const images = product.images.map((pi) => ({
    id: randomUUID(),
    image: pi,
  }))
  let relatedProducts = await getProductsData({
    category: product.category,
  })

  relatedProducts = relatedProducts
    .filter((rp) => rp.id !== params.id)
    .slice(0, 4)

  return (
    <div className="px-8 xl:px-[5.4375rem] 2xl:px-[8.4375rem]">
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
    </div>
  )
}
