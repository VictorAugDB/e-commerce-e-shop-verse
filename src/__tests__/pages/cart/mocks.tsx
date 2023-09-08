import { render } from '@testing-library/react'
import { ReactNode } from 'react'
import '@/__tests__/__mocks__/matchMedia'

import { Coupon } from '@/lib/db/mongodb/coupons'
import * as httpUtils from '@/lib/http'

import Cart from '@/app/cart/page'
import { ErrorProvider } from '@/contexts/ErrorProvider'
import {
  Product,
  ProductSize,
  ProductsProvider,
} from '@/contexts/ProductsContext'
import { LSCart } from '@/models/localStorage'

const product: Product = {
  id: '1',
  category: '',
  createdAt: '',
  discount: 0,
  images: [],
  price: 650,
  quantity: 100,
  numberOfSales: 0,
  sizes: {} as ProductSize,
  name: 'Monitor',
  description: '',
}

const coupon: Coupon = {
  name: 'shopverse10',
  minVal: 500,
  percentage: 10,
  limit: 200,
  quantity: 10,
  createdAt: '2023-09-07T23:08:31.105Z',
  expirationDate: '2030-09-07T23:08:31.105Z',
  id: '1',
}

const contextProvider = ({ children }: { children: ReactNode }) => (
  <ErrorProvider>
    <ProductsProvider>{children}</ProductsProvider>
  </ErrorProvider>
)

const setupCart = (
  productsMock: Product[],
  localStorageMock: Array<{ id: string; quantity: number }>,
  couponsMock?: Coupon[],
) => {
  jest
    .spyOn(httpUtils, 'getProductsByIds')
    .mockImplementationOnce(jest.fn(() => Promise.resolve(productsMock)))
  jest
    .spyOn(Storage.prototype, 'getItem')
    .mockImplementation(jest.fn(() => JSON.stringify(localStorageMock)))
  jest
    .spyOn(httpUtils, 'getCoupons')
    .mockImplementationOnce(jest.fn(() => Promise.resolve(couponsMock ?? [])))

  render(<Cart />, { wrapper: contextProvider })
}

class ProductMockHelper {
  products: Product[] = []
  private idCount = 1

  constructor(addictionalProducts: Array<Partial<Omit<Product, 'id'>>>) {
    addictionalProducts.map((ap) => this.generateProduct({ ...product, ...ap }))
  }

  private generateProduct(customProduct?: Omit<Product, 'id'>) {
    if (customProduct) {
      this.products.push({
        ...customProduct,
        id: this.idCount.toString(),
      })
    } else {
      this.products.push({
        ...product,
        id: this.idCount.toString(),
      })
    }

    this.idCount++
  }
}

class LocalStorageMockHelper {
  items: LSCart[] = []
  private idCount = 1
  private item = {
    quantity: 1,
  }

  constructor(addictionalItems: Array<Partial<Omit<LSCart, 'id'>>>) {
    addictionalItems.map((ai) => this.generateItem({ ...this.item, ...ai }))
  }

  private generateItem(customItem?: Omit<LSCart, 'id'>) {
    if (customItem) {
      this.items.push({
        ...customItem,
        id: this.idCount.toString(),
      })
    } else {
      this.items.push({
        ...this.item,
        id: this.idCount.toString(),
      })
    }

    this.idCount++
  }
}

class CouponMockHelper {
  coupons: Coupon[] = []
  private idCount = 1

  constructor(addictionalCoupons: Array<Partial<Omit<Coupon, 'id'>>>) {
    addictionalCoupons.map((ap) => this.generateCoupon({ ...coupon, ...ap }))
  }

  private generateCoupon(customCoupon?: Omit<Coupon, 'id'>) {
    if (customCoupon) {
      this.coupons.push({
        ...customCoupon,
        id: this.idCount.toString(),
      })
    } else {
      this.coupons.push({
        ...coupon,
        id: this.idCount.toString(),
      })
    }

    this.idCount++
  }
}

export {
  contextProvider,
  coupon,
  CouponMockHelper,
  LocalStorageMockHelper,
  product,
  ProductMockHelper,
  setupCart,
}
