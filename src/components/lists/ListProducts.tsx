import Link from 'next/link'

import Button from '@/components/buttons/Button'
import ListHeader from '@/components/lists/ListHeader'
import Product from '@/components/Product'

import { Product as ProductType } from '@/contexts/ProductsContext'

type ListProductsProps = {
  topic: string
  products: ProductType[]
  title?: string
  hasTimer?: boolean
  hasButton?: boolean
  filter?: string
}

export default function ListProducts({
  title,
  topic,
  hasTimer = false,
  hasButton = false,
  products,
  filter,
}: ListProductsProps) {
  return (
    <div className="flex w-full flex-col gap-10">
      <ListHeader topic={topic} title={title} hasTimer={hasTimer}></ListHeader>
      <div className="grid grid-cols-4 items-center gap-[1.875rem]">
        {products.map((p) => (
          <Product
            key={p.id}
            id={p.id}
            imagePath={p.images[0]}
            price={p.price}
            discount={p.discount}
            numberOfStars={p.stars}
            numberOfEvaluations={p.evaluations}
            name={p.name}
          />
        ))}
      </div>
      {hasButton && (
        <Link
          href={{ pathname: '/products', query: filter && { filter } }}
          className="mx-auto"
        >
          <Button className="w-fit px-12 py-4" variant="green">
            View All Products
          </Button>
        </Link>
      )}
    </div>
  )
}
