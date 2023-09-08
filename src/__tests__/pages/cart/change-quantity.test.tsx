import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  LocalStorageMockHelper,
  ProductMockHelper,
  setupCart,
} from '@/__tests__/pages/cart/mocks'

jest.mock('@/lib/http')
jest.mock('next/navigation')

describe('Cart functionalities - change-quantity', () => {
  it('Should increase product quantity', async () => {
    const productsMock = new ProductMockHelper([{}, {}]).products
    const localStorageMock = new LocalStorageMockHelper([{}, {}]).items

    setupCart(productsMock, localStorageMock)

    const increaseButtons = await screen.findAllByTestId<HTMLButtonElement>(
      'increase-quantity',
    )

    await userEvent.click(increaseButtons[0])

    const cartSubtotalEl = screen.getByTestId('cart-subtotal-val')
    const productSubtotalEl = screen.getAllByTestId('product-subtotal-val')
    const quantityEl = screen.getAllByTestId<HTMLInputElement>('quantity-input')
    const totalEl = screen.getByTestId('total-val')

    expect(productSubtotalEl[0].textContent).toBe(`$${1300}`)
    expect(productSubtotalEl[1].textContent).toBe(`$${650}`)
    expect(quantityEl[0].value).toBe('2')
    expect(quantityEl[1].value).toBe('1')
    expect(cartSubtotalEl.textContent).toBe(`$${1950}`)
    expect(totalEl.textContent).toBe(`$${1950}`)
  })

  it('Should decrease product quantity', async () => {
    const productsMock = new ProductMockHelper([{}, {}]).products
    const localStorageMock = new LocalStorageMockHelper([{ quantity: 2 }, {}])
      .items

    setupCart(productsMock, localStorageMock)

    const decreaseButtons = await screen.findAllByTestId<HTMLButtonElement>(
      'decrease-quantity',
    )

    await userEvent.click(decreaseButtons[0])

    const cartSubtotalEl = screen.getByTestId('cart-subtotal-val')
    const productSubtotalEl = screen.getAllByTestId('product-subtotal-val')
    const quantityEl = screen.getAllByTestId<HTMLInputElement>('quantity-input')
    const totalEl = screen.getByTestId('total-val')

    expect(productSubtotalEl[0].textContent).toBe(`$${650}`)
    expect(quantityEl[0].value).toBe('1')
    expect(cartSubtotalEl.textContent).toBe(`$${1300}`)
    expect(totalEl.textContent).toBe(`$${1300}`)
  })

  it('Should change quantity manually on press enter', async () => {
    const productsMock = new ProductMockHelper([{}, {}]).products
    const localStorageMock = new LocalStorageMockHelper([{}, {}]).items

    setupCart(productsMock, localStorageMock)

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
    const quantityEl = screen.getAllByTestId<HTMLInputElement>('quantity-input')
    const totalEl = screen.getByTestId('total-val')

    expect(productSubtotalEl[0].textContent).toBe(`$${1300}`)
    expect(productSubtotalEl[1].textContent).toBe(`$${650}`)
    expect(quantityEl[0].value).toBe('2')
    expect(quantityEl[1].value).toBe('1')
    expect(cartSubtotalEl.textContent).toBe(`$${1950}`)
    expect(totalEl.textContent).toBe(`$${1950}`)
  })

  it('Should change quantity manually on click outside input', async () => {
    const productsMock = new ProductMockHelper([{}, {}]).products
    const localStorageMock = new LocalStorageMockHelper([{}, {}]).items

    setupCart(productsMock, localStorageMock)

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
    const quantityEl = screen.getAllByTestId<HTMLInputElement>('quantity-input')
    const totalEl = screen.getByTestId('total-val')

    expect(productSubtotalEl[0].textContent).toBe(`$${1300}`)
    expect(productSubtotalEl[1].textContent).toBe(`$${650}`)
    expect(quantityEl[0].value).toBe('2')
    expect(quantityEl[1].value).toBe('1')
    expect(cartSubtotalEl.textContent).toBe(`$${1950}`)
    expect(totalEl.textContent).toBe(`$${1950}`)
  })

  it('Should not click decrease when the quantity input is equal to 1', async () => {
    const productsMock = new ProductMockHelper([{}, {}]).products
    const localStorageMock = new LocalStorageMockHelper([{}, {}]).items

    setupCart(productsMock, localStorageMock)

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
    const productsMock = new ProductMockHelper([{}, {}]).products
    const localStorageMock = new LocalStorageMockHelper([{ quantity: 100 }, {}])
      .items

    setupCart(productsMock, localStorageMock)

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
    const productsMock = new ProductMockHelper([{}, {}]).products
    const localStorageMock = new LocalStorageMockHelper([{ quantity: 100 }, {}])
      .items

    setupCart(productsMock, localStorageMock)

    const quantityInputs = await screen.findAllByTestId<HTMLInputElement>(
      'quantity-input',
    )

    const currentInput = quantityInputs[0]

    fireEvent.change(currentInput, {
      target: { value: (0).toString() },
    })

    await userEvent.click(currentInput)

    await userEvent.click(document.body)

    const quantityEl = screen.getAllByTestId<HTMLInputElement>('quantity-input')

    expect(quantityEl[0].value).toBe('1')
  })

  it('Should quantity input be product.quantity if the user try to change with a value greater than products.quantity', async () => {
    const productsMock = new ProductMockHelper([{}, {}]).products
    const localStorageMock = new LocalStorageMockHelper([{ quantity: 100 }, {}])
      .items

    setupCart(productsMock, localStorageMock)

    const quantityInputs = await screen.findAllByTestId<HTMLInputElement>(
      'quantity-input',
    )

    const currentInput = quantityInputs[0]

    fireEvent.change(currentInput, {
      target: { value: (500).toString() },
    })

    await userEvent.click(currentInput)

    await userEvent.click(document.body)

    const quantityEl = screen.getAllByTestId<HTMLInputElement>('quantity-input')

    expect(quantityEl[0].value).toBe('100')
  })
})
