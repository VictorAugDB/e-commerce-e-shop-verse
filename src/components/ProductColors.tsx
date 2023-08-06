import { motion } from 'framer-motion'
import { Fragment, useState } from 'react'
import { twMerge } from 'tailwind-merge'

type ProductsProps = {
  colors: string[]
}

export function ProductColors({ colors }: ProductsProps) {
  const [checkedColor, setCheckedColor] = useState(colors[0])

  function isValidColor(color: string) {
    return /^#([0-9A-F]{3}){1,2}$/i.test(color)
  }

  function handleSelect(color: string) {
    setCheckedColor(color)
  }

  return (
    <>
      {colors.map((c) => (
        <Fragment key={c}>
          {isValidColor(c) && (
            <div onClick={() => handleSelect(c)} className="relative h-5 w-5">
              <motion.button
                className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-black focus:ring-1 focus:ring-black"
                style={{
                  backgroundColor: checkedColor === c ? '#FFFFFF' : c,
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span
                  className={twMerge(
                    'h-3 w-3 rounded-full',
                    checkedColor === c ? 'inline' : 'hidden',
                  )}
                  style={{
                    backgroundColor: c,
                  }}
                ></span>
              </motion.button>
            </div>
          )}
        </Fragment>
      ))}
    </>
  )
}
