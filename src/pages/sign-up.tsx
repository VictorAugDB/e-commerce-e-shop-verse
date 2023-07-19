import Link from 'next/link';

import Button from '@/components/buttons/Button';
import NextImage from '@/components/NextImage';

export default function signUp() {
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
      <div className='flex w-max flex-col gap-12'>
        <div className='flex flex-col gap-6 pr-[3.4375rem]'>
          <h1>Create an account</h1>
          <p>Enter your details below</p>
        </div>
        <div className='flex flex-col gap-10'>
          <InputBorderBottom placeholder='Name' />
          <InputBorderBottom placeholder='E-mail Phone Number' />
          <InputBorderBottom placeholder='Password' />
        </div>
        <div className='flex flex-col gap-8'>
          <div className='flex flex-col gap-4'>
            <Button variant='green' className='flex w-full justify-center py-4'>
              Create Account
            </Button>
            <Button
              variant='ghost'
              className='flex w-full justify-center gap-4 rounded border border-gray-600 py-4'
            >
              <img src='/images/google-icon.png' alt='' />
              Sign up with Google
            </Button>
          </div>
          <div className='flex justify-center gap-4'>
            <p>Already have account?</p>
            <Link
              href='/sign-in'
              className='border-b border-transparent pb-1 font-medium text-gray-800 transition hover:border-gray-800 hover:font-semibold'
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

type InputProps = {
  placeholder: string;
};

export function InputBorderBottom({ placeholder }: InputProps) {
  return (
    <div className='border-b border-gray-600 transition focus-within:border-green-700'>
      <input
        type='text'
        className='w-full border-0 bg-transparent p-0 pb-2 outline-none focus:ring-0'
        placeholder={placeholder}
      />
    </div>
  );
}
