'use client'

import {
  createContext,
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { Coupon } from '@/lib/db/mongodb/coupons'
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
  name: string
  sizes?: ProductSize
  description: string
  numberOfSales: number
  category: string
  discount: number
  createdAt: string
}

interface ProductsContextType {
  handleApplyCoupon: (
    couponRef: RefObject<HTMLInputElement>,
    customSubtotal?: number,
  ) => Promise<void | undefined>
  products: Product[]

  shipping: number
  calculateShipping: () => void
  subtotal: number
  discounts: number
  setProducts: Dispatch<SetStateAction<Product[]>>
  handleAddToCart: (id: string) => Promise<void>
  numberOfProductsInCart: number
  setNumberOfProductsInCart: Dispatch<SetStateAction<number>>
  currentCoupon: Coupon | null
  productsQuantity: Map<string, number>
  setProductsQuantity: Dispatch<SetStateAction<Map<string, number>>>
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
  const [numberOfProductsInCart, setNumberOfProductsInCart] = useState(0)
  const [productsQuantity, setProductsQuantity] = useState<Map<string, number>>(
    new Map(),
  )

  const subtotal = useMemo(() => {
    return products.reduce(
      (acc, p) => acc + p.price * (productsQuantity.get(p.id) || 1),
      0,
    )
  }, [products, productsQuantity])

  const discounts = useMemo(() => {
    if (currentCoupon && currentCoupon.minVal <= subtotal + shipping) {
      return Math.min(
        currentCoupon.limit,
        (subtotal * currentCoupon.percentage) / 100,
      )
    } else {
      return 0
    }
  }, [currentCoupon, subtotal, shipping])

  function calculateShipping(): void {
    // get user cep and call the API of the shipping service
    setShipping(20)
  }

  useEffect(() => {
    const cartProducts: LSCart[] = JSON.parse(
      localStorage.getItem(LocalStorage.CART) ?? '[]',
    )

    setNumberOfProductsInCart(cartProducts.length)
  }, [])

  async function handleAddToCart(id: string): Promise<void> {
    const cartProducts: LSCart[] = JSON.parse(
      localStorage.getItem(LocalStorage.CART) ?? '[]',
    )
    const productIdx = cartProducts.findIndex((cp) => cp.id === id)
    if (productIdx === -1) {
      cartProducts.push({
        id,
        quantity: 1,
      })
      setNumberOfProductsInCart((state) => state + 1)
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

  async function handleApplyCoupon(
    couponRef: RefObject<HTMLInputElement>,
    customSubtotal?: number,
  ) {
    if (!couponRef.current) {
      return
    }

    const coupon = couponRef.current.value
    // call the api to check the coupons
    const availableCoupons: Coupon[] = await getCoupons()

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

      if (customSubtotal) {
        if (customSubtotal < couponInfo.minVal) {
          alert(`The minimun value to use this coupon is $${couponInfo.minVal}`)
          return
        }
      } else if (subtotal < couponInfo.minVal) {
        alert(`The minimun value to use this coupon is $${couponInfo.minVal}`)
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
        calculateShipping,
        products,
        shipping,
        setProducts,
        subtotal,
        discounts,
        handleAddToCart,
        numberOfProductsInCart,
        setNumberOfProductsInCart,
        currentCoupon,
        productsQuantity,
        setProductsQuantity,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}
