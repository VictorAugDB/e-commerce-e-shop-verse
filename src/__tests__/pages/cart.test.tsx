import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@/__tests__/__mocks__/matchMedia'

import * as httpUtils from '@/lib/http'

import Cart from '@/app/cart/page'
import {
  Product,
  ProductSize,
  ProductsProvider,
} from '@/contexts/ProductsContext'

type TestProdcut = Product & {
  cartQuantity: number
}

const product: TestProdcut = {
  id: '1',
  category: '',
  createdAt: '',
  discount: 0,
  images: [],
  price: 650,
  quantity: 100,
  cartQuantity: 1,
  numberOfSales: 0,
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
        product,
        {
          ...product,
          id: '2',
        },
      ]
      const localStorageMock = [
        {
          id: '1',
          quantity: 67,
        },
        { id: '2', quantity: 1 },
      ]

      jest
        .spyOn(httpUtils, 'getProductsByIds')
        .mockImplementation(jest.fn(() => Promise.resolve(mockData)))
      jest
        .spyOn(Storage.prototype, 'getItem')
        .mockImplementation(jest.fn(() => JSON.stringify(localStorageMock)))

      render(<Cart />, {
        wrapper: ({ children }) => (
          <ProductsProvider>{children}</ProductsProvider>
        ),
      })

      const subtotal = localStorageMock[0].quantity * product.price
      const el = await screen.findAllByTestId('product-subtotal-val')

      expect(el[0].textContent).toBe(`$${subtotal}`)
    })

    it('Should render cart subtotal and total correctly', async () => {
      const mockData = [
        product,
        {
          ...product,
          id: '2',
        },
      ]

      const localStorageMock = [
        {
          id: '1',
          quantity: 67,
        },
        { id: '2', quantity: 1 },
      ]

      jest
        .spyOn(Storage.prototype, 'getItem')
        .mockImplementation(jest.fn(() => JSON.stringify(localStorageMock)))
      jest
        .spyOn(httpUtils, 'getProductsByIds')
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

      const localStorageMock = [
        {
          id: '1',
          quantity: 1,
        },
        { id: '2', quantity: 1 },
      ]

      jest
        .spyOn(Storage.prototype, 'getItem')
        .mockImplementation(jest.fn(() => JSON.stringify(localStorageMock)))

      jest
        .spyOn(httpUtils, 'getProductsByIds')
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
          cartQuantity: 100,
        },
      ]

      const localStorageMock = [
        {
          id: '1',
          quantity: 100,
        },
      ]

      jest
        .spyOn(Storage.prototype, 'getItem')
        .mockImplementation(jest.fn(() => JSON.stringify(localStorageMock)))

      jest
        .spyOn(httpUtils, 'getProductsByIds')
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

      const localStorageMock = [
        {
          id: '1',
          quantity: 1,
        },
        {
          id: '2',
          quantity: 1,
        },
      ]

      jest
        .spyOn(Storage.prototype, 'getItem')
        .mockImplementation(jest.fn(() => JSON.stringify(localStorageMock)))

      jest
        .spyOn(httpUtils, 'getProductsByIds')
        .mockImplementation(jest.fn(() => Promise.resolve(mockProducts)))

      render(<Cart />, {
        wrapper: ({ children }) => (
          <ProductsProvider>{children}</ProductsProvider>
        ),
      })

      const increaseButtons = await screen.findAllByTestId<HTMLButtonElement>(
        'increase-quantity',
      )

      await userEvent.click(increaseButtons[0])

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
          cartQuantity: 2,
        },
        {
          ...product,
          id: '2',
        },
      ]

      jest
        .spyOn(httpUtils, 'getProductsByIds')
        .mockImplementation(jest.fn(() => Promise.resolve(mockProducts)))

      render(<Cart />, {
        wrapper: ({ children }) => (
          <ProductsProvider>{children}</ProductsProvider>
        ),
      })

      const decreaseButtons = await screen.findAllByTestId<HTMLButtonElement>(
        'decrease-quantity',
      )

      await userEvent.click(decreaseButtons[0])

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

    it('Should change quantity manually on press enter', async () => {
      const mockProducts = [
        product,
        {
          ...product,
          id: '2',
        },
      ]

      const localStorageMock = [
        {
          id: '1',
          quantity: 1,
        },
        {
          id: '2',
          quantity: 1,
        },
      ]

      jest
        .spyOn(Storage.prototype, 'getItem')
        .mockImplementation(jest.fn(() => JSON.stringify(localStorageMock)))

      jest
        .spyOn(httpUtils, 'getProductsByIds')
        .mockImplementation(jest.fn(() => Promise.resolve(mockProducts)))

      render(<Cart />, {
        wrapper: ({ children }) => (
          <ProductsProvider>{children}</ProductsProvider>
        ),
      })

      const quantityInputs = await screen.findAllByTestId<HTMLInputElement>(
        'quantity-input',
      )

      const currentInput = quantityInputs[0]

      fireEvent.change(currentInput, {
        target: { value: (2).toString() },
      })

      await userEvent.click(currentInput)

      await userEvent.keyboard('[Enter]')

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

    it('Should change quantity manually on click outside input', async () => {
      const mockProducts = [
        product,
        {
          ...product,
          id: '2',
        },
      ]

      const localStorageMock = [
        {
          id: '1',
          quantity: 1,
        },
        {
          id: '2',
          quantity: 1,
        },
      ]

      jest
        .spyOn(Storage.prototype, 'getItem')
        .mockImplementation(jest.fn(() => JSON.stringify(localStorageMock)))

      jest
        .spyOn(httpUtils, 'getProductsByIds')
        .mockImplementation(jest.fn(() => Promise.resolve(mockProducts)))

      render(<Cart />, {
        wrapper: ({ children }) => (
          <ProductsProvider>{children}</ProductsProvider>
        ),
      })

      const quantityInputs = await screen.findAllByTestId<HTMLInputElement>(
        'quantity-input',
      )

      const currentInput = quantityInputs[0]

      fireEvent.change(currentInput, {
        target: { value: (2).toString() },
      })

      await userEvent.click(currentInput)

      await userEvent.click(document.body)

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

    it('Should not click decrease when the quantity input is equal to 1', async () => {
      const mockProducts = [
        product,
        {
          ...product,
          id: '2',
        },
      ]

      const localStorageMock = [
        {
          id: '1',
          quantity: 1,
        },
        {
          id: '2',
          quantity: 1,
        },
      ]

      jest
        .spyOn(Storage.prototype, 'getItem')
        .mockImplementation(jest.fn(() => JSON.stringify(localStorageMock)))

      jest
        .spyOn(httpUtils, 'getProductsByIds')
        .mockImplementation(jest.fn(() => Promise.resolve(mockProducts)))

      render(<Cart />, {
        wrapper: ({ children }) => (
          <ProductsProvider>{children}</ProductsProvider>
        ),
      })

      const quantityInputs = await screen.findAllByTestId<HTMLInputElement>(
        'quantity-input',
      )

      const currentInput = quantityInputs[0]

      fireEvent.blur(currentInput)

      const decreaseButtons = await screen.findAllByTestId<HTMLButtonElement>(
        'decrease-quantity',
      )

      expect(decreaseButtons[0]).toHaveAttribute('disabled')
    })

    it('Should not click increase when the quantity input is equal to product quantity', async () => {
      const mockProducts = [
        product,
        {
          ...product,
          id: '2',
        },
      ]

      const localStorageMock = [
        {
          id: '1',
          quantity: 100,
        },
        {
          id: '2',
          quantity: 1,
        },
      ]

      jest
        .spyOn(Storage.prototype, 'getItem')
        .mockImplementation(jest.fn(() => JSON.stringify(localStorageMock)))

      jest
        .spyOn(httpUtils, 'getProductsByIds')
        .mockImplementation(jest.fn(() => Promise.resolve(mockProducts)))

      render(<Cart />, {
        wrapper: ({ children }) => (
          <ProductsProvider>{children}</ProductsProvider>
        ),
      })

      const quantityInputs = await screen.findAllByTestId<HTMLInputElement>(
        'quantity-input',
      )

      const currentInput = quantityInputs[0]

      fireEvent.blur(currentInput)

      const decreaseButtons = await screen.findAllByTestId<HTMLButtonElement>(
        'increase-quantity',
      )

      expect(decreaseButtons[0]).toHaveAttribute('disabled')
    })

    it('Should quantity input be 1 if the user try to change with a value below 1', async () => {
      const mockProducts = [
        product,
        {
          ...product,
          id: '2',
        },
      ]

      const localStorageMock = [
        {
          id: '1',
          quantity: 100,
        },
        {
          id: '2',
          quantity: 1,
        },
      ]

      jest
        .spyOn(Storage.prototype, 'getItem')
        .mockImplementation(jest.fn(() => JSON.stringify(localStorageMock)))

      jest
        .spyOn(httpUtils, 'getProductsByIds')
        .mockImplementation(jest.fn(() => Promise.resolve(mockProducts)))

      render(<Cart />, {
        wrapper: ({ children }) => (
          <ProductsProvider>{children}</ProductsProvider>
        ),
      })

      const quantityInputs = await screen.findAllByTestId<HTMLInputElement>(
        'quantity-input',
      )

      const currentInput = quantityInputs[0]

      fireEvent.change(currentInput, {
        target: { value: (0).toString() },
      })

      await userEvent.click(currentInput)

      await userEvent.click(document.body)

      const quantityEl =
        screen.getAllByTestId<HTMLInputElement>('quantity-input')

      expect(quantityEl[0].value).toBe('1')
    })

    it('Should quantity input be product.quantity if the user try to change with a value greater than products.quantity', async () => {
      const mockProducts = [
        product,
        {
          ...product,
          id: '2',
        },
      ]

      const localStorageMock = [
        {
          id: '1',
          quantity: 100,
        },
        {
          id: '2',
          quantity: 1,
        },
      ]

      jest
        .spyOn(Storage.prototype, 'getItem')
        .mockImplementation(jest.fn(() => JSON.stringify(localStorageMock)))

      jest
        .spyOn(httpUtils, 'getProductsByIds')
        .mockImplementation(jest.fn(() => Promise.resolve(mockProducts)))

      render(<Cart />, {
        wrapper: ({ children }) => (
          <ProductsProvider>{children}</ProductsProvider>
        ),
      })

      const quantityInputs = await screen.findAllByTestId<HTMLInputElement>(
        'quantity-input',
      )

      const currentInput = quantityInputs[0]

      fireEvent.change(currentInput, {
        target: { value: (mockProducts[0].quantity + 100).toString() },
      })

      await userEvent.click(currentInput)

      await userEvent.click(document.body)

      const quantityEl =
        screen.getAllByTestId<HTMLInputElement>('quantity-input')

      expect(quantityEl[0].value).toBe(mockProducts[0].quantity.toString())
    })
  })

  describe('remove product', () => {
    it('Should remove product', async () => {
      const mockProducts = [
        product,
        {
          ...product,
          id: '2',
        },
      ]

      const localStorageMock = [
        {
          id: '1',
          quantity: 1,
        },
        { id: '2', quantity: 1 },
      ]

      jest
        .spyOn(Storage.prototype, 'getItem')
        .mockImplementation(jest.fn(() => JSON.stringify(localStorageMock)))

      jest
        .spyOn(httpUtils, 'getProductsByIds')
        .mockImplementation(jest.fn(() => Promise.resolve(mockProducts)))
      jest
        .spyOn(httpUtils, 'getCoupons')
        .mockImplementation(jest.fn(() => Promise.resolve([coupon])))

      render(<Cart />, {
        wrapper: ({ children }) => (
          <ProductsProvider>{children}</ProductsProvider>
        ),
      })

      const openRemoveProductDialogButton = await screen.findAllByTestId(
        'open-remove-product-dialog',
      )

      await userEvent.click(openRemoveProductDialogButton[0])

      const actionButton = screen.getByTestId('action-button')

      await userEvent.click(actionButton)

      const productsNumber = await screen.findAllByTestId('product-row')

      expect(productsNumber.length).toBe(1)
    })
  })
})
