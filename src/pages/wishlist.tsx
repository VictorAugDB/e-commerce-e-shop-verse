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

  function handleMoveAllToCart() {
    products.forEach((p) => handleAddToCart(p.id))
  }

  function handleRemoveFromWishList(
    e: ReactMouseEvent<HTMLDivElement, MouseEvent>,
    id: string,
  ) {
    e.preventDefault()
    e.stopPropagation()

    const filteredProduts = products.filter((p) => p.id !== id)
    setProducts(filteredProduts)
    localStorage.setItem(
      LocalStorage.WISHLIST,
      JSON.stringify(filteredProduts.map((fp) => fp.id)),
    )
  }

  return (
    <div className="px-[8.4375rem] pt-20">
      <div className="flex items-center justify-between gap-2">
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
    </div>
  )
}
