import Link from 'next/link'

import Button from '@/components/buttons/Button'
import InputBorderBottom from '@/components/InputBorderBottom'
import NextImage from '@/components/NextImage'

export default function SignIn() {
  return (
    <div className="grid grid-cols-1 gap-32 px-2 pt-[3.75rem] xl:grid-cols-2 xl:px-0">
      <div className="hidden h-[48.8125rem] bg-green-50 xl:block">
        <div className="relative h-[44.125rem]">
          <NextImage
            alt="product-image"
            src="/images/cart-cellphone.png"
            fill
          ></NextImage>
        </div>
      </div>
      <div className="flex w-full max-w-max flex-col justify-center gap-12 justify-self-center xl:justify-self-auto">
        <div className="flex flex-col gap-6">
          <h1 className="text-center">Log in to E-Shopverse</h1>
          <p>Enter your details below</p>
        </div>
        <div className="flex flex-col gap-10">
          <InputBorderBottom
            name="e-mail"
            id="e-mail"
            type="email"
            placeholder="E-mail / Phone Number"
          />
          <InputBorderBottom
            name="password"
            id="password"
            type="password"
            placeholder="Password"
          />
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex flex-row-reverse flex-wrap items-center justify-center gap-4 sm:justify-between xl:flex-row">
            <Button variant="green" className="flex justify-center px-12 py-4">
              Log In
            </Button>
            <Link
              href="/reset-password"
              className="border-b border-transparent pb-1 transition hover:border-gray-800 hover:font-semibold"
            >
              Forget Password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
