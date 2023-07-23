import React, { useRef, useState } from 'react';

import Button from '@/components/buttons/Button';
import Steps from '@/components/Steps';

type Product = {
  id: string;
  image: string;
  price: number;
  quantity: number;
};

type Coupon = {
  name: string;
  minVal: number;
  percentage: number;
  limit: number;
  quantity: number;
};

export default function Cart() {
  const [products, setProducts] = useState<Product[]>([
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
  const [subtotal, setSubtotal] = useState(calculateSubTotal(products));
  // TODO add set state shipping when create the shipping calc
  const [shipping] = useState(calculateShipping());
  const [discounts, setDiscounts] = useState(0);
  const couponRef = useRef<HTMLInputElement>(null);
  const [currentCoupon, setCurrentCoupon] = useState<Coupon | null>(null);

  function calculateShipping() {
    // get user cep and call the API of the shipping service
    return 0;
  }

  function calculateSubTotal(prods: Product[]) {
    return prods.reduce((acc, p) => acc + p.price * p.quantity, 0);
  }

  function handleChangeQuantity(
    event: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) {
    const quantity = Number(event.target.value);

    if (quantity <= 0) {
      // message the user that if he is sure that the want to remove the product
    }

    const updatedProducts =
      quantity > 0
        ? products.map((p) => (p.id === id ? { ...p, quantity } : p))
        : products.filter((p) => p.id !== id);

    setProducts(updatedProducts);

    const newSubtotal = calculateSubTotal(updatedProducts);
    setSubtotal(newSubtotal);

    if (currentCoupon) {
      setDiscounts(
        Math.min(
          currentCoupon.limit,
          (newSubtotal * currentCoupon.percentage) / 100
        )
      );
    }
  }

  function handleApplyDiscount() {
    if (!couponRef.current) {
      return;
    }

    const coupon = couponRef.current.value;
    // call the api to check the coupons
    const availableCoupons = [
      {
        name: 'Shopverse10',
        minVal: 500,
        percentage: 10,
        limit: 200,
        quantity: 10,
      },
    ];

    const couponInfo = availableCoupons.find((ac) => ac.name === coupon);

    if (!couponInfo) {
      // add message saying that the coupon not exists
      return;
    } else {
      if (couponInfo.quantity === 0) {
        // add message saying that the coupon ended
        return;
      }

      if (subtotal < couponInfo.minVal) {
        // add message saying that the subtotal is not enough to apply the coupon
        return;
      }

      // The coupon will be passed to the checkout there when the user pay the quantity will be decreased
      setCurrentCoupon(couponInfo);
      setDiscounts(
        Math.min(couponInfo.limit, (subtotal * couponInfo.percentage) / 100)
      );
    }
  }

  return (
    <div className='px-[8.4375rem]'>
      <Steps flow='buy' currentStep={0} className='py-20' />
      <div className='flex flex-col items-center gap-6'>
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
        <div className='flex w-full items-center justify-between'>
          <Button variant='ghost' className='border border-gray-800 px-12 py-4'>
            Return To Shop
          </Button>
          <Button variant='ghost' className='border border-gray-800 px-12 py-4'>
            Update Cart
          </Button>
        </div>
      </div>
      <div className='flex justify-between pt-20'>
        <div className='flex h-fit items-center gap-4'>
          <input
            ref={couponRef}
            type='text'
            className='rounded border border-gray-800 bg-transparent py-4 pl-6 focus:border-gray-600 focus:ring-green-600'
            placeholder='Coupon here'
          />
          <Button
            onClick={handleApplyDiscount}
            variant='green'
            className='px-12 py-4'
          >
            Apply Coupon
          </Button>
        </div>
        <div className='w-full max-w-[29.375rem] rounded border-[1.5px] border-black px-6 py-8'>
          <h4 className='mb-6'>Cart Total</h4>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between'>
              <p>Subtotal:</p>
              <p>${subtotal}</p>
            </div>
            <span className='h-px w-full bg-gray-400'></span>
            <div className='flex items-center justify-between'>
              <p>Shipping:</p>
              <p>{shipping === 0 ? 'Free' : `$${shipping}`}</p>
            </div>
            <span className='h-px w-full bg-gray-400'></span>
            <div className='flex items-center justify-between'>
              <p>Discounts:</p>
              <p>${discounts}</p>
            </div>
            <span className='h-px w-full bg-gray-400'></span>

            <div className='flex items-center justify-between'>
              <p>Total:</p>
              <p>${subtotal + shipping - discounts}</p>
            </div>
            <Button variant='green' className='mx-auto w-fit px-12 py-4'>
              Proceed to checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
