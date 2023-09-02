'use client'

import { MouseEvent } from 'react'
import { Copy } from 'react-feather'

type CopyToClipboardProps = {
  text: string
}

export default function CopyToClipboard({ text }: CopyToClipboardProps) {
  function handleCopyToClipboard(e: MouseEvent<SVGElement>) {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(text)
  }

  return (
    <Copy
      onClick={handleCopyToClipboard}
      className="text-gray-600 transition-all hover:scale-110 hover:stroke-[.1375rem]"
    />
  )
}
