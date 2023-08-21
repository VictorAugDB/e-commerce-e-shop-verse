import { motion } from 'framer-motion'
import { twMerge } from 'tailwind-merge'

import { ProductSize } from '@/contexts/ProductsContext'

type SizesProps = {
  productSizes?: ProductSize
  selectedSize: string | null
  handleSelectSize: (size: string) => void
}

export function Sizes({
  productSizes,
  selectedSize,
  handleSelectSize,
}: SizesProps) {
  const sizes: ['xs', 's', 'm', 'l', 'xl'] = ['xs', 's', 'm', 'l', 'xl']

  return (
    <>
      {productSizes && (
        <div className="flex items-center gap-6">
          <p className="text-lg">Sizes:</p>
          <div className="flex items-center gap-4">
            {sizes.map((s) => (
              <motion.button
                key={s}
                onClick={() => handleSelectSize(s)}
                disabled={productSizes && productSizes[s] <= 0}
                className={twMerge(
                  'h-8 w-8 rounded border bg-white disabled:cursor-not-allowed disabled:bg-gray-300/50',
                  selectedSize === s ? 'border-green-700' : 'border-gray-600',
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {selectedSize === s ? (
                  <motion.div
                    layoutId="selectedSize"
                    className="flex h-full w-full items-center justify-center rounded-sm bg-green-700 text-white"
                  >
                    <p className="text-sm font-medium">{s.toUpperCase()}</p>
                  </motion.div>
                ) : (
                  <p className="text-sm font-medium">{s.toUpperCase()}</p>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
