import { Eye, Heart } from 'react-feather';

import Button from '@/components/buttons/Button';
import NextImage from '@/components/NextImage';

export default function Product() {
  return (
    <div className='flex w-full max-w-[16.875rem] flex-col gap-4'>
      <div className='relative flex h-[15.625rem] w-full flex-col items-center justify-end gap-[14px]'>
        <div className='absolute left-3 top-3 w-fit rounded bg-green-700 px-3 py-1 text-xs text-white'>
          -40%
        </div>
        <div className='absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white'>
          <Heart className='h-[1.125rem] w-[1.125rem]' />
        </div>
        <div className='absolute right-3 top-11 mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-white'>
          <Eye className='h-[1.125rem] w-[1.125rem]' />
        </div>
        <NextImage
          alt='product-image'
          src='/images/control.png'
          width={172}
          height={152}
        ></NextImage>
        <Button
          variant='dark'
          className='flex w-full justify-center rounded-t-none'
        >
          Add To Cart
        </Button>
      </div>
      <div className='flex flex-col gap-2'>
        <p className='font-medium'>Havit HV-G92 Gamepad</p>
        <div className='flex items-center gap-3'>
          <p className='font-medium text-green-700'>$120</p>
          <p className='font-medium text-gray-500 line-through'>$160</p>
        </div>
        <div className='flex items-center'>
          <NextImage
            alt='star'
            src='/images/star.png'
            width={20}
            height={20}
          ></NextImage>
          <NextImage
            alt='star'
            src='/images/star.png'
            width={20}
            height={20}
          ></NextImage>
          <NextImage
            alt='star'
            src='/images/star.png'
            width={20}
            height={20}
          ></NextImage>
          <NextImage
            alt='star'
            src='/images/star.png'
            width={20}
            height={20}
          ></NextImage>
          <NextImage
            alt='star'
            src='/images/star.png'
            width={20}
            height={20}
          ></NextImage>
          <p className='ml-2 font-semibold text-gray-500'>(88)</p>
        </div>
      </div>
    </div>
  );
}
