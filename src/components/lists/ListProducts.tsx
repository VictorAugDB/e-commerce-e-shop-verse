'use client'

import Link from 'next/link'
import { MouseEvent as ReactMouseEvent, useEffect, useState } from 'react'

import Button from '@/components/buttons/Button'
import ListHeader from '@/components/lists/ListHeader'
import Product from '@/components/Product'

import { Product as ProductType } from '@/contexts/ProductsContext'
import { LocalStorage, LSWishlist } from '@/models/localStorage'

type ProductWishlist = ProductType & {
  wished: boolean
}

type ListProductsProps = {
  topic?: string
  products: ProductType[]
  title?: string
  hasTimer?: boolean
  hasViewAllButton?: boolean
  hasCartButton?: boolean
  filter?: string
  isWishList?: boolean
  handleRemoveFromWishList?: (
    e: ReactMouseEvent<HTMLDivElement, MouseEvent>,
    id: string,
  ) => void
}

export default function ListProducts({
  title,
  topic,
  hasTimer = false,
  hasViewAllButton = false,
  hasCartButton = false,
  isWishList = false,
  handleRemoveFromWishList,
  products,
  filter,
}: ListProductsProps) {
  const [listProducts, setListProducts] = useState<
    ProductWishlist[] | ProductType[]
  >([])

  useEffect(() => {
    if (!isWishList) {
      if (typeof window !== 'undefined') {
        const wishlistIds = new Set()

        const wishlistProducts: LSWishlist[] = JSON.parse(
          localStorage.getItem(LocalStorage.WISHLIST) ?? '[]',
        )

        wishlistProducts.forEach((wp) => wishlistIds.add(wp))

        setListProducts(
          products.map((lp) =>
            wishlistIds.has(lp.id)
              ? { ...lp, wished: true }
              : { ...lp, wished: false },
          ),
        )
      }
    } else {
      setListProducts(products)
    }
  }, [isWishList, products])

  return (
    <div className="flex w-full flex-col gap-10">
      {topic && (
        <ListHeader
          topic={topic}
          title={title}
          hasTimer={hasTimer}
        ></ListHeader>
      )}
      <div className="grid w-full auto-cols-auto grid-flow-row auto-rows-auto grid-cols-1 content-center items-center gap-[1.875rem] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {listProducts.map((p) => (
          <Product
            wished={
              p.hasOwnProperty('wished') ? (p as ProductWishlist).wished : false
            }
            key={p.id}
            id={p.id}
            imagePath={p.images[0]}
            price={p.price}
            hasButton={hasCartButton}
            discount={p.discount}
            numberOfStars={p.stars}
            numberOfEvaluations={p.evaluations}
            name={p.name}
            isWishList={isWishList}
            handleRemoveFromWishList={handleRemoveFromWishList}
          />
        ))}
      </div>
      {hasViewAllButton && (
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
