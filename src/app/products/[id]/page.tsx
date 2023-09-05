import { randomUUID } from 'crypto'
import { twMerge } from 'tailwind-merge'

import { MongoDBProducts } from '@/lib/db/mongodb/products'
import { MongoDBReviews } from '@/lib/db/mongodb/reviews'
import { getEvaluationsHash } from '@/lib/helpers/getEvaluationsHash'

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

  const mongoDbReviewsClient = new MongoDBReviews()
  const reviews = await mongoDbReviewsClient.getReviewsByProductId(params.id)

  const evaluations = getEvaluationsHash(
    reviews.map((r) => r.evaluation.toString()),
  )

  const totalNumberOfEvaluations = Object.values(evaluations).reduce(
    (acc, curr) => acc + curr,
    0,
  )

  const evaluationsAverage = (
    Object.entries(evaluations).reduce(
      (acc, [key, val]) => acc + Number(key) * val,
      0,
    ) / totalNumberOfEvaluations
  ).toFixed(2)

  if (!product) {
    return
  }

  const images = product.images.map((pi) => ({
    id: randomUUID(),
    image: pi,
  }))
  const res = await mongoDbProductsClient.getProducts({
    category: product.category,
    limit: 4,
  })

  let relatedProducts = await Promise.all(
    res.map(async (rp) => {
      const mongoDbReviewsClient = new MongoDBReviews()
      const rpReviews = await mongoDbReviewsClient.getReviewsByProductId(rp.id)
      const rpEvaluations = getEvaluationsHash(
        rpReviews.map((r) => r.evaluation.toString()),
      )
      const rpTotalNumberOfEvaluations = Object.values(rpEvaluations).reduce(
        (acc, curr) => acc + curr,
        0,
      )

      const rpEvaluationsAverage = (
        Object.entries(rpEvaluations).reduce(
          (acc, [key, val]) => acc + Number(key) * val,
          0,
        ) / rpTotalNumberOfEvaluations
      ).toFixed(2)

      return {
        ...rp,
        stars: isNaN(Number(rpEvaluationsAverage))
          ? 0
          : Number(rpEvaluationsAverage),
        evaluations: isNaN(rpTotalNumberOfEvaluations)
          ? rpTotalNumberOfEvaluations
          : rpTotalNumberOfEvaluations,
      }
    }),
  )

  relatedProducts = relatedProducts.filter((rp) => rp.id !== product.id)

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

        <ProductPage
          product={product}
          key={params.id}
          evaluationsAverage={Number(evaluationsAverage)}
          totalNumberOfEvaluations={totalNumberOfEvaluations}
        />
      </div>
      {relatedProducts.length > 0 && (
        <ListProducts products={relatedProducts} topic="Related Items" />
      )}
      <Reviews className="mt-8" productId={params.id} />
    </div>
  )
}
