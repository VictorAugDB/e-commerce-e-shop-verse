import { ComponentProps, ForwardedRef, forwardRef, useState } from 'react'
import { Search } from 'react-feather'
import { tv, VariantProps } from 'tailwind-variants'

const container = tv({
  base: 'ml-auto flex w-fit items-center rounded border bg-white pr-1 transition-all focus-within:border focus-within:border-green-700 hover:border-green-700 data-[has-value=true]:border-green-700',
  variants: {
    borderColor: {
      default: 'border-gray-400',
      transparent: 'border-transparent',
    },
  },
  defaultVariants: {
    borderColor: 'default',
  },
})

const input = tv({
  base: 'w-full border-none bg-transparent px-2 pl-1 placeholder:overflow-visible focus:ring-0 md:px-3',
  variants: {
    textSize: {
      default: 'text-base',
      xs: 'text-xs',
    },
  },
  defaultVariants: {
    textSize: 'default',
  },
})

type SearchInputProps = ComponentProps<'input'> &
  VariantProps<typeof container> &
  VariantProps<typeof input> & {
    handleSearch: () => void
  }

function SearchInput(
  { handleSearch, borderColor, textSize, ...props }: SearchInputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const [hasValue, setHasValue] = useState(false)

  function handleCheckHasValue(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value

    setHasValue(!!value)
  }

  return (
    <div data-has-value={hasValue} className={container({ borderColor })}>
      <input
        className={input({ textSize })}
        onBlur={handleCheckHasValue}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.currentTarget.blur()
            handleSearch()
          }
        }}
        type="text"
        ref={ref}
        {...props}
      />
      <Search
        width={20}
        height={20}
        onClick={handleSearch}
        className="cursor-pointer transition hover:stroke-gray-400"
      />
    </div>
  )
}

export default forwardRef(SearchInput)
