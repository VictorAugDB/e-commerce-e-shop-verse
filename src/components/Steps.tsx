import React from 'react'

type StepsProps =
  | {
      flow: 'buy'
      currentStep: number
    }
  | {
      flow: 'product' | 'product-checkout'
      currentStep: number
      category: string
      productName: string
    }

export default function Steps(props: StepsProps) {
  function getSteps() {
    switch (props.flow) {
      case 'buy':
        return ['Cart', 'Checkout', 'Pay', 'Finished Order']
      case 'product':
        return ['Account', props.category, props.productName]
      case 'product-checkout':
        return [
          'Account',
          props.category,
          props.productName,
          'Checkout',
          'Pay',
          'Finished Order',
        ]
    }
  }

  const steps = getSteps()

  return (
    <div className="flex items-center gap-3 py-20">
      {steps.map((step, idx) => (
        <React.Fragment key={step}>
          <p
            data-current-step={props.currentStep === idx}
            className="text-sm text-gray-400 data-[current-step=true]:text-black"
          >
            {step}
          </p>
          <p className="text-sm text-gray-400 last:hidden">/</p>
        </React.Fragment>
      ))}
    </div>
  )
}
