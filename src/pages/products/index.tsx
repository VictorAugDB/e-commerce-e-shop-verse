import {
  GetStaticProps,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from 'next'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

import { getProductsData } from '@/lib/data'

import ListProducts from '@/components/lists/ListProducts'
import SearchInput from '@/components/SearchInput'

import { Product } from '@/contexts/ProductsContext'

type ProductsProps = {
  products: Product[]
}

export default function Products({
  products,
}: InferGetStaticPropsType<GetStaticProps<ProductsProps>>) {
  const { search } = useRouter().query
  const [productsState, setProductsState] = useState(products)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (search && typeof search === 'string') {
      setProductsState(
        products.filter((p) =>
          p.name.toLocaleLowerCase().toLowerCase().includes(search),
        ),
      )
    }
  }, [search, products])

  function handleSearch() {
    if (!inputRef) {
      return
    }

    const value = inputRef.current?.value as string

    if (!value) {
      setProductsState(products)
      return
    }

    setProductsState(
      products.filter((p) =>
        p.name.toLocaleLowerCase().toLowerCase().includes(value),
      ),
    )
  }

  return (
    <div className="space-y-4  pt-20 sm:px-8 2xl:px-[8.4375rem]">
      <SearchInput
        handleSearch={handleSearch}
        ref={inputRef}
        placeholder="Search"
      />
      <ListProducts products={productsState} hasCartButton></ListProducts>
    </div>
  )
}

export const getStaticProps: GetStaticProps<ProductsProps> = async (): Promise<
  GetStaticPropsResult<ProductsProps>
> => {
  const products = await getProductsData()

  return {
    props: { products },
  }
}
