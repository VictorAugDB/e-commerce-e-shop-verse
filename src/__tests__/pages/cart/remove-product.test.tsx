import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  LocalStorageMockHelper,
  ProductMockHelper,
  setupCart,
} from '@/__tests__/pages/cart/mocks'

jest.mock('@/lib/http')
jest.mock('next/navigation')
jest.mock('@/lib/shipping')

describe('Cart functionalities - remove-product', () => {
  it('Should remove product', async () => {
    const productsMock = new ProductMockHelper([{}, {}]).products
    const localStorageMock = new LocalStorageMockHelper([{}, {}]).items

    setupCart(productsMock, localStorageMock)

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
