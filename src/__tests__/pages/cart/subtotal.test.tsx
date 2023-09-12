import { screen, waitFor } from '@testing-library/react'

import {
  LocalStorageMockHelper,
  product,
  ProductMockHelper,
  setupCart,
} from '@/__tests__/pages/cart/mocks'

jest.mock('@/lib/http')
jest.mock('next/navigation')
jest.mock('@/lib/shipping')

describe('Cart functionalities - subtotal', () => {
  it('Should render product subtotal correctly', async () => {
    const productsMock = new ProductMockHelper([{}, {}]).products
    const localStorageMock = new LocalStorageMockHelper([
      { quantity: 67 },
      { quantity: 1 },
    ]).items

    setupCart(productsMock, localStorageMock)

    const subtotal = localStorageMock[0].quantity * product.price
    const el = await screen.findAllByTestId('product-subtotal-val')

    expect(el[0].textContent).toBe(`$${subtotal}`)
  })

  it('Should render cart subtotal and total correctly', async () => {
    const productsMock = new ProductMockHelper([{}, {}]).products
    const localStorageMock = new LocalStorageMockHelper([
      { quantity: 67 },
      { quantity: 1 },
    ]).items

    setupCart(productsMock, localStorageMock)

    const subtotal = 68 * product.price

    await waitFor(() => {
      const subtotalEl = screen.getByTestId('cart-subtotal-val')
      const totalEl = screen.getByTestId('total-val')
      expect(subtotalEl.textContent).toBe(`$${subtotal}`)
      expect(totalEl.textContent).toBe(`$${subtotal}`)
    })
  })
})
