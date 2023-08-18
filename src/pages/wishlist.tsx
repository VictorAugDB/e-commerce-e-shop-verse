import Link from 'next/link'
import {
  MouseEvent as ReactMouseEvent,
  useContext,
  useEffect,
  useState,
} from 'react'

import { getProductsByIds } from '@/lib/http'

import Button from '@/components/buttons/Button'
import ListProducts from '@/components/lists/ListProducts'

import { Product, ProductsContext } from '@/contexts/ProductsContext'
import { LocalStorage, LSWishlist } from '@/models/localStorage'

export default function Wishlist() {
  const [products, setProducts] = useState<Product[]>([])
  const { handleAddToCart } = useContext(ProductsContext)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ids: LSWishlist[] = JSON.parse(
        localStorage.getItem(LocalStorage.WISHLIST) ?? '[]',
      )

      if (ids.length) {
        ;(async () => {
          const wishListProducts = await getProductsByIds(ids)

          setProducts(wishListProducts)
        })()
      }
    }
  }, [])

  async function handleMoveAllToCart() {
    for (const product of products) {
      await handleAddToCart(product.id)
    }
  }

  function handleRemoveFromWishList(
    e: ReactMouseEvent<HTMLDivElement, MouseEvent>,
    id: string,
  ) {
    e.preventDefault()
    e.stopPropagation()

    const filteredProduts = products.filter((p) => p.id !== id)
    setProducts(filteredProduts)
    if (filteredProduts.length) {
      localStorage.setItem(
        LocalStorage.WISHLIST,
        JSON.stringify(filteredProduts.map((fp) => fp.id)),
      )
    } else {
      localStorage.removeItem(LocalStorage.WISHLIST)
    }
  }

  return (
    <div className="px-2 pt-20 2xl:px-[8.4375rem]">
      {products.length > 0 ? (
        <>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:justify-between">
            <h4 className="font-normal">Wishlist ({products.length})</h4>
            <Button
              onClick={handleMoveAllToCart}
              variant="ghost"
              className="border border-gray-600 px-12 py-4"
            >
              Move all to cart
            </Button>
          </div>
          {products.length > 0 && (
            <ListProducts
              products={products}
              isWishList
              handleRemoveFromWishList={handleRemoveFromWishList}
            />
          )}
        </>
      ) : (
        <div className="w-full space-y-4">
          <h4 className="text-center">
            There's nothing here, wish some products!
          </h4>
          <Link className="mx-auto block w-fit" href="/products">
            <Button
              variant="ghost"
              className="border border-gray-800 px-12 py-4"
            >
              Return To Shop
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
