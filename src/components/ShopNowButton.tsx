import Link from 'next/link'
import React from 'react'

type ShopNowButtonProps = {
  children?: React.ReactNode
  href: string
}

export default function ShopNowButton({ children, href }: ShopNowButtonProps) {
  return (
    <Link
      className="group flex w-fit items-center gap-2 text-white transition-all hover:scale-105 hover:text-gray-600"
      href={href}
    >
      <p className="border-spacing-4 border-b border-white pb-[0.15rem] group-hover:border-gray-600">
        Shop now
      </p>
      {children}
    </Link>
  )
}
