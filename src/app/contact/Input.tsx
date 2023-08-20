'use client'

import { ComponentProps, useState } from 'react'

type InputProps = ComponentProps<'input'> & {
  id: string
  name: string
}

export function Input({ id, placeholder, name, ...props }: InputProps) {
  const [hasValue, setHasValue] = useState(false)

  function handleCheckHasValue(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value

    setHasValue(!!value)
  }

  return (
    <div
      data-has-value={hasValue}
      className="group relative flex w-full items-center rounded border-gray-600 bg-gray-100 transition focus-within:border-green-700 data-[has-value=true]:border-green-700"
    >
      <input
        name={name}
        id={id}
        type="text"
        onBlur={handleCheckHasValue}
        className="w-full border-0 bg-transparent p-2 outline-none focus:ring-0"
        {...props}
      />
      <label
        htmlFor={name}
        data-has-value={hasValue}
        className="absolute left-0 top-0 flex h-full cursor-text items-center pl-2 text-sm text-gray-600 transition-all group-focus-within:h-1/2 group-focus-within:-translate-y-full group-focus-within:pl-0 group-focus-within:text-xs data-[has-value=true]:h-1/2 data-[has-value=true]:-translate-y-full data-[has-value=true]:pl-0 data-[has-value=true]:text-xs"
      >
        {placeholder}
      </label>
    </div>
  )
}
