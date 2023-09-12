import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  coupon,
  CouponMockHelper,
  LocalStorageMockHelper,
  ProductMockHelper,
  setupCart,
} from '@/__tests__/pages/cart/mocks'

jest.mock('@/lib/http')
jest.mock('next/navigation')
jest.mock('@/lib/shipping')

describe('Cart functionalities - coupon', () => {
  it('Should apply coupon', async () => {
    const productsMock = new ProductMockHelper([{}, {}]).products
    const localStorageMock = new LocalStorageMockHelper([{}, {}]).items
    const couponMock = new CouponMockHelper([{}]).coupons

    setupCart(productsMock, localStorageMock, couponMock)

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
    const productsMock = new ProductMockHelper([{}]).products
    const localStorageMock = new LocalStorageMockHelper([{ quantity: 100 }])
      .items
    const couponMock = new CouponMockHelper([{}]).coupons

    setupCart(productsMock, localStorageMock, couponMock)

    const input = await screen.findByPlaceholderText<HTMLInputElement>(
      /coupon here/i,
    )
    await userEvent.type(input, coupon.name)

    await userEvent.click(screen.getByText(/apply coupon/i))

    const discountEl = screen.getByTestId('discount-val')

    expect(discountEl.textContent).toBe(`$${coupon.limit}`)
  })

  it('Should should remove discount when the subtotal turns less than the coupon minVal and add again when the subtotal exceeds the minVal', async () => {
    const productsMock = new ProductMockHelper([{ price: 200 }, { price: 200 }])
      .products
    const localStorageMock = new LocalStorageMockHelper([{ quantity: 2 }, {}])
      .items
    const couponMock = new CouponMockHelper([{}]).coupons

    setupCart(productsMock, localStorageMock, couponMock)

    const input = await screen.findByPlaceholderText<HTMLInputElement>(
      /coupon here/i,
    )
    await userEvent.type(input, coupon.name)

    await userEvent.click(screen.getByText(/apply coupon/i))

    const discountBeforeDecrease = screen.getByTestId('discount-val')

    expect(discountBeforeDecrease.textContent).toBe('$60')

    const decreaseButtons = await screen.findAllByTestId<HTMLButtonElement>(
      'decrease-quantity',
    )

    await userEvent.click(decreaseButtons[0])

    const discountAftereDecrease = screen.getByTestId('discount-val')

    expect(discountAftereDecrease.textContent).toBe('$0')

    const increaseButtons = await screen.findAllByTestId<HTMLButtonElement>(
      'increase-quantity',
    )

    await userEvent.click(increaseButtons[0])

    const discountAftereIncrease = screen.getByTestId('discount-val')

    expect(discountAftereIncrease.textContent).toBe('$60')
  })
})
