import React from 'react';

type StepsProps = {
  flow: 'buy';
  currentStep: number;
  className: string;
};

export default function Steps({ flow, currentStep, className }: StepsProps) {
  function getSteps() {
    switch (flow) {
      case 'buy':
        return ['Cart', 'Checkout', 'Pay', 'Finished Order'];
    }
  }

  const steps = getSteps();

  return (
    <div className={className + ' flex items-center gap-3'}>
      {steps.map((step, idx) => (
        <React.Fragment key={step}>
          <p
            className={`${
              idx === currentStep ? 'text-black' : 'text-gray-400'
            } text-sm`}
          >
            {step}
          </p>
          <p className='text-sm text-gray-400 last:hidden'>/</p>
        </React.Fragment>
      ))}
    </div>
  );
}
