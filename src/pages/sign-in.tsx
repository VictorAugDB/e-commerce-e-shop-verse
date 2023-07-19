import Link from 'next/link';

import Button from '@/components/buttons/Button';
import NextImage from '@/components/NextImage';

import { InputBorderBottom } from '@/pages/sign-up';

export default function SignIn() {
  return (
    <div className='grid grid-cols-2 gap-32 pt-[3.75rem]'>
      <div className='h-[48.8125rem] bg-green-50'>
        <div className='relative h-[44.125rem]'>
          <NextImage
            alt='product-image'
            src='/images/cart-cellphone.png'
            fill
          ></NextImage>
        </div>
      </div>
      <div className='flex w-max flex-col justify-center gap-12'>
        <div className='flex flex-col gap-6 pr-[2.75rem]'>
          <h1>Log in to E-Shopverse</h1>
          <p>Enter your details below</p>
        </div>
        <div className='flex flex-col gap-10'>
          <InputBorderBottom placeholder='E-mail Phone Number' />
          <InputBorderBottom placeholder='Password' />
        </div>
        <div className='flex flex-col gap-8'>
          <div className='flex items-center justify-between gap-4'>
            <Button variant='green' className='flex justify-center px-12 py-4'>
              Log In
            </Button>
            <Link
              href='/reset-password'
              className='border-b border-transparent pb-1 transition hover:border-gray-800 hover:font-semibold'
            >
              Forget Password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
