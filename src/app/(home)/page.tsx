import { IconType } from 'react-icons'
import { AiOutlineCamera } from 'react-icons/ai'
import { BsPhone, BsSmartwatch } from 'react-icons/bs'
import { FiHeadphones } from 'react-icons/fi'
import { HiOutlineDesktopComputer } from 'react-icons/hi'
import { LuGamepad } from 'react-icons/lu'
import { twMerge } from 'tailwind-merge'

import { getProductsData } from '@/lib/data'

import BackgroundProduct from '@/components/BackgroundProduct'
import Button from '@/components/buttons/Button'
import Differentials from '@/components/Differentials'
import Divider from '@/components/Divider'
import Categories from '@/components/lists/Categories'
import ListHeader from '@/components/lists/ListHeader'
import ListProducts from '@/components/lists/ListProducts'
import NextImage from '@/components/NextImage'
import { Promotions } from '@/components/Promotions'

import { ScrollTop } from '@/app/(home)/ScrollTop'

export type CategoriesWithIcons = {
  name: string
  icon: IconType
}

export type Promotion = {
  imageLogoPath: string
  name: string
  description: string
  imagePath: string
  id: string
}

export default async function HomePage() {
  const products = await getProductsData()
  // TODO create this methods to fetch data from and external database in the data file
  // const flashSales = await getProducts({ discount: 1, limit: 4 })
  // const bestSellings = await getProducts({
  //   bestSelling: true,
  //   limit: 4,
  //   revalidate: 3,
  // })
  // const products = await getProducts({ limit: 4, revalidate: 24 })
  // let newArrival = await getProducts({ revalidate: 3 })

  // TODO Remove this when the methods are created
  const flashSales = products.filter((p) => p.discount >= 1).slice(0, 4)
  const bestSellings = products
    .sort((a, b) => b.numberOfSales - a.numberOfSales)
    .slice(0, 4)

  // TODO Ref 1
  // let newArrival = await getProducts({ revalidate: 3 })
  // newArrival = newArrival
  //   .sort(
  //     (a, b) =>
  //       new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  //   )
  //   .slice(0, 4)

  let newArrival = products
  newArrival = newArrival
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 4)

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

  const promotions: Promotion[] = [
    {
      imageLogoPath: '/images/promotion-logo.png',
      name: 'iPhone 14 Series',
      description: 'Up to 10% off Voucher',
      imagePath: '/images/promotion-image.png',
      id: '1',
    },
    {
      imageLogoPath: '/images/promotion-logo.png',
      name: 'iPhone 14 Series',
      description: 'Up to 11% off Voucher',
      imagePath: '/images/promotion-image.png',
      id: '2',
    },
    {
      imageLogoPath: '/images/promotion-logo.png',
      name: 'iPhone 14 Series',
      description: 'Up to 12% off Voucher',
      imagePath: '/images/promotion-image.png',
      id: '3',
    },
  ]

  return (
    <div className="flex flex-col items-center gap-20 px-2 sm:px-8 2xl:px-[8.4375rem]">
      <div className="flex w-full gap-[2.8125rem]">
        <nav
          className="
          hidden w-full max-w-[13.5625rem] 
          flex-col gap-4 
          border-r border-gray-300
          pr-4 pt-10
          2xl:flex"
        >
          {categories.map((c) => (
            <p key={c}>{c}</p>
          ))}
        </nav>

        <Promotions promotions={promotions}></Promotions>
      </div>
      <ListProducts
        products={flashSales}
        topic="Today's"
        title="Flash Sales"
        filter="flash-sales"
        hasTimer={true}
        hasViewAllButton
        hasCartButton
      />
      <Divider />
      <Categories categories={categoriesWithIcons} />
      <Divider />
      <ListProducts
        products={bestSellings}
        filter="best-sellings"
        topic="This Month"
        title="Best Selling Products"
        hasViewAllButton
        hasCartButton
      />
      <div className="grid grid-cols-1 grid-rows-2 gap-7 bg-black p-8 md:h-[31.25rem] md:grid-cols-2 md:grid-rows-1 md:py-[4.3125rem] lg:px-14">
        <div className="flex flex-col">
          <p className="mb-7 font-semibold text-brown-300">Categories</p>
          <h1 className="h0 mb-8 text-white">Enhance Your Music Experience</h1>
          <div className="mb-8 flex items-center gap-2 lg:gap-10">
            <div className="flex h-[3.875rem] w-[3.875rem] flex-col items-center justify-center rounded-full bg-white text-center">
              <p className="font-semibold">05</p>
              <p className="px-1 text-xs">Days</p>
            </div>
            <div className="flex h-[3.875rem] w-[3.875rem] flex-col items-center justify-center rounded-full bg-white text-center">
              <p className="font-semibold">23</p>
              <p className="px-1 text-xs">Hours</p>
            </div>
            <div className="flex h-[3.875rem] w-[3.875rem] flex-col items-center justify-center rounded-full bg-white text-center">
              <p className="font-semibold">59</p>
              <p className="px-1 text-xs">Minutes</p>
            </div>
            <div className="flex h-[3.875rem] w-[3.875rem] flex-col items-center justify-center rounded-full bg-white text-center">
              <p className="font-semibold">35</p>
              <p className="px-1 text-xs">Seconds</p>
            </div>
          </div>
          <Button className="w-fit border border-white px-12 py-4 text-white hover:shadow-white">
            Buy Now!
          </Button>
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
        hasViewAllButton
        hasCartButton
      />
      <div className="flex h-[96rem] w-full flex-col lg:h-[48rem]">
        <ListHeader topic="Featured" title="New Arrival" />
        <div className="mt-[3.75rem] grid h-full w-full grid-cols-1 grid-rows-4 gap-8 lg:grid-cols-[50%,repeat(2,minmax(0,1fr))] lg:grid-rows-2">
          {newArrival.map((na, idx) => (
            <BackgroundProduct
              key={na.id}
              className={twMerge(
                idx === 0 && 'lg:row-span-2',
                idx === 1 && 'lg:col-span-2',
              )}
              name={na.name}
              description={na.description}
              href={`/products/${na.id}`}
              imagePath={na.images[0]}
            />
          ))}
        </div>
      </div>
      <Differentials />
      <ScrollTop />
    </div>
  )
}
