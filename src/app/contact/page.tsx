import { Mail, Phone } from 'react-feather'

import Steps from '@/components/Steps'

import { Input } from '@/app/contact/Input'
import { SendMessage } from '@/app/contact/SendMessage'
import { TextArea } from '@/app/contact/TextArea'

export default function Contact() {
  return (
    <div className="flex h-full flex-col items-center px-2 xl:px-8 2xl:px-[8.4375rem]">
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
        <div className="flex h-full flex-col gap-6 rounded bg-white px-4 py-10 md:p-10">
          <div className="flex flex-wrap items-center justify-center gap-4 md:flex-nowrap">
            <Input id="name" name="name" placeholder="Your Name" />
            <Input id="email" name="email" placeholder="YourEmail" />
            <Input id="phone" name="phone" placeholder="Your Phone" />
          </div>
          <TextArea id="message" name="message" placeholder="Your Message" />
          <SendMessage />
        </div>
      </div>
    </div>
  )
}
