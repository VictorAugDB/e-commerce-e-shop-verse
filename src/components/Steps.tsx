import React from 'react'
import { twMerge } from 'tailwind-merge'

type StepsProps = {
  className?: string
} & (
  | {
      flow: 'buy' | 'contact' | 'about' | 'profile'
      currentStep: number
    }
  | {
      flow: 'product' | 'product-checkout'
      currentStep: number
      category: string
      productName: string
    }
)

export default function Steps(props: StepsProps) {
  function getSteps() {
    switch (props.flow) {
      case 'buy':
        return ['Cart', 'Checkout', 'Finish Order']
      case 'contact':
        return ['Home', 'Contact']
      case 'about':
        return ['Home', 'About']
      case 'profile':
        return ['Home', 'My Account']
      case 'product':
        return ['Account', props.category, props.productName]
      case 'product-checkout':
        return [
          'Account',
          props.category,
          props.productName,
          'Checkout',
          'Finish Order',
        ]
    }
  }

  const steps = getSteps()

  return (
    <div
      className={twMerge(
        'flex flex-wrap items-center gap-3 py-20',
        props.className,
      )}
    >
      {steps.map((step, idx) => (
        <React.Fragment key={step}>
          <p
            data-current-step={props.currentStep === idx}
            className="text-sm capitalize text-gray-400 data-[current-step=true]:text-black"
          >
            {step}
          </p>
          <p className="text-sm text-gray-400 last:hidden">/</p>
        </React.Fragment>
      ))}
    </div>
  )
}
