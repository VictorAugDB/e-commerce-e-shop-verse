import { randomUUID } from 'crypto'
import { motion } from 'framer-motion'
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from 'next'
import { useRouter } from 'next/router'
import { MouseEvent as ReactMouseEvent, useEffect, useState } from 'react'
import { Heart, RefreshCcw } from 'react-feather'
import { TbTruckDelivery } from 'react-icons/tb'
import { twMerge } from 'tailwind-merge'

import { getProductDataByid, getProductsData } from '@/lib/data'

import Button from '@/components/buttons/Button'
import ImagesSwitch from '@/components/ImagesSwitch'
import ListProducts from '@/components/lists/ListProducts'
import { ProductColors } from '@/components/ProductColors'
import Stars from '@/components/Stars'
import Steps from '@/components/Steps'

import { Product } from '@/contexts/ProductsContext'
import { LocalStorage, LSWishlist } from '@/models/localStorage'

export type ImageType = {
  id: string
  image: string
}

type ProductProps = {
  product: Product
  images: ImageType[]
  relatedProducts: Product[]
  key: string
}

export default function Product({
  product,
  relatedProducts,
  images: productImages,
}: InferGetStaticPropsType<GetStaticProps<ProductProps>>) {
  const [selectedSize, setSelectedSize] = useState<null | string>(null)
  const [quantity, setQuantity] = useState(1)
  const [wishClicked, setWishClicked] = useState(false)
  const router = useRouter()

  const sizes: ['xs', 's', 'm', 'l', 'xl'] = ['xs', 's', 'm', 'l', 'xl']

  useEffect(() => {
    const wishlistProducts: LSWishlist[] = JSON.parse(
      localStorage.getItem(LocalStorage.WISHLIST) ?? '[]',
    )

    if (wishlistProducts.find((wp) => wp === product.id)) {
      setWishClicked(true)
    }
  }, [product])

  function handleSelectSize(size: string) {
    setSelectedSize(size)
  }

  function handleIncreaseQuantity() {
    setQuantity(quantity + 1)
  }

  function handleDecreaseQuantity() {
    setQuantity(quantity - 1)
  }

  function handleChangeQuantity(newQuantity: number, productQuantity: number) {
    if (newQuantity > productQuantity) {
      setQuantity(productQuantity)
    } else if (newQuantity <= 0) {
      setQuantity(1)
    } else {
      setQuantity(newQuantity)
    }
  }

  // TODO Add to a context
  function handleToggleWishList(
    e: ReactMouseEvent<HTMLDivElement, MouseEvent>,
    id: string,
  ) {
    e.preventDefault()
    e.stopPropagation()

    if (wishClicked) {
      setWishClicked(false)

      const ids: LSWishlist[] = JSON.parse(
        localStorage.getItem(LocalStorage.WISHLIST) ?? '[]',
      )

      localStorage.setItem(
        LocalStorage.WISHLIST,
        JSON.stringify(ids.filter((i) => i !== id)),
      )
    } else {
      setWishClicked(true)

      const ids: LSWishlist[] = JSON.parse(
        localStorage.getItem(LocalStorage.WISHLIST) ?? '[]',
      )

      ids.push(id)

      localStorage.setItem(LocalStorage.WISHLIST, JSON.stringify(ids))
    }
  }

  function handleNavigateToCheckout(hasSizes: boolean) {
    if (hasSizes && selectedSize === null) {
      alert('Please select the size.')
      return
    }

    router.push({
      pathname: '/checkout',
      query: { from: 'product', id: product.id, size: selectedSize, quantity },
    })
  }

  return (
    <div className="px-8 xl:px-[5.4375rem] 2xl:px-[8.4375rem]">
      <Steps
        flow="product"
        currentStep={2}
        category={product.category}
        productName={product.name}
      />
      <div
        className={twMerge(
          'flex flex-col xl:flex-row w-full gap-[68px] items-center justify-center',
          relatedProducts.length && 'mb-[8.75rem]',
        )}
      >
        <div className="space-y-2">
          <p className="xl:hidden">{product.name}</p>
          <ImagesSwitch productImages={productImages} />
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col gap-4">
            <h3 className="hidden xl:block">{product.name}</h3>
            <Stars
              numberOfEvaluations={product.evaluations}
              numberOfStars={product.stars}
            />
            <p className="text-sm">{product.description}</p>
          </div>
          <div className="my-6 h-px w-full bg-gray-600"></div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <p className="text-lg">Colours:</p>
              <div className="flex items-center gap-2">
                <ProductColors colors={['#000', '#999']} />
              </div>
            </div>
            {product.sizes && (
              <div className="flex items-center gap-6">
                <p className="text-lg">Sizes:</p>
                <div className="flex items-center gap-4">
                  {sizes.map((s) => (
                    <motion.button
                      key={s}
                      onClick={() => handleSelectSize(s)}
                      disabled={product.sizes && product.sizes[s] <= 0}
                      className={twMerge(
                        'h-8 w-8 rounded border bg-white disabled:cursor-not-allowed disabled:bg-gray-300/50',
                        selectedSize === s
                          ? 'border-green-700'
                          : 'border-gray-600',
                      )}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {selectedSize === s ? (
                        <motion.div
                          layoutId="selectedSize"
                          className="flex h-full w-full items-center justify-center rounded-sm bg-green-700 text-white"
                        >
                          <p className="text-sm font-medium">
                            {s.toUpperCase()}
                          </p>
                        </motion.div>
                      ) : (
                        <p className="text-sm font-medium">{s.toUpperCase()}</p>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center overflow-hidden rounded bg-white">
              <Button
                variant="ghost"
                className="h-[2.85rem] rounded-r-none border border-gray-600 text-2xl hover:bg-gray-200 "
                disabled={quantity === 1}
                onClick={handleDecreaseQuantity}
              >
                -
              </Button>
              <div className="flex h-[2.85rem] items-center border-x-0 border-y border-gray-600 px-1 text-center leading-6">
                <input
                  value={quantity}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.currentTarget.blur()
                    }
                  }}
                  onChange={(e) =>
                    handleChangeQuantity(
                      Number(e.target.value),
                      product.quantity,
                    )
                  }
                  type="number"
                  className="number-input-without-arrows w-16 border-0 text-center"
                />
              </div>
              <Button
                variant="green"
                disabled={quantity === product.quantity}
                className="h-[2.85rem] rounded-l-none border border-l-0 border-green-600 text-2xl"
                onClick={() => handleIncreaseQuantity()}
              >
                +
              </Button>
            </div>

            <Button
              onClick={() => handleNavigateToCheckout(!!product.sizes)}
              variant="green"
              className="h-[2.85rem] px-12"
            >
              Buy Now
            </Button>

            <div
              onClick={(e) => handleToggleWishList(e, product.id)}
              className="flex cursor-pointer items-center justify-center rounded border border-gray-600 p-[.375rem]"
            >
              <Heart
                width={20}
                height={20}
                strokeWidth={1.5}
                data-wished={wishClicked}
                className="data-[wished=true]:fill-red-400"
              />
            </div>
          </div>
          <div className="mt-11">
            <div className="flex w-full gap-4 rounded rounded-b-none border border-b-0 border-gray-600 px-4 py-6">
              <TbTruckDelivery className="h-10 w-10" strokeWidth={1.5} />
              <div className="space-y-2">
                <p className="font-medium">Free delivery</p>
                <p className="text-xs font-medium">
                  Enter your postal code for Delivery Availability
                </p>
              </div>
            </div>
            <div className="flex w-full gap-4 rounded rounded-t-none border border-gray-600 px-4 py-6">
              <RefreshCcw width={40} height={40} strokeWidth={1.5} />
              <div className="space-y-2">
                <p className="font-medium">Return Delivery</p>
                <p className="text-xs font-medium">
                  Free 30 Days Delivery Returns. Details
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {relatedProducts.length > 0 && (
        <ListProducts products={relatedProducts} topic="Related Items" />
      )}
    </div>
  )
}

export async function getStaticPaths() {
  const products = await getProductsData()
  const paths = products.map((p) => ({
    params: { id: p.id },
  }))

  // fallback false for now due to it's pre rendering all the products
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext<{ id: string }>): Promise<
  GetStaticPropsResult<ProductProps>
> {
  if (!params) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    }
  }

  const product = await getProductDataByid(params.id)

  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    }
  }

  const images = product.images.map((pi) => ({
    id: randomUUID(),
    image: pi,
  }))
  const relatedProducts: Product[] = await getProductsData({
    category: product.category,
  })

  return {
    props: {
      product,
      relatedProducts: relatedProducts
        .filter((rp) => rp.id !== params.id)
        .slice(0, 4),
      images,
      key: params.id,
    },
  }
}
