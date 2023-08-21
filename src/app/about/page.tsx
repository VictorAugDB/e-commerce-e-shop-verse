import { IconBase } from 'react-icons'
import { BiDollarCircle, BiMoney, BiShoppingBag, BiStore } from 'react-icons/bi'

import Differentials from '@/components/Differentials'
import { Executive, Executives } from '@/components/Executives'
import NextImage from '@/components/NextImage'
import Steps from '@/components/Steps'

export default function About() {
  const executiveOne: Executive = {
    id: '1',
    instagramUrl: '#',
    linkedinUrl: '#',
    twitterUrl: '#',
    name: 'Tom Cruise',
    photo: '/images/tom.png',
    role: 'Founder & Chairman',
  }

  const executiveTwo: Executive = {
    ...executiveOne,
    id: '2',
    name: 'Emma Watson',
    photo: '/images/emma.png',
    role: 'Managing Director',
  }

  const executiveThree: Executive = {
    ...executiveOne,
    id: '3',
    name: 'Will Smith',
    photo: '/images/will.png',
    role: 'Product Designer',
  }

  const executives: Executive[] = [
    executiveOne,
    executiveTwo,
    executiveThree,
    {
      ...executiveTwo,
      id: '4',
    },
    {
      ...executiveThree,
      id: '5',
    },
    {
      ...executiveOne,
      id: '6',
    },
    {
      ...executiveTwo,
      id: '7',
    },
  ]

  return (
    <div className="flex flex-col gap-[8.75rem] px-2 sm:px-8 xl:px-[5rem] 2xl:px-[8.4375rem]">
      <div>
        <Steps flow="about" currentStep={1} />
        <div className="flex flex-wrap justify-center gap-[4.6875rem]">
          <div className="max-w-[33.4375rem] space-y-10">
            <h1 className="text-[3.5rem] leading-none">Our Story</h1>
            <p>
              In the digital realm, e-shopverse emerged. Beginning humbly, it
              swiftly expanded into a dynamic e-commerce platform. With diverse
              products, seamless transactions, and user-centric design, it
              garnered a devoted following. Innovative features like
              "ShopSpheres" revolutionized shopping, while challenges like data
              security shaped its resilience. Now a global presence, e-shopverse
              thrives as a symbol of convenience, choice, and evolving online
              retail.
            </p>
          </div>
          <div className="relative h-[38.0625rem] min-w-[15.625rem] max-w-[44.0625rem] flex-1 overflow-hidden rounded">
            <NextImage
              alt="product-image"
              src="/images/about.png"
              fill
              className="max-h-[38.0625rem] max-w-[44.0625rem]"
            ></NextImage>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-[1.875rem]">
        <IndicatorCard amount={10.5} icon={BiStore} />
        <IndicatorCard amount={10.5} icon={BiDollarCircle} />
        <IndicatorCard amount={10.5} icon={BiShoppingBag} />
        <IndicatorCard amount={10.5} icon={BiMoney} />
      </div>
      <Executives executives={executives} />
      <Differentials />
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
