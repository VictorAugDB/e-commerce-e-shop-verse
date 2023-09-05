import { motion } from 'framer-motion'
import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

type LoadingSpinnerProps = ComponentProps<'div'>

export function LoadingSpinner({ className, ...props }: LoadingSpinnerProps) {
  const circumference = Math.PI * 20 * 2

  return (
    <div className={twMerge(className, 'relative')} {...props}>
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        initial={{ strokeDashoffset: circumference, rotateZ: 0 }}
        animate={{ strokeDashoffset: -circumference, rotateZ: 720 }}
        transition={{
          repeat: Infinity,
          ease: 'easeOut',
          duration: 2,
        }}
        className="h-12 w-12 fill-none stroke-[url(#GradientColor)] stroke-[.5rem]"
        strokeDasharray={circumference}
      >
        <defs>
          <linearGradient id="GradientColor">
            <stop offset="0%" stopColor="#aa5656" />
            <stop offset="100%" stopColor="#32502e" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="20" strokeLinecap="round" />
      </motion.svg>
    </div>
  )
}
