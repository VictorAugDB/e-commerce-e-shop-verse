import React, { useState } from 'react';

export default function Cart() {
  const [products, setProducts] = useState([
    {
      id: '1',
      image: '/images/monitor.png',
      price: 650,
      quantity: 1,
    },
    {
      id: '2',
      image: '/images/monitor.png',
      price: 650,
      quantity: 1,
    },
  ]);

  function handleChangeQuantity(
    event: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) {
    const value = Number(event.target.value);

    setProducts(
      products.map((p) => (p.id === id ? { ...p, quantity: value } : p))
    );
  }

  return (
    <div className='flex flex-col items-center px-[8.4375rem]'>
      <table className='w-full table-fixed'>
        <thead className='hidden bg-white md:table-header-group'>
          <tr className='rounded'>
            <th className='rounded py-6 pl-10 text-center'>Product</th>
            <th className='py-6 text-center'>Price</th>
            <th className='py-6 text-center'>Quantity</th>
            <th className='rounded py-6 pr-10 text-center'>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <React.Fragment key={product.id}>
              <tr className='h-10'></tr>
              <tr className='rounded bg-white'>
                <td
                  className='rounded py-10 pl-10 text-center align-middle before:content-[attr(data-heading)] md:before:content-[]'
                  data-heading='Product: '
                >
                  <img
                    alt='product-image'
                    src={product.image}
                    className='mr-[1.375rem] inline-block h-[2.8125rem] w-[3.125rem]'
                  ></img>
                  LCD Monitor
                </td>
                <td
                  className='py-10 text-center before:content-[attr(data-heading)] md:before:content-[]'
                  data-heading='Price: '
                >
                  ${product.price}
                </td>
                <td
                  className='py-10 text-center before:content-[attr(data-heading)] md:before:content-[]'
                  data-heading='Quantity: '
                >
                  <input
                    type='number'
                    value={product.quantity}
                    onChange={(e) => handleChangeQuantity(e, product.id)}
                    className='w-[4.5rem] rounded border border-gray-600 py-[.375rem]'
                  />
                </td>
                <td
                  className='rounded py-10 pr-10 text-center before:content-[attr(data-heading)] md:before:content-[]'
                  data-heading='Subtotal: '
                >
                  ${product.price * product.quantity}
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
