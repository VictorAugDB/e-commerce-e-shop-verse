'use client'

import * as Tabs from '@radix-ui/react-tabs'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect, useRef, useState } from 'react'
import { Heart, Menu, ShoppingCart, X } from 'react-feather'
import { CSSTransition } from 'react-transition-group'
import { twMerge } from 'tailwind-merge'

import UnstyledLink from '@/components/links/UnstyledLink'
import SearchInput from '@/components/SearchInput'

import { ProductsContext } from '@/contexts/ProductsContext'

const links = [
  { href: '/', label: 'Home' },
  { href: '/contact', label: 'Contact' },
  { href: '/about', label: 'About' },
  { href: '/sign-up', label: 'Sign Up' },
]

export default function Header() {
  const router = useRouter()
  const pathname = router.pathname
  const [currentTab, setCurrentTab] = useState(
    pathname !== '/' ? pathname.slice(1) : 'home',
  )
  const [isNavVisible, setIsNavVisible] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const menuRef = useRef<null | HTMLDivElement>(null)
  const { cartQuantity } = useContext(ProductsContext)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1024px)')

    mediaQuery.addEventListener('change', () => {
      handleMediaQueryChange(mediaQuery)
    })
    handleMediaQueryChange(mediaQuery)

    if (isNavVisible && isSmallScreen) {
      const handler = (e: MouseEvent) => {
        if (
          menuRef.current &&
          e.target &&
          !menuRef.current.contains(e.target as Node)
        ) {
          setIsNavVisible(false)
        }
      }

      document.addEventListener('mousedown', handler)

      return () => {
        document.removeEventListener('mousedown', handler)
      }
    }

    return () => {
      mediaQuery.removeEventListener('change', () => {
        handleMediaQueryChange(mediaQuery)
      })
    }
  }, [isNavVisible, isSmallScreen])

  function handleMediaQueryChange(mediaQuery: MediaQueryList) {
    if (mediaQuery.matches) {
      setIsSmallScreen(true)
    } else {
      setIsSmallScreen(false)
    }
  }

  function handleChangeTab(tab: string) {
    setCurrentTab(tab.toLowerCase())
    setIsNavVisible(false)
  }

  function toogleNav() {
    setIsNavVisible(!isNavVisible)
  }

  function handleSearch() {
    router.push({
      pathname: 'products',
      query: {
        search: inputRef.current?.value,
      },
    })
  }

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-2 border-b border-gray-300 bg-white px-2 shadow sm:px-4 lg:px-8 lg:py-0 2xl:px-[8.4375rem]">
      <Menu onClick={toogleNav} className="lg:hidden" />
      {isNavVisible && isSmallScreen && (
        <div className="fixed left-0 top-0 z-10 h-screen w-screen bg-[rgba(0,0,0,0.2)]"></div>
      )}
      <CSSTransition
        in={isNavVisible || !isSmallScreen}
        timeout={350}
        classNames="NavAnimation"
        nodeRef={menuRef}
        unmountOnExit
      >
        <Tabs.Root
          ref={menuRef}
          className="fixed left-0 top-0 z-20 flex h-screen flex-col gap-6 bg-white px-2 py-4 shadow-lg lg:static lg:h-auto lg:flex-row lg:items-center lg:bg-transparent lg:shadow-none"
        >
          <X onClick={() => setIsNavVisible(false)} className="lg:hidden" />

          <Link
            href="/"
            className="whitespace-nowrap pr-8 text-lg font-bold md:text-2xl xl:pr-[12.5rem]"
          >
            E-Shopverse
          </Link>
          <Tabs.List className="flex w-fit flex-col justify-between gap-8 gap-x-12 lg:w-full lg:flex-row lg:items-center">
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
      </CSSTransition>
      <div className="flex w-full items-center justify-between gap-2 sm:gap-6">
        <SearchInput
          ref={inputRef}
          handleSearch={handleSearch}
          placeholder="what are you looking for?"
          borderColor="transparent"
          textSize="xs"
        />
        <div className="flex items-center gap-2 sm:gap-6">
          <div onClick={() => handleChangeTab('wishlist')} className="relative">
            <Link href="/wishlist">
              <Heart
                className="h-5 w-5 fill-transparent transition-all hover:fill-red-500 sm:h-6 sm:w-6"
                strokeWidth={currentTab === 'wishlist' ? 2.5 : 2}
              />
              {currentTab === 'wishlist' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-0.5 h-px w-full bg-gray-600"
                ></motion.div>
              )}
            </Link>
          </div>
          <div onClick={() => handleChangeTab('cart')} className="relative">
            <Link href="/cart">
              <ShoppingCart
                data-quantity={cartQuantity > 0}
                className="
                  h-5 w-5 transition hover:stroke-gray-600
                  sm:h-6 sm:w-6
                "
                strokeWidth={currentTab === 'cart' ? 2.5 : 2}
              />
              <div
                className={twMerge(
                  'absolute -top-3 flex h-4 w-fit min-w-[1rem] items-center justify-center rounded-full bg-green-700 p-1 text-xs text-white',
                  cartQuantity < 100 ? '-right-3' : '-right-6',
                )}
              >
                {cartQuantity < 100 ? cartQuantity : `${99}+`}
              </div>
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
