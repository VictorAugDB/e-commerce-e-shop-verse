import Link from 'next/link'
import { GitHub } from 'react-feather'
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
          <div className="max-w-[33.4375rem] space-y-4">
            <h4>
              Introducing e-Shopverse: Your Personal Open-Source Shopping Haven
            </h4>
            <p>
              Welcome to e-Shopverse, the unique online shopping experience
              crafted solely by me. This open-source project reflects my
              unwavering dedication to providing a user-centric shopping
              environment.
            </p>
            <p>
              <strong>Important Note:</strong> Please be aware that e-Shopverse
              is not a production-ready product and may contain bugs and
              security issues. Your feedback and contributions are invaluable in
              enhancing its reliability and functionality.
            </p>
            <p>
              e-Shopverse is the embodiment of my dedication to creating an
              enjoyable, secure, and non-commercialized online shopping
              platform. Dive into this unique open-source project and experience
              the shopping haven I've meticulously crafted. Your contributions
              to this community are deeply valued. Explore e-Shopverse today!
            </p>
            <div className="flex flex-col gap-2">
              <p className="font-medium">
                If you want to collaborate with the project, please access the
                project repository and read the README file, your feedback and
                contribution will be very welcome. If the project were usefull
                for you, please don't forget to give a star.
              </p>
              <Link
                href="https://github.com/VictorAugDB/e-commerce-e-shop-verse"
                target="_blank"
              >
                <div className="flex w-fit items-center gap-2 rounded bg-slate-700 p-2 text-white transition-all hover:bg-slate-800">
                  <GitHub />
                  Access the repository
                </div>
              </Link>
            </div>
          </div>
          <div className="relative h-[38.0625rem] min-w-[15.625rem] max-w-[44.0625rem] flex-1 overflow-hidden rounded">
            <NextImage
              alt="two people sitting in a table talking about work"
              src="/images/about.png"
              fill
              className="max-h-[38.0625rem] max-w-[44.0625rem]"
            ></NextImage>
          </div>
        </div>
        <div className="mx-auto mt-4 max-w-[45.25rem] space-y-4">
          <div className="text-center">
            <h4>Why e-Shopverse?</h4>
            <p>
              The Work Behind It: e-Shopverse stands as a testament to my
              passion and commitment to creating an exceptional shopping
              platform, meticulously designed and developed to prioritize your
              needs. Endless Shopping Options: Immerse yourself in a world of
              diverse products, from fashion and electronics to home decor,
              without any commercial influences. Simplified Shopping: The
              user-friendly interface I've designed ensures effortless product
              discovery and cart management, making the shopping process
              straightforward and enjoyable.
            </p>
          </div>
          <h4>Key Features of e-Shopverse:</h4>
          <ol className="list-inside list-decimal space-y-2">
            <li>
              <strong>Add Orders:</strong> Explore products and add them to your
              cart, simplifying the purchase process.
            </li>

            <li>
              <strong>Add Reviews:</strong> Share your insights on products,
              providing valuable guidance to fellow shoppers.
            </li>

            <li>
              <strong>Sign In:</strong> Create an account for access to
              personalized features, including order tracking and preferences
              management.
            </li>

            <li>
              <strong>Address Management:</strong> Streamline shopping with
              efficient address management tools.
            </li>

            <li>
              <strong>Product Discovery:</strong> Discover new items tailored to
              your preferences.
            </li>

            <li>
              <strong>Order History:</strong> Easily keep track of past orders
              and reorder favorite items.
            </li>

            <li>
              <strong>Cart Management:</strong> Add or remove items from the
              cart as needed.
            </li>

            <li>
              <strong>Cancel Orders & Reviews:</strong> Maintain complete
              control over the shopping experience, with the ability to cancel
              orders or reviews when necessary.
            </li>
            <li>
              <strong>Payment with Stripe:</strong> Securely process payments
              using the Stripe payment gateway, ensuring a seamless and reliable
              transaction experience for customers.
            </li>
          </ol>
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
