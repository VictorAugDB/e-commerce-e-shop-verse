import {
  ChangeEvent,
  ComponentProps,
  ForwardedRef,
  forwardRef,
  KeyboardEvent,
} from 'react'

const masks = {
  zipCode: (e: KeyboardEvent<HTMLInputElement>) => {
    e.currentTarget.maxLength = 10
    const newValue = e.currentTarget.value
      .replace(/\D/g, '')
      .replace(/^(\d{5})(\d)/, '$1-$2')
    e.currentTarget.value = newValue
    return e
  },
}

type RRFInputProps = ComponentProps<'input'> & {
  handleChange?: (e: ChangeEvent<HTMLInputElement>) => void
  mask?: 'zipCode'
}

function RRFInput(
  { handleChange, mask, onChange, ...props }: RRFInputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  return (
    <>
      <label className="text-sm text-gray-600" htmlFor={props.name}>
        {props.placeholder}
      </label>
      <input
        className="w-full rounded border border-gray-400 bg-slate-50 p-2 outline-none transition-all placeholder:text-gray-600 read-only:text-gray-600 hover:ring-green-600  focus:ring-green-600 hover:[&:not(:read-only)]:ring-2 focus:[&:not(:read-only)]:ring-2"
        ref={ref}
        onKeyDown={mask && masks[mask]}
        onChange={(e) => {
          onChange && onChange(e)
          handleChange && handleChange(e)
        }}
        {...props}
      />
    </>
  )
}

export default forwardRef(RRFInput)
