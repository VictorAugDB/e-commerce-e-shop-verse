'use client'

import * as Tabs from '@radix-ui/react-tabs'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Heart, Search, ShoppingCart } from 'react-feather'

import UnstyledLink from '@/components/links/UnstyledLink'

const links = [
  { href: '/', label: 'Home' },
  { href: '/contact', label: 'Contact' },
  { href: '/about', label: 'About' },
  { href: '/sign-up', label: 'Sign Up' },
]

export default function Header() {
  const pathname = useRouter().pathname
  const [currentTab, setCurrentTab] = useState(
    pathname !== '/' ? pathname.slice(1) : 'home',
  )

  function handleChangeTab(tab: string) {
    setCurrentTab(tab.toLowerCase())
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-300 bg-white">
      <Tabs.Root className="flex h-14 items-center px-[8.4375rem]">
        <Link
          href="/"
          className="whitespace-nowrap pr-[12.5rem] text-lg font-bold md:text-2xl"
        >
          E-Shopverse
        </Link>
        <Tabs.List className="flex w-full items-center justify-between gap-x-12">
          {links.map(({ href, label }) => (
            <Tabs.Trigger
              data-state={
                currentTab === label.toLowerCase() ? 'active' : 'inactive'
              }
              value={label}
              key={`${href}${label}`}
              className="relative data-[state=active]:font-semibold"
            >
              <>
                <UnstyledLink
                  href={href}
                  className="text-base transition hover:text-gray-600"
                  onClick={() => handleChangeTab(label)}
                >
                  {label}
                </UnstyledLink>
                {currentTab === label.toLowerCase() && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute h-px w-full bg-gray-600"
                  ></motion.div>
                )}
              </>
            </Tabs.Trigger>
          ))}

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-[2.375rem]">
              <input
                type="text"
                placeholder="What are you looking for?"
                className="w-full rounded border-0 text-xs"
              />
              <Search />
            </div>
            <div className="flex items-center gap-6">
              <Tabs.Trigger
                onClick={() => handleChangeTab('wishlist')}
                data-state={currentTab === 'wishlist' ? 'active' : 'inactive'}
                value="wishlist"
                className="relative"
              >
                <Heart
                  className="transition hover:stroke-gray-600"
                  strokeWidth={currentTab === 'wishlist' ? 2.5 : 2}
                />
                {currentTab === 'wishlist' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-0.5 h-px w-full bg-gray-600"
                  ></motion.div>
                )}
              </Tabs.Trigger>
              <Tabs.Trigger
                onClick={() => handleChangeTab('cart')}
                data-state={currentTab === 'cart' ? 'active' : 'inactive'}
                value="cart"
                className="relative"
              >
                <Link href="/cart">
                  <ShoppingCart
                    className="transition hover:stroke-gray-600"
                    strokeWidth={currentTab === 'cart' ? 2.5 : 2}
                  />
                </Link>
                {currentTab === 'cart' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-0.5 h-px w-full bg-gray-600"
                  ></motion.div>
                )}
              </Tabs.Trigger>
            </div>
          </div>
        </Tabs.List>
      </Tabs.Root>
    </header>
  )
}
