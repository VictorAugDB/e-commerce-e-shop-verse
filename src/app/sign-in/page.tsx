import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { GoogleButton } from '@/components/GoogleButton'
import NextImage from '@/components/NextImage'

import { authOptions } from '@/app/api/auth/authOptions'

export default async function SignIn() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/')
  }

  return (
    <div className="grid grid-cols-1 gap-32 px-2 xl:grid-cols-[1fr_0.5fr] xl:px-0">
      <div className="hidden h-[48.8125rem] bg-green-50 xl:block">
        <div className="relative h-screen">
          <NextImage
            alt="A giant phone inside a shopping cart"
            src="/images/cart-cellphone.png"
            fill
          ></NextImage>
        </div>
      </div>
      <div className="mt-[3.75rem] flex w-full max-w-max flex-col gap-12 justify-self-center xl:justify-self-auto">
        <div className="flex flex-col gap-6">
          <h1 className="text-center">Log in to E-Shopverse</h1>
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex flex-row-reverse flex-wrap items-center justify-center gap-4 sm:justify-between xl:flex-row">
            <GoogleButton />
          </div>
        </div>
      </div>
    </div>
  )
}
