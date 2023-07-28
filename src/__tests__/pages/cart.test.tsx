import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as httpUtils from '@/lib/http';

import Cart from '@/pages/cart';

const product = {
  id: '1',
  image: '/images/monitor.png',
  price: 650,
  quantity: 1,
};

const coupon = {
  name: 'shopverse10',
  minVal: 500,
  percentage: 10,
  limit: 200,
  quantity: 10,
};

jest.mock('@/lib/http');

describe('Cart functionalities', () => {
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
    ];

    jest
      .spyOn(httpUtils, 'getProducts')
      .mockImplementation(jest.fn(() => Promise.resolve(mockData)));

    render(<Cart />);

    const subtotal = mockData[0].quantity * product.price;
    const el = await screen.findByText(new RegExp(subtotal.toString()));

    expect(el).toBeInTheDocument();
  });

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
    ];

    jest
      .spyOn(httpUtils, 'getProducts')
      .mockImplementation(jest.fn(() => Promise.resolve(mockData)));

    render(<Cart />);

    const subtotal = 68 * product.price;
    const el = await screen.findAllByText(new RegExp(subtotal.toString()));

    expect(el.length).toBe(2);
  });

  it('Should apply discount', async () => {
    const mockProducts = [
      product,
      {
        ...product,
        id: '2',
      },
    ];

    jest
      .spyOn(httpUtils, 'getProducts')
      .mockImplementation(jest.fn(() => Promise.resolve(mockProducts)));
    jest
      .spyOn(httpUtils, 'getCoupons')
      .mockImplementation(jest.fn(() => Promise.resolve([coupon])));

    render(<Cart />);

    const input = await screen.findByPlaceholderText<HTMLInputElement>(
      /coupon here/i
    );
    await userEvent.type(input, coupon.name);

    await userEvent.click(screen.getByText(/apply coupon/i));

    const discount = 130;
    const total = 1170;
    const discountEl = screen.getByTestId('discount-val');
    const totalEl = screen.getByTestId('total-val');

    expect(discountEl.textContent).toBe(`$${discount}`);
    expect(totalEl.textContent).toBe(`$${total}`);
  });
});
