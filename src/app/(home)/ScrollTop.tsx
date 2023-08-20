'use client'

import { ArrowUp } from 'react-feather'

export function ScrollTop() {
  function handleScrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={handleScrollTop}
      className="mb-[-6.75rem] ml-auto flex h-[2.875rem] w-[2.875rem] items-center justify-center rounded-full border-none bg-white hover:shadow-lg"
    >
      <ArrowUp />
    </button>
  )
}
