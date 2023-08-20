'use client'

import { ComponentProps, FocusEvent, useState } from 'react'

type TextAreaProps = ComponentProps<'textarea'> & {
  id: string
  name: string
}

export function TextArea({ id, placeholder, name, ...props }: TextAreaProps) {
  const [hasValue, setHasValue] = useState(false)

  function handleCheckHasValue(e: FocusEvent<HTMLTextAreaElement, Element>) {
    const value = e.target.value

    setHasValue(!!value)
  }

  return (
    <div
      data-has-value={hasValue}
      className="group relative flex items-center rounded border-gray-600 bg-gray-100 transition focus-within:border-green-700 data-[has-value=true]:border-green-700"
    >
      <textarea
        name={name}
        id={id}
        onBlur={handleCheckHasValue}
        className="h-[12.9375rem] w-full border-0 bg-transparent p-2 outline-none focus:ring-0"
        {...props}
      />
      <label
        htmlFor={name}
        data-has-value={hasValue}
        className="absolute left-0 top-0 flex h-full cursor-text  pl-2 text-sm text-gray-600 transition-all group-focus-within:-top-5 group-focus-within:h-1/2 group-focus-within:pl-0 group-focus-within:text-xs data-[has-value=true]:-top-5 data-[has-value=true]:h-1/2 data-[has-value=true]:pl-0 data-[has-value=true]:text-xs"
      >
        {placeholder}
      </label>
    </div>
  )
}
