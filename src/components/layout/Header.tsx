import * as React from 'react';

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
      <div className='layout flex h-14 items-center justify-around'>
        <h3 className='font-bold'>Exclusive</h3>
        <nav>
          <ul className='flex items-center justify-between gap-x-12'>
            {links.map(({ href, label }) => (
              <li key={`${href}${label}`}>
                <UnstyledLink
                  href={href}
                  className={`text-base hover:text-gray-600 ${
                    label === 'Home' && 'border-b border-gray-500'
                  }`}
                >
                  {label}
                </UnstyledLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
