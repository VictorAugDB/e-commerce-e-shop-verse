import * as React from 'react'
import { ArrowRight, ArrowUp } from 'react-feather'
import { IconType } from 'react-icons'
import { AiOutlineCamera } from 'react-icons/ai'
import { BsPhone, BsSmartwatch } from 'react-icons/bs'
import { FiHeadphones } from 'react-icons/fi'
import { HiOutlineDesktopComputer } from 'react-icons/hi'
import { LuGamepad } from 'react-icons/lu'
import { LuShieldCheck } from 'react-icons/lu'
import { TbHeadphones, TbTruckDelivery } from 'react-icons/tb'
import { twMerge } from 'tailwind-merge'

import { getProducts } from '@/lib/http'

import BackgroundProduct from '@/components/BackgroundProduct'
import Button from '@/components/buttons/Button'
import Divider from '@/components/Divider'
import Categories from '@/components/lists/Categories'
import ListHeader from '@/components/lists/ListHeader'
import ListProducts from '@/components/lists/ListProducts'
import NextImage from '@/components/NextImage'
import RoundedBackgroundIcon from '@/components/RoundedBackgroundIcon'
import Seo from '@/components/Seo'
import ShopNowButton from '@/components/ShopNowButton'

import { Product } from '@/contexts/ProductsContext'

export type CategoriesWithIcons = {
  name: string
  icon: IconType
}

export type HomePageProps = {
  flashSales: Product[]
  bestSellings: Product[]
  products: Product[]
  newArrival: Product[]
}

export default function HomePage({
  bestSellings,
  flashSales,
  products,
  newArrival,
}: HomePageProps) {
  const categories = [
    "Woman's fashion",
    "Men's Fashion",
    'Electronics',
    'Home & Lifestyle',
    'Medicine',
    'Sports & Outdoor',
    "Baby's & Toys",
    'Groceries & Pets',
    'Health & Beauty',
  ]

  const categoriesWithIcons: CategoriesWithIcons[] = [
    {
      name: 'Phones',
      icon: BsPhone,
    },
    {
      name: 'Computers',
      icon: HiOutlineDesktopComputer,
    },
    {
      name: 'SmartWatch',
      icon: BsSmartwatch,
    },
    {
      name: 'Camera',
      icon: AiOutlineCamera,
    },
    {
      name: 'HeadPhones',
      icon: FiHeadphones,
    },
    {
      name: 'Gaming',
      icon: LuGamepad,
    },
  ]

  const promotionInfo = {
    imageLogoPath: '/images/promotion-logo.png',
    name: 'iPhone 14 Series',
    description: 'Up to 10% off Voucher',
    imagePath: '/images/promotion-image.png',
    id: '123',
  }

  function handleScrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col items-center gap-20 px-[8.4375rem]">
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <div className="flex w-full gap-[2.8125rem]">
        <nav
          className="
          flex w-full max-w-[13.5625rem] 
          flex-col gap-4 
          border-r border-gray-300
          pr-4 pt-10"
        >
          {categories.map((c) => (
            <p key={c}>{c}</p>
          ))}
        </nav>

        <section
          className="
            mt-10 flex h-full
            w-full flex-col items-center
            gap-[1.5625rem] rounded-sm
            bg-black px-16 pb-[11px]
          "
        >
          <div className="flex h-full w-full justify-between">
            <div className="flex flex-col gap-y-5">
              <div className="mt-14 flex items-center gap-6">
                <NextImage
                  src={promotionInfo.imageLogoPath}
                  width={40}
                  height={49}
                  alt="promotion-logo"
                ></NextImage>
                <p className="text-white">{promotionInfo.name}</p>
              </div>
              <span className="text-5xl leading-[3.75rem] text-white">
                {promotionInfo.description}
              </span>
              <div>
                <ShopNowButton href={`/products/${promotionInfo.id}`}>
                  <ArrowRight color="#FFFFFF" />
                </ShopNowButton>
              </div>
            </div>
            <div className="relative flex h-full w-full justify-end">
              <img
                className="h-auto w-auto"
                src={promotionInfo.imagePath}
                alt="product-image"
              ></img>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-gray-600"></span>
            <span className="h-3 w-3 rounded-full bg-gray-600"></span>
            <span className="h-3 w-3 rounded-full bg-gray-600"></span>
            <span className="h-3 w-3 rounded-full bg-gray-600"></span>
            <span className="h-3 w-3 rounded-full bg-gray-600"></span>
          </div>
        </section>
      </div>
      <ListProducts
        products={flashSales}
        topic="Today's"
        title="Flash Sales"
        hasTimer={true}
        hasButton={true}
      />
      <Divider />
      <Categories categories={categoriesWithIcons} />
      <Divider />
      <ListProducts
        products={bestSellings}
        topic="This Month"
        title="Best Selling Products"
        hasButton={true}
      />
      <div className="grid h-[31.25rem] grid-cols-2 gap-7 bg-black px-14 py-[4.3125rem]">
        <div className="flex flex-col">
          <p className="mb-7 font-semibold text-brown-300">Categories</p>
          <h1 className="h0 mb-8 text-white">Enhance Your Music Experience</h1>
          <div className="mb-8 flex items-center gap-10">
            <div className="flex h-[3.875rem] w-[3.875rem] flex-col items-center justify-center rounded-full bg-white text-center">
              <p className="font-semibold">23</p>
              <p className="text-xs">Hours</p>
            </div>
            <div className="flex h-[3.875rem] w-[3.875rem] flex-col items-center justify-center rounded-full bg-white text-center">
              <p className="font-semibold">05</p>
              <p className="text-xs">Days</p>
            </div>
            <div className="flex h-[3.875rem] w-[3.875rem] flex-col items-center justify-center rounded-full bg-white text-center">
              <p className="font-semibold">59</p>
              <p className="text-xs">Minutes</p>
            </div>
            <div className="flex h-[3.875rem] w-[3.875rem] flex-col items-center justify-center rounded-full bg-white text-center">
              <p className="font-semibold">35</p>
              <p className="text-xs">Seconds</p>
            </div>
          </div>
          <Button className="w-fit px-12 py-4">Buy Now!</Button>
        </div>
        <div className="relative flex items-center justify-center rounded-full">
          <div className="absolute h-1 w-1 rounded-full shadow-[0_35px_200px_150px] shadow-gray-400"></div>

          <NextImage
            alt="product-image"
            src="/images/jbl-radio.png"
            sizes="100vw"
            fill
            style={{
              objectFit: 'contain',
              width: '100%',
            }}
          ></NextImage>
        </div>
      </div>
      <ListProducts
        products={products}
        topic="Our Products"
        title="Explore Our Products"
        hasButton={true}
      />
      <div className="flex h-[48rem] w-full flex-col">
        <ListHeader topic="Featured" title="New Arrival" />
        <div className="mt-[3.75rem] grid h-full w-full grid-cols-[50%,repeat(2,minmax(0,1fr))] grid-rows-2 gap-8">
          {newArrival.map((na, idx) => (
            <BackgroundProduct
              key={na.id}
              className={twMerge(
                idx === 0 && 'row-span-2',
                idx === 1 && 'col-span-2',
              )}
              name={na.name}
              description={na.description}
              href={`/products/${na.id}`}
              imagePath={na.images[0]}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-[5.5rem]">
        <div className="flex flex-col items-center gap-6">
          <RoundedBackgroundIcon icon={TbTruckDelivery} />
          <div className="flex flex-col items-center gap-2">
            <p className="text-lg font-semibold">FREE AND FAST DELIVERY</p>
            <p className="text-sm">Free delivery for all orders over $140</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-6">
          <RoundedBackgroundIcon icon={TbHeadphones} />
          <div className="flex flex-col items-center gap-2">
            <p className="text-lg font-semibold">24/7 CUSTOMER SERVICE</p>
            <p className="text-sm">Friendly 24/7 customer supporth</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-6">
          <RoundedBackgroundIcon icon={LuShieldCheck} />
          <div className="flex flex-col items-center gap-2">
            <p className="text-lg font-semibold">MONEY BACK GUARANTEE</p>
            <p className="text-sm">We reurn money within 30 days</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleScrollTop}
        className="mb-[-6.75rem] ml-auto flex h-[2.875rem] w-[2.875rem] items-center justify-center rounded-full border-none bg-white hover:shadow-lg"
      >
        <ArrowUp />
      </button>
    </div>
  )
}

export async function getStaticProps() {
  const flashSales = await getProducts({ discount: 1, limit: 4 })
  const bestSellings = await getProducts({
    bestSelling: true,
    limit: 4,
    revalidate: 3,
  })
  const products = await getProducts({ limit: 4, revalidate: 24 })
  let newArrival = await getProducts({ revalidate: 3 })
  newArrival = newArrival
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 4)

  return { props: { flashSales, bestSellings, products, newArrival } }
}
