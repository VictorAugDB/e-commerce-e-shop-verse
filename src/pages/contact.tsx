import { ComponentProps, FocusEvent, useState } from 'react'
import { Mail, Phone } from 'react-feather'

import Button from '@/components/buttons/Button'
import Steps from '@/components/Steps'

export default function Contact() {
  return (
    <div className="flex flex-col items-center px-2 xl:px-8 2xl:px-[8.4375rem]">
      <div className="w-full">
        <Steps flow="contact" currentStep={1}></Steps>
      </div>
      <div className="flex flex-col-reverse items-center gap-[1.875rem] lg:flex-row">
        <div className="max-w-[21.25rem] flex-1 space-y-8 rounded bg-white px-4 py-10 md:p-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700 text-white">
                <Phone />
              </div>
              <p className="font-medium">Call To Us</p>
            </div>
            <p className="text-sm">We are available 24/7, 7 days a week.</p>
            <p className="text-sm">Phone: +99 (99) 99999-9999</p>
          </div>
          <div className="h-px bg-gray-600"></div>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700 text-white">
                <Mail />
              </div>
              <p className="font-medium">Write To Us</p>
            </div>
            <p className="text-sm">
              Fill out our form and we will contact you within 24 hours.
            </p>
            <p className="text-sm">Emails: customer@exclusive.com</p>
            <p className="text-sm">Emails: support@exclusive.com</p>
          </div>
        </div>
        <div className="flex flex-col gap-6 rounded bg-white px-4 py-10 md:p-10">
          <div className="flex flex-wrap items-center justify-center gap-4 md:flex-nowrap">
            <Input id="name" name="name" placeholder="Your Name" />
            <Input id="email" name="email" placeholder="YourEmail" />
            <Input id="phone" name="phone" placeholder="Your Phone" />
          </div>
          <TextArea id="message" name="message" placeholder="Your Message" />
          <Button variant="green" className="ml-auto px-12 py-4">
            Send Message
          </Button>
        </div>
      </div>
    </div>
  )
}

type InputProps = ComponentProps<'input'> & {
  id: string
  name: string
}

function Input({ id, placeholder, name, ...props }: InputProps) {
  const [hasValue, setHasValue] = useState(false)

  function handleCheckHasValue(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value

    setHasValue(!!value)
  }

  return (
    <div
      data-has-value={hasValue}
      className="group relative flex w-full items-center rounded border-gray-600 bg-gray-100 transition focus-within:border-green-700 data-[has-value=true]:border-green-700"
    >
      <input
        name={name}
        id={id}
        type="text"
        onBlur={handleCheckHasValue}
        className="w-full border-0 bg-transparent p-2 outline-none focus:ring-0"
        {...props}
      />
      <label
        htmlFor={name}
        data-has-value={hasValue}
        className="absolute left-0 top-0 flex h-full cursor-text items-center pl-2 text-sm text-gray-600 transition-all group-focus-within:h-1/2 group-focus-within:-translate-y-full group-focus-within:pl-0 group-focus-within:text-xs data-[has-value=true]:h-1/2 data-[has-value=true]:-translate-y-full data-[has-value=true]:pl-0 data-[has-value=true]:text-xs"
      >
        {placeholder}
      </label>
    </div>
  )
}

type TextAreaProps = ComponentProps<'textarea'> & {
  id: string
  name: string
}

function TextArea({ id, placeholder, name, ...props }: TextAreaProps) {
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
