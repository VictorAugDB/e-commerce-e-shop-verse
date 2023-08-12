import {
  ChangeEvent,
  createContext,
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { getCoupons, getProductById } from '@/lib/http'

import { LocalStorage, LSCart } from '@/models/localStorage'

export type ProductSize = {
  xs: number
  s: number
  m: number
  l: number
  xl: number
}

export type Product = {
  id: string
  images: string[]
  price: number
  quantity: number
  cartQuantity?: number
  name: string
  sizes: ProductSize
  description: string
  evaluations: number
  category: string
  discount: number
  stars: number
  createdAt: string
}

export type Coupon = {
  name: string
  minVal: number
  percentage: number
  limit: number
  quantity: number
}

interface ProductsContextType {
  handleApplyCoupon: (
    couponRef: RefObject<HTMLInputElement>,
  ) => Promise<void | undefined>
  products: Product[]
  handleChangeQuantity: (
    event: ChangeEvent<HTMLInputElement>,
    id: string,
  ) => void
  shipping: number
  calculateShipping: () => void
  subtotal: number
  discounts: number
  setProducts: Dispatch<SetStateAction<Product[]>>
  handleAddToCart: (id: string) => void
  cartQuantity: number
}

type ProductsContextProps = {
  children: ReactNode
}

export const ProductsContext = createContext({} as ProductsContextType)

export function ProductsProvider({ children }: ProductsContextProps) {
  const [currentCoupon, setCurrentCoupon] = useState<Coupon | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  // TODO add set state shipping when create the shipping calc
  const [shipping, setShipping] = useState(0)
  const [cartQuantity, setCartQuantity] = useState(0)

  const subtotal = useMemo(() => {
    return products.reduce((acc, p) => acc + p.price * (p.cartQuantity || 1), 0)
  }, [products])

  const discounts = useMemo(() => {
    if (currentCoupon) {
      return Math.min(
        currentCoupon.limit,
        (subtotal * currentCoupon.percentage) / 100,
      )
    } else {
      return 0
    }
  }, [currentCoupon, subtotal])

  function calculateShipping(): void {
    // get user cep and call the API of the shipping service
    setShipping(0)
  }

  useEffect(() => {
    const cartProducts: LSCart[] = JSON.parse(
      localStorage.getItem(LocalStorage.CART) ?? '[]',
    )

    setCartQuantity(cartProducts.length)
  }, [])

  function handleChangeQuantity(
    event: ChangeEvent<HTMLInputElement>,
    id: string,
  ) {
    const quantity = Number(event.target.value)

    if (quantity <= 0) {
      // message the user that if he is sure that the want to remove the product
    }

    const product = products.find((p) => p.id === id)

    if (!product) {
      return
    }

    if (quantity > product.quantity) {
      // message the user that we haven't have more products
      return
    } else {
      const updatedProducts =
        quantity > 0
          ? products.map((p) =>
              p.id === id ? { ...p, cartQuantity: quantity } : p,
            )
          : products.filter((p) => p.id !== id)

      const cartProducts: LSCart[] = JSON.parse(
        localStorage.getItem(LocalStorage.CART) ?? '[]',
      )

      if (quantity > 0) {
        const productIdx = cartProducts.findIndex((cp) => cp.id === id)

        cartProducts[productIdx].quantity = quantity
        localStorage.setItem(LocalStorage.CART, JSON.stringify(cartProducts))
      } else {
        localStorage.setItem(
          LocalStorage.CART,
          JSON.stringify(cartProducts.filter((cp) => cp.id !== id)),
        )
        setCartQuantity(cartQuantity - 1)
      }

      setProducts(updatedProducts)
    }
  }

  async function handleAddToCart(id: string) {
    const cartProducts: LSCart[] = JSON.parse(
      localStorage.getItem(LocalStorage.CART) ?? '[]',
    )
    const productIdx = cartProducts.findIndex((cp) => cp.id === id)
    if (productIdx === -1) {
      cartProducts.push({
        id,
        quantity: 1,
      })
      setCartQuantity(cartQuantity + 1)
    } else {
      const product = await getProductById(id)
      if (product.quantity > cartProducts[productIdx].quantity) {
        cartProducts[productIdx].quantity++
      } else {
        // message user that we don't have more products
      }
    }

    localStorage.setItem(LocalStorage.CART, JSON.stringify(cartProducts))
  }

  async function handleApplyCoupon(couponRef: RefObject<HTMLInputElement>) {
    if (!couponRef.current) {
      return
    }

    const coupon = couponRef.current.value
    // call the api to check the coupons
    const availableCoupons = await getCoupons()

    const couponInfo = availableCoupons.find(
      (ac) => ac.name.toLowerCase() === coupon,
    )

    if (!couponInfo) {
      // add message saying that the coupon not exists
      return
    } else {
      if (couponInfo.quantity === 0) {
        // add message saying that the coupon ended
        return
      }

      if (subtotal < couponInfo.minVal) {
        // add message saying that the subtotal is not enough to apply the coupon
        return
      }

      // The coupon will be passed to the checkout there when the user pay the quantity will be decreased
      setCurrentCoupon(couponInfo)
    }
  }

  return (
    <ProductsContext.Provider
      value={{
        handleApplyCoupon,
        handleChangeQuantity,
        calculateShipping,
        products,
        shipping,
        setProducts,
        subtotal,
        discounts,
        handleAddToCart,
        cartQuantity,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}
