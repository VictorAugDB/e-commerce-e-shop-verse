import { Eye, Heart } from 'react-feather';

import NextImage from '@/components/NextImage';

const endDate = new Date();
endDate.setDate(endDate.getDate() + 3);

export default function ListProducts() {
  const currentDate = new Date(endDate.getTime() - new Date().getTime());
  const remainingDays = currentDate.getDate();
  const remainingHours = currentDate.getHours();
  const remainingMinutes = currentDate.getMinutes();
  const remainingSeconds = currentDate.getSeconds();

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex items-center'>
        <span></span>
        <p className='font-medium text-green-700'>Today's</p>
      </div>
      <div className='flex gap-20'>
        <h1>Flash Sales</h1>
        <div className='flex items-center gap-4'>
          <div>
            <span className='block text-xs leading-[1.125rem]'>Days</span>
            <div className='flex gap-x-4'>
              <span className='text-[2rem] leading-[1.875rem]'>
                {remainingDays}
              </span>
              <span className='text-[2rem] leading-[1.875rem]'>:</span>
            </div>
          </div>
          <div>
            <span className='block text-xs leading-[1.125rem]'>Hours</span>
            <div className='flex gap-x-4'>
              <span className='text-[2rem] leading-[1.875rem]'>
                {remainingHours}
              </span>
              <span className='text-[2rem] leading-[1.875rem]'>:</span>
            </div>
          </div>
          <div>
            <span className='block text-xs leading-[1.125rem]'>Minutes</span>
            <div className='flex gap-x-4'>
              <span className='text-[2rem] leading-[1.875rem]'>
                {remainingMinutes}
              </span>
              <span className='text-[2rem] leading-[1.875rem]'>:</span>
            </div>
          </div>
          <div>
            <span className='block text-xs leading-[1.125rem]'>Seconds</span>
            <span className='block text-[2rem] leading-[1.875rem]'>
              {remainingSeconds}
            </span>
          </div>
        </div>
      </div>
      <div className='flex w-fit flex-col gap-4'>
        <div className='relative'>
          <div className='w-fit rounded bg-green-700 px-3 py-1 text-xs leading-[1.125rem] text-white'>
            -40%
          </div>
          <div className='absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-white'>
            <Heart className='h-[1.125rem] w-[1.125rem]' />
          </div>
          <div className='absolute right-0 mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-white'>
            <Eye className='h-[1.125rem] w-[1.125rem]' />
          </div>
          <NextImage
            alt='product-image'
            src='/images/control.png'
            width={172}
            height={152}
          ></NextImage>
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
    </div>
  );
}
