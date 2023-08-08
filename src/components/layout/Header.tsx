'use client'

import * as Tabs from '@radix-ui/react-tabs'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { Heart, Menu, Search, ShoppingCart, X } from 'react-feather'
import { CSSTransition } from 'react-transition-group'

import UnstyledLink from '@/components/links/UnstyledLink'

const links = [
  { href: '/', label: 'Home' },
  { href: '/contact', label: 'Contact' },
  { href: '/about', label: 'About' },
  { href: '/sign-up', label: 'Sign Up' },
]

export default function Header() {
  const [isNavVisible, setIsNavVisible] = useState(true)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const menuRef = useRef<null | HTMLDivElement>(null)

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
    <header className="sticky top-0 z-50 flex h-14 items-center gap-2 border-b border-gray-300 bg-white px-2 sm:px-4 lg:px-8 lg:py-0 2xl:px-[8.4375rem]">
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
          className="fixed left-0 top-0 z-20 flex h-screen flex-col gap-6 bg-white px-4 py-3 lg:static lg:h-auto lg:flex-row lg:items-center lg:bg-transparent "
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
        <div className="flex items-center">
          <input
            type="text"
            placeholder="What are you looking for?"
            className="w-fit rounded border-0 pl-px pr-1 text-xs sm:pr-[2.375rem]"
          />
          <Search className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <div className="flex items-center gap-2 sm:gap-6">
          <div onClick={() => handleChangeTab('wishlist')} className="relative">
            <Heart
              className="h-5 w-5 transition hover:stroke-gray-600 sm:h-6 sm:w-6"
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
                className="h-5 w-5 transition hover:stroke-gray-600 sm:h-6 sm:w-6"
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
