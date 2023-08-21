import Link from 'next/link'

import Button from '@/components/buttons/Button'
import InputBorderBottom from '@/components/InputBorderBottom'
import NextImage from '@/components/NextImage'

export default function signUp() {
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
        <div className="flex flex-col gap-6 pr-[3.4375rem]">
          <h1 className="text-center">Create an account</h1>
          <p>Enter your details below</p>
        </div>
        <div className="flex flex-col gap-10">
          <InputBorderBottom name="name" id="name" placeholder="Name" />
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
          <div className="flex flex-col gap-4">
            <Button variant="green" className="flex w-full justify-center py-4">
              Create Account
            </Button>
            <Button
              variant="ghost"
              className="flex w-full justify-center gap-4 rounded border border-gray-600 py-4"
            >
              <img src="/images/google-icon.png" alt="" />
              Sign up with Google
            </Button>
          </div>
          <div className="flex justify-center gap-4">
            <p>Already have account?</p>
            <Link
              href="/sign-in"
              className="border-b border-transparent pb-1 font-medium text-gray-800 transition hover:border-gray-800 hover:font-semibold"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
