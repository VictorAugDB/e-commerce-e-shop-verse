import Link from 'next/link'
import React from 'react'

type ShopNowButtonProps = {
  children?: React.ReactNode
  href: string
}

export default function ShopNowButton({ children, href }: ShopNowButtonProps) {
  return (
    <Link className="flex items-center gap-2" href={href}>
      <p className="border-spacing-4 border-b border-white pb-[0.15rem] text-white">
        Shop now
      </p>
      {children}
    </Link>
  )
}
