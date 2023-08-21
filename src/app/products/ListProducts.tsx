'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { default as ListProductsComponent } from '@/components/lists/ListProducts'
import SearchInput from '@/components/SearchInput'

import { Product } from '@/contexts/ProductsContext'

type ProductsProps = {
  products: Product[]
}

export function ListProducts({ products }: ProductsProps) {
  const searchParams = useSearchParams()
  const search = searchParams?.get('search')
  const category = searchParams?.get('category')
  const [productsState, setProductsState] = useState<Product[]>(products)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (typeof search === 'string') {
      if (!search) {
        setProductsState(products)
      } else {
        setProductsState(
          products.filter((p) =>
            p.name.toLocaleLowerCase().toLowerCase().includes(search),
          ),
        )
      }
    }

    if (category && typeof category === 'string') {
      setProductsState(
        products.filter((p) =>
          p.category.toLocaleLowerCase().toLowerCase().includes(category),
        ),
      )
    }
  }, [search, products, category])

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
    <>
      <SearchInput
        handleSearch={handleSearch}
        ref={inputRef}
        placeholder="Search"
      />
      <ListProductsComponent
        products={productsState}
        hasCartButton
      ></ListProductsComponent>
    </>
  )
}
