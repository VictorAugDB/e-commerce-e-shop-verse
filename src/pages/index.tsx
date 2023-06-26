import Link from 'next/link';
import * as React from 'react';
import { ArrowRight } from 'react-feather';

import ListProducts from '@/components/ListProducts';
import NextImage from '@/components/NextImage';
import Seo from '@/components/Seo';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

export default function HomePage() {
  const categories = [
    "Woman's fashion",
    "Men's Fashion",
    'Electronics',
    'Home & Lifestyle',
    'Medicine',
    'Sports & Outdoor',
    "Baby's & Toys",
    'Groceries & Pets',
    'Health & Beauty',
  ];

  const promotionInfo = {
    imageLogoPath: '/images/promotion-logo.png',
    name: 'iPhone 14 Series',
    description: 'Up to 10% off Voucher',
    imagePath: '/images/promotion-image.png',
    id: '123',
  };

  return (
    <div className='flex flex-col px-[8.4375rem]'>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <div className='flex gap-[2.8125rem]'>
        <nav
          className='
          flex w-full max-w-[13.5625rem] 
          flex-col gap-4 
          border-r border-gray-300
          pr-4 pt-10'
        >
          {categories.map((c) => (
            <p key={c}>{c}</p>
          ))}
        </nav>

        <section
          className='
          mt-10 flex
          h-[21.5rem] w-full 
          max-w-[55.75rem]
          justify-between
          rounded-sm bg-black
          px-16
        '
        >
          <div className='flex flex-col gap-y-5'>
            <div className='mt-14 flex h-14 items-center gap-6'>
              <NextImage
                src={promotionInfo.imageLogoPath}
                width={40}
                height={49}
                alt='promotion-logo'
              ></NextImage>
              <p className='text-white'>{promotionInfo.name}</p>
            </div>
            <span className='max-w-[18.375rem] text-5xl leading-[3.75rem] text-white'>
              {promotionInfo.description}
            </span>
            <div>
              <Link
                className='flex items-center gap-2'
                href={`/products/${promotionInfo.id}`}
              >
                <p className='border-spacing-4 border-b border-white pb-[0.15rem] text-white'>
                  Shop now
                </p>
                <ArrowRight color='#FFFFFF' />
              </Link>
            </div>
          </div>
          <NextImage
            src={promotionInfo.imagePath}
            width={349}
            height={344}
            alt='promotion-image'
          ></NextImage>
        </section>
      </div>
      <ListProducts />
    </div>
  );
}
