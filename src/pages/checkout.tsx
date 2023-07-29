import { useRouter } from 'next/router';

import InputBorderBottom from '@/components/InputBorderBottom';
import Steps from '@/components/Steps';

export default function Checkout() {
  const from = useRouter().query.from;
  const shipping = 0;
  const discounts = 0;
  const subtotal = 1750;
  const total = 1750;

  return (
    <div className='px-[8.4375rem]'>
      {from === 'cart' ? (
        <Steps flow='buy' currentStep={0} className='py-20' />
      ) : (
        <Steps flow='buy' currentStep={0} className='py-20' />
      )}
      <h1>Billing Details</h1>
      <div className='mt-10 grid grid-cols-2 gap-4'>
        <div className='flex max-w-[28.1875rem] flex-col gap-6'>
          <InputBorderBottom
            name='first-name'
            id='first-name'
            placeholder='First Name'
          />
          <InputBorderBottom
            name='company-name'
            id='company-name'
            placeholder='Company Name. (optional)'
          />
          <InputBorderBottom
            name='stree-address'
            id='stree-address'
            placeholder='Street Address'
          />
          <InputBorderBottom
            name='apartment'
            id='apartment'
            placeholder='Apartment, floor, etc. (optional)'
          />
          <InputBorderBottom
            name='town/city'
            id='town/city'
            placeholder='Town/City'
          />
          <InputBorderBottom
            name='phone-number'
            id='phone-number'
            placeholder='Phone Number'
          />
          <InputBorderBottom name='e-mail' id='e-mail' placeholder='E-mail' />
        </div>
        <div className='flex flex-col gap-8'>
          <div className='flex max-w-[26.5625rem] flex-col gap-8'>
            <ProductDetails
              imagePath='/images/monitor.png'
              name='LCD Monitor'
              price={650}
            />
            <ProductDetails
              imagePath='/images/monitor.png'
              name='LCD Monitor'
              price={650}
            />
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
                <p>${total}</p>
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <input
                type='radio'
                id='bank'
                name='payment-type'
                className='h-6 w-6 text-black ring-black checked:border-2 checked:bg-none checked:ring checked:ring-inset checked:ring-offset-[3px]'
              />
              <label htmlFor='bank'>Bank</label>
            </div>
            <div className='flex items-center gap-4'>
              <input
                type='radio'
                id='cash'
                name='payment-type'
                className='h-6 w-6 text-black ring-black checked:border-2 checked:bg-none checked:ring checked:ring-inset checked:ring-offset-[3px]'
              />
              <label htmlFor='cash'>Cash on delivery</label>
            </div>
          </div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

type ProductDetailsProps = {
  imagePath: string;
  name: string;
  price: number;
};

function ProductDetails({ imagePath, name, price }: ProductDetailsProps) {
  return (
    <div className='flex items-center justify-between text-center'>
      <div className='flex items-center gap-6 text-center'>
        <img
          alt='product-image'
          src={imagePath}
          className='inline-block h-[2.8125rem] w-[3.125rem]'
        ></img>
        {name}
      </div>
      <div className='text-center'>${price}</div>
    </div>
  );
}
