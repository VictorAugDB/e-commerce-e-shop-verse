import {
  GetStaticProps,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from 'next'
import { useRef, useState } from 'react'
import { Search } from 'react-feather'

import { getProducts } from '@/lib/http'

import ListProducts from '@/components/lists/ListProducts'

import { Product } from '@/contexts/ProductsContext'

type ProductsProps = {
  products: Product[]
}

export default function Products({
  products,
}: InferGetStaticPropsType<GetStaticProps<ProductsProps>>) {
  const [productsState, setProductsState] = useState(products)
  const inputRef = useRef<HTMLInputElement>(null)

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
      <div className="ml-auto flex w-fit items-center rounded border border-gray-400 bg-white px-2 transition-all focus-within:border focus-within:border-green-700 hover:border-green-700">
        <input
          placeholder="Search"
          className="border-none bg-transparent focus:ring-0"
          type="text"
          ref={inputRef}
        />
        <Search
          width={20}
          height={20}
          onClick={handleSearch}
          className="cursor-pointer transition hover:stroke-gray-400"
        />
      </div>
      <ListProducts products={productsState} hasCartButton></ListProducts>
    </div>
  )
}

export const getStaticProps: GetStaticProps<ProductsProps> = async (): Promise<
  GetStaticPropsResult<ProductsProps>
> => {
  const products = await getProducts()

  return {
    props: { products },
  }
}
