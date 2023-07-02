import { Eye, Heart } from 'react-feather';

import Button from '@/components/buttons/Button';
import NextImage from '@/components/NextImage';

type ProductProps = {
  hasButton?: boolean;
  imagePath: string;
  discount?: number;
  price: number;
  numberOfStars: number;
};

export default function Product({
  imagePath,
  hasButton = false,
  discount,
  price,
  numberOfStars,
}: ProductProps) {
  const stars = new Array(5)
    .fill(0)
    .map((star, i) =>
      i < numberOfStars && (numberOfStars - i >= 1 || numberOfStars % 1 === 0)
        ? 2
        : i < numberOfStars && numberOfStars % 1 !== 0
        ? 1
        : 0
    );

  return (
    <div className='flex w-full max-w-[16.875rem] flex-col gap-4'>
      <div className='relative flex h-[15.625rem] w-full flex-col items-center justify-end gap-[14px]'>
        {discount && (
          <div className='absolute left-3 top-3 w-fit rounded bg-green-700 px-3 py-1 text-xs text-white'>
            -{discount}%
          </div>
        )}
        <div className='absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white'>
          <Heart className='h-[1.125rem] w-[1.125rem]' />
        </div>
        <div className='absolute right-3 top-11 mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-white'>
          <Eye className='h-[1.125rem] w-[1.125rem]' />
        </div>
        <div className='relative h-[70%] w-[60%] p-8'>
          <NextImage
            alt='product-image'
            src={imagePath}
            sizes='100vw'
            fill
            style={{
              objectFit: 'contain',
              width: '100%',
            }}
          ></NextImage>
        </div>
        {hasButton && (
          <Button
            variant='dark'
            className='flex w-full justify-center rounded-t-none'
          >
            Add To Cart
          </Button>
        )}
      </div>
      <div className='flex flex-col gap-2'>
        <p className='font-medium'>Havit HV-G92 Gamepad</p>
        <div className='flex items-center gap-3'>
          {discount ? (
            <>
              <p className='font-medium text-green-700'>
                ${price - (40 * price) / 100}
              </p>
              <p className='font-medium text-gray-500 line-through'>${price}</p>
            </>
          ) : (
            <p className='font-medium text-green-700'>${price}</p>
          )}
        </div>
        <div className='flex items-center'>
          {stars.map(
            (
              star,
              i // Using index because this will not be changed by state
            ) => (
              <NextImage
                key={i}
                alt='star'
                src={
                  star === 0
                    ? '/images/unfilled-star.png'
                    : star === 1
                    ? '/images/half-filled-star.png'
                    : '/images/star.png'
                }
                width={20}
                height={20}
              ></NextImage>
            )
          )}
          <p className='ml-2 font-semibold text-gray-500'>(88)</p>
        </div>
      </div>
    </div>
  );
}
