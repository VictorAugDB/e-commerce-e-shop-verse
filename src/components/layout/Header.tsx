'use client'

import * as Tabs from '@radix-ui/react-tabs'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Heart, Menu, Search, ShoppingCart } from 'react-feather'

import UnstyledLink from '@/components/links/UnstyledLink'

const links = [
  { href: '/', label: 'Home' },
  { href: '/contact', label: 'Contact' },
  { href: '/about', label: 'About' },
  { href: '/sign-up', label: 'Sign Up' },
]

export default function Header() {
  const [isNavVisible, setIsNavVisible] = useState(true)

  const pathname = useRouter().pathname
  const [currentTab, setCurrentTab] = useState(
    pathname !== '/' ? pathname.slice(1) : 'home',
  )

  function handleChangeTab(tab: string) {
    setCurrentTab(tab.toLowerCase())
  }

  function toogleNav() {
    setIsNavVisible(!isNavVisible)
  }

  return (
    <header className="sticky top-0 z-50 flex items-center border-b border-gray-300 bg-white">
      <Menu onClick={toogleNav} />
      {isNavVisible && (
        <Tabs.Root className="absolute flex h-14 flex-col px-8 lg:static lg:flex-row lg:items-center 2xl:px-[8.4375rem] ">
          <Link
            href="/"
            className="whitespace-nowrap pr-8 text-lg font-bold md:text-2xl xl:pr-[12.5rem]"
          >
            E-Shopverse
          </Link>
          <Tabs.List className="flex w-fit flex-col justify-between gap-x-12 lg:w-full lg:flex-row lg:items-center">
            {links.map(({ href, label }) => (
              <Tabs.Trigger
                data-state={
                  currentTab === label.toLowerCase() ? 'active' : 'inactive'
                }
                value={label}
                key={`${href}${label}`}
                className="relative w-fit data-[state=active]:font-semibold lg:w-auto"
              >
                <>
                  <UnstyledLink
                    href={href}
                    className="whitespace-nowrap text-base transition hover:text-gray-600"
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
          </Tabs.List>
        </Tabs.Root>
      )}
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
          <div onClick={() => handleChangeTab('wishlist')} className="relative">
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
          </div>
          <div onClick={() => handleChangeTab('cart')} className="relative">
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
          </div>
        </div>
      </div>
    </header>
  )
}
