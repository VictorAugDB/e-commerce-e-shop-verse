'use client'

import React, {
  ChangeEvent,
  ComponentProps,
  FocusEvent,
  ForwardedRef,
  forwardRef,
  useState,
} from 'react'

type InputProps = ComponentProps<'input'> & {
  name: string
  placeholder: string
  customHasValue?: boolean
  mask?: 'zipCode'
  handleBlur?: (e: FocusEvent<HTMLInputElement, Element>) => void
  id: string
}

function InputBorderBottom(
  { placeholder, customHasValue, id, name, ...props }: InputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const [hasValue, setHasValue] = useState(!!props.defaultValue)

  function handleCheckHasValue(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value

    setHasValue(!!value)
  }

  return (
    <div
      data-has-value={hasValue || customHasValue}
      className="group relative  mt-4 border-b border-gray-600 transition focus-within:border-green-700 data-[has-value=true]:border-green-700"
    >
      <input
        name={name}
        id={id}
        type="text"
        ref={ref}
        onChange={(e) => {
          handleCheckHasValue(e)
        }}
        className="w-full border-0 bg-transparent p-0 pb-1 outline-none read-only:text-gray-600 focus:ring-0"
        {...props}
      />
      <label
        htmlFor={id}
        data-has-value={
          customHasValue !== undefined ? customHasValue : hasValue
        }
        className="absolute left-0 top-0 flex h-full cursor-text items-center pl-2 text-sm text-gray-600 transition-all group-focus-within:h-1/2 group-focus-within:-translate-y-full group-focus-within:pl-0 group-focus-within:text-xs data-[has-value=true]:h-1/2 data-[has-value=true]:-translate-y-full data-[has-value=true]:pl-0 data-[has-value=true]:text-xs"
      >
        {placeholder}
      </label>
    </div>
  )
}

export default forwardRef(InputBorderBottom)
