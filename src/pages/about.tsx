import { IconBase } from 'react-icons'
import { BiDollarCircle, BiMoney, BiShoppingBag, BiStore } from 'react-icons/bi'

import NextImage from '@/components/NextImage'
import Steps from '@/components/Steps'

export default function About() {
  return (
    <div className="flex flex-col gap-[8.75rem] px-[8.4375rem]">
      <Steps flow="about" currentStep={1} />
      <div className="flex items-center gap-[4.6875rem]">
        <div className="max-w-[33.4375rem] space-y-10">
          <h1 className="text-[3.5rem] leading-none">Our Story</h1>
          <p>
            In the digital realm, e-shopverse emerged. Beginning humbly, it
            swiftly expanded into a dynamic e-commerce platform. With diverse
            products, seamless transactions, and user-centric design, it
            garnered a devoted following. Innovative features like "ShopSpheres"
            revolutionized shopping, while challenges like data security shaped
            its resilience. Now a global presence, e-shopverse thrives as a
            symbol of convenience, choice, and evolving online retail.
          </p>
        </div>
        <NextImage
          alt="product-image"
          src="/images/about.png"
          width={705}
          height={609}
          className="max-h-[38.0625rem] max-w-[44.0625rem]"
        ></NextImage>
      </div>
      <div className="mx-auto flex gap-[1.875rem]">
        <IndicatorCard amount={10.5} icon={BiStore} />
        <IndicatorCard amount={10.5} icon={BiDollarCircle} />
        <IndicatorCard amount={10.5} icon={BiShoppingBag} />
        <IndicatorCard amount={10.5} icon={BiMoney} />
      </div>
    </div>
  )
}

type IndicatorCardProps = {
  amount: number
  icon: typeof IconBase
}

function IndicatorCard({ amount, icon: Icon }: IndicatorCardProps) {
  return (
    <div className="flex w-fit flex-col items-center space-y-6 rounded border border-gray-600 px-[3.125rem] py-6">
      <div className="w-fit overflow-hidden rounded-full border-[11px] border-gray-600">
        <div className="flex h-12 w-12 items-center justify-center  bg-black text-white">
          <Icon className="mx-[.2188rem] my-[.3125rem] h-8 w-8" />
        </div>
      </div>
      <div className="space-y-3">
        <h2 className="text-center">{amount}k</h2>
        <p className="text-center">Sallers active our site</p>
      </div>
    </div>
  )
}
