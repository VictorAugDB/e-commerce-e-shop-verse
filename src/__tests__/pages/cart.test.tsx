import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as httpUtils from '@/lib/http'

import {
  Product,
  ProductSize,
  ProductsProvider,
} from '@/contexts/ProductsContext'
import Cart from '@/pages/cart'

const product: Product = {
  id: '1',
  category: '',
  createdAt: '',
  discount: 0,
  images: [],
  price: 650,
  quantity: 1,
  sizes: {} as ProductSize,
  name: 'Monitor',
  description: '',
  evaluations: 150,
  stars: 4,
}

const coupon = {
  name: 'shopverse10',
  minVal: 500,
  percentage: 10,
  limit: 200,
  quantity: 10,
}

jest.mock('@/lib/http')

describe('Cart functionalities', () => {
  describe('subtotal', () => {
    it('Should render product subtotal correctly', async () => {
      const mockData = [
        {
          ...product,
          quantity: 67,
        },
        {
          ...product,
          id: '2',
        },
      ]

      jest
        .spyOn(httpUtils, 'getProducts')
        .mockImplementation(jest.fn(() => Promise.resolve(mockData)))

      render(<Cart />, {
        wrapper: ({ children }) => (
          <ProductsProvider>{children}</ProductsProvider>
        ),
      })

      const subtotal = mockData[0].quantity * product.price
      const el = await screen.findAllByTestId('product-subtotal-val')

      expect(el[0].textContent).toBe(`$${subtotal}`)
    })

    it('Should render cart subtotal and total correctly', async () => {
      const mockData = [
        {
          ...product,
          quantity: 67,
        },
        {
          ...product,
          id: '2',
        },
      ]

      jest
        .spyOn(httpUtils, 'getProducts')
        .mockImplementation(jest.fn(() => Promise.resolve(mockData)))

      render(<Cart />, {
        wrapper: ({ children }) => (
          <ProductsProvider>{children}</ProductsProvider>
        ),
      })

      const subtotal = 68 * product.price

      await waitFor(() => {
        const subtotalEl = screen.getByTestId('cart-subtotal-val')
        const totalEl = screen.getByTestId('total-val')
        expect(subtotalEl.textContent).toBe(`$${subtotal}`)
        expect(totalEl.textContent).toBe(`$${subtotal}`)
      })
    })
  })

  describe('coupon', () => {
    it('Should apply coupon', async () => {
      const mockProducts = [
        product,
        {
          ...product,
          id: '2',
        },
      ]

      jest
        .spyOn(httpUtils, 'getProducts')
        .mockImplementation(jest.fn(() => Promise.resolve(mockProducts)))
      jest
        .spyOn(httpUtils, 'getCoupons')
        .mockImplementation(jest.fn(() => Promise.resolve([coupon])))

      render(<Cart />, {
        wrapper: ({ children }) => (
          <ProductsProvider>{children}</ProductsProvider>
        ),
      })

      const input = await screen.findByPlaceholderText<HTMLInputElement>(
        /coupon here/i,
      )
      await userEvent.type(input, coupon.name)

      await userEvent.click(screen.getByText(/apply coupon/i))

      const subtotal = 1300
      const discount = (subtotal * coupon.percentage) / 100
      const total = subtotal - discount
      const subtotalEl = screen.getByTestId('cart-subtotal-val')
      const discountEl = screen.getByTestId('discount-val')
      const totalEl = screen.getByTestId('total-val')

      expect(subtotalEl.textContent).toBe(`$${subtotal}`)
      expect(discountEl.textContent).toBe(`$${discount}`)
      expect(totalEl.textContent).toBe(`$${total}`)
    })

    it('Should discount not exceed the limit', async () => {
      const mockProducts = [
        {
          ...product,
          quantity: 100,
        },
      ]

      jest
        .spyOn(httpUtils, 'getProducts')
        .mockImplementation(jest.fn(() => Promise.resolve(mockProducts)))
      jest
        .spyOn(httpUtils, 'getCoupons')
        .mockImplementation(jest.fn(() => Promise.resolve([coupon])))

      render(<Cart />, {
        wrapper: ({ children }) => (
          <ProductsProvider>{children}</ProductsProvider>
        ),
      })

      const input = await screen.findByPlaceholderText<HTMLInputElement>(
        /coupon here/i,
      )
      await userEvent.type(input, coupon.name)

      await userEvent.click(screen.getByText(/apply coupon/i))

      const discountEl = screen.getByTestId('discount-val')

      expect(discountEl.textContent).toBe(`$${coupon.limit}`)
    })
  })

  describe('change quantity', () => {
    it('Should increase product quantity', async () => {
      const mockProducts = [
        product,
        {
          ...product,
          id: '2',
        },
      ]

      jest
        .spyOn(httpUtils, 'getProducts')
        .mockImplementation(jest.fn(() => Promise.resolve(mockProducts)))

      render(<Cart />, {
        wrapper: ({ children }) => (
          <ProductsProvider>{children}</ProductsProvider>
        ),
      })

      const input = await screen.findAllByTestId<HTMLInputElement>(
        'quantity-input',
      )
      input[0].value = ''
      await userEvent.type(input[0], (mockProducts[0].quantity + 1).toString())

      const cartSubtotalEl = screen.getByTestId('cart-subtotal-val')
      const productSubtotalEl = screen.getAllByTestId('product-subtotal-val')
      const quantityEl =
        screen.getAllByTestId<HTMLInputElement>('quantity-input')
      const totalEl = screen.getByTestId('total-val')

      expect(productSubtotalEl[0].textContent).toBe(`$${1300}`)
      expect(productSubtotalEl[1].textContent).toBe(`$${650}`)
      expect(quantityEl[0].value).toBe('2')
      expect(quantityEl[1].value).toBe('1')
      expect(cartSubtotalEl.textContent).toBe(`$${1950}`)
      expect(totalEl.textContent).toBe(`$${1950}`)
    })

    it('Should decrease product quantity', async () => {
      const mockProducts = [
        {
          ...product,
          quantity: 2,
        },
        {
          ...product,
          id: '2',
        },
      ]

      jest
        .spyOn(httpUtils, 'getProducts')
        .mockImplementation(jest.fn(() => Promise.resolve(mockProducts)))

      render(<Cart />, {
        wrapper: ({ children }) => (
          <ProductsProvider>{children}</ProductsProvider>
        ),
      })

      const input = await screen.findAllByTestId<HTMLInputElement>(
        'quantity-input',
      )
      input[0].value = ''
      await userEvent.type(input[0], (mockProducts[0].quantity - 1).toString())

      const cartSubtotalEl = screen.getByTestId('cart-subtotal-val')
      const productSubtotalEl = screen.getAllByTestId('product-subtotal-val')
      const quantityEl =
        screen.getAllByTestId<HTMLInputElement>('quantity-input')
      const totalEl = screen.getByTestId('total-val')

      expect(productSubtotalEl[0].textContent).toBe(`$${650}`)
      expect(quantityEl[0].value).toBe('1')
      expect(cartSubtotalEl.textContent).toBe(`$${1300}`)
      expect(totalEl.textContent).toBe(`$${1300}`)
    })

    it('Should remove product when quantity is equal to 0', async () => {
      const mockProducts = [
        product,
        {
          ...product,
          id: '2',
        },
      ]

      jest
        .spyOn(httpUtils, 'getProducts')
        .mockImplementation(jest.fn(() => Promise.resolve(mockProducts)))

      render(<Cart />, {
        wrapper: ({ children }) => (
          <ProductsProvider>{children}</ProductsProvider>
        ),
      })

      const input = await screen.findAllByTestId<HTMLInputElement>(
        'quantity-input',
      )
      input[0].value = ''
      await userEvent.type(input[0], (mockProducts[0].quantity - 1).toString())

      const productRows = screen.getAllByTestId('product-row')
      const cartSubtotalEl = screen.getByTestId('cart-subtotal-val')
      const totalEl = screen.getByTestId('total-val')

      expect(productRows.length).toBe(1)
      expect(cartSubtotalEl.textContent).toBe(`$${650}`)
      expect(totalEl.textContent).toBe(`$${650}`)
    })

    it('Should remove product when quantity is less than 0', async () => {
      const mockProducts = [
        product,
        {
          ...product,
          id: '2',
        },
      ]

      jest
        .spyOn(httpUtils, 'getProducts')
        .mockImplementation(jest.fn(() => Promise.resolve(mockProducts)))

      render(<Cart />, {
        wrapper: ({ children }) => (
          <ProductsProvider>{children}</ProductsProvider>
        ),
      })

      const input = await screen.findAllByTestId<HTMLInputElement>(
        'quantity-input',
      )
      input[0].value = ''
      await userEvent.type(input[0], (mockProducts[0].quantity - 2).toString())

      const productRows = screen.getAllByTestId('product-row')
      const cartSubtotalEl = screen.getByTestId('cart-subtotal-val')
      const totalEl = screen.getByTestId('total-val')

      expect(productRows.length).toBe(1)
      expect(cartSubtotalEl.textContent).toBe(`$${650}`)
      expect(totalEl.textContent).toBe(`$${650}`)
    })
  })
})
