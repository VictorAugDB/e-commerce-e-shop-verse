import Link from 'next/link';
import * as React from 'react';
import { Heart, Search, ShoppingCart } from 'react-feather';

import UnstyledLink from '@/components/links/UnstyledLink';

const links = [
  { href: '/', label: 'Home' },
  { href: '/contact', label: 'Contact' },
  { href: '/about', label: 'About' },
  { href: '/sign-up', label: 'Sign Up' },
];

export default function Header() {
  return (
    <header className='sticky top-0 z-50 border-b border-gray-300 bg-white'>
      <div className='flex h-14 items-center justify-between px-[8.4375rem]'>
        <Link href='/' className='text-lg font-bold md:text-2xl'>
          E-Shopverse
        </Link>
        <nav>
          <ul className='flex items-center justify-between gap-x-12'>
            {links.map(({ href, label }) => (
              <li key={`${href}${label}`}>
                <UnstyledLink
                  href={href}
                  data-home={label === 'Home'}
                  className='text-base hover:text-gray-600 data-[home=true]:border-b data-[home=true]:border-gray-500'
                >
                  {label}
                </UnstyledLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className='flex items-center gap-6'>
          <div className='flex items-center gap-[2.375rem]'>
            <input
              type='text'
              placeholder='What are you looking for?'
              className='w-full rounded border-0 text-xs'
            />
            <Search />
          </div>
          <div className='flex items-center gap-6'>
            <Heart />
            <Link href='/cart'>
              <ShoppingCart />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
