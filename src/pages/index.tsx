import Link from 'next/link';
import * as React from 'react';
import { ArrowRight } from 'react-feather';
import { IconType } from 'react-icons';
import { AiOutlineCamera } from 'react-icons/ai';
import { BsPhone, BsSmartwatch } from 'react-icons/bs';
import { FiHeadphones } from 'react-icons/fi';
import { HiOutlineDesktopComputer } from 'react-icons/hi';
import { LuGamepad } from 'react-icons/lu';

import Button from '@/components/buttons/Button';
import Divider from '@/components/Divider';
import Categories from '@/components/lists/Categories';
import ListProducts from '@/components/lists/ListProducts';
import NextImage from '@/components/NextImage';
import Seo from '@/components/Seo';

export type CategoriesWithIcons = {
  name: string;
  icon: IconType;
};

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

  const categoriesWithIcons: CategoriesWithIcons[] = [
    {
      name: 'Phones',
      icon: BsPhone,
    },
    {
      name: 'Computers',
      icon: HiOutlineDesktopComputer,
    },
    {
      name: 'SmartWatch',
      icon: BsSmartwatch,
    },
    {
      name: 'Camera',
      icon: AiOutlineCamera,
    },
    {
      name: 'HeadPhones',
      icon: FiHeadphones,
    },
    {
      name: 'Gaming',
      icon: LuGamepad,
    },
  ];

  const promotionInfo = {
    imageLogoPath: '/images/promotion-logo.png',
    name: 'iPhone 14 Series',
    description: 'Up to 10% off Voucher',
    imagePath: '/images/promotion-image.png',
    id: '123',
  };

  return (
    <div className='flex flex-col items-center gap-20 px-[8.4375rem]'>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <div className='flex w-full gap-[2.8125rem]'>
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
      <ListProducts
        topic="Today's"
        title='Flash Sales'
        hasTimer={true}
        hasButton={true}
      />
      <Divider />
      <Categories categories={categoriesWithIcons} />
      <Divider />
      <ListProducts
        topic='This Month'
        title='Best Selling Products'
        hasTimer={true}
        hasButton={true}
      />
      <div className='grid h-[31.25rem] grid-cols-2 gap-7 bg-black px-14 py-[4.3125rem]'>
        <div className='flex flex-col'>
          <p className='text-brown-300 mb-7 font-semibold'>Categories</p>
          <h1 className='h0 mb-8 text-white'>Enhance Your Music Experience</h1>
          <div className='mb-8 flex items-center gap-10'>
            <div className='flex h-[3.875rem] w-[3.875rem] flex-col items-center justify-center rounded-full bg-white text-center'>
              <p className='font-semibold'>23</p>
              <p className='text-xs'>Hours</p>
            </div>
            <div className='flex h-[3.875rem] w-[3.875rem] flex-col items-center justify-center rounded-full bg-white text-center'>
              <p className='font-semibold'>05</p>
              <p className='text-xs'>Days</p>
            </div>
            <div className='flex h-[3.875rem] w-[3.875rem] flex-col items-center justify-center rounded-full bg-white text-center'>
              <p className='font-semibold'>59</p>
              <p className='text-xs'>Minutes</p>
            </div>
            <div className='flex h-[3.875rem] w-[3.875rem] flex-col items-center justify-center rounded-full bg-white text-center'>
              <p className='font-semibold'>35</p>
              <p className='text-xs'>Seconds</p>
            </div>
          </div>
          <Button className='w-fit px-12 py-4'>Buy Now!</Button>
        </div>
        <div className='relative flex items-center justify-center rounded-full'>
          <div className='absolute h-1 w-1 rounded-full shadow-[0_35px_200px_150px] shadow-gray-400'></div>

          <NextImage
            alt='product-image'
            src='/images/jbl-radio.png'
            sizes='100vw'
            fill
            style={{
              objectFit: 'contain',
              width: '100%',
            }}
          ></NextImage>
        </div>
      </div>
      <ListProducts
        topic='This Month'
        title='Best Selling Products'
        hasTimer={true}
        hasButton={true}
      />
    </div>
  );
}
