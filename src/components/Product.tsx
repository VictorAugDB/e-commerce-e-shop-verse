import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  MouseEvent as ReactMouseEvent,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Heart, Trash } from 'react-feather'
import useSWR, { SWRResponse } from 'swr'

import { Review } from '@/lib/db/mongodb/reviews'
import { getEvaluationsHash } from '@/lib/helpers/getEvaluationsHash'

import Button from '@/components/buttons/Button'
import NextImage from '@/components/NextImage'
import Stars from '@/components/Stars'

import { ProductsContext } from '@/contexts/ProductsContext'
import { LocalStorage, LSWishlist } from '@/models/localStorage'

type ProductProps = {
  hasButton?: boolean
  imagePath: string
  discount: number
  price: number
  wished: boolean
  name: string
  id: string
  isWishList: boolean
  handleRemoveFromWishList?: (
    e: ReactMouseEvent<HTMLDivElement, MouseEvent>,
    id: string,
  ) => void
}

const fetcher = (args: string) =>
  fetch(args).then((res) => {
    if (res.status !== 200) {
      return undefined
    }
    return res.json()
  })

export default function Product({
  imagePath,
  hasButton = false,
  discount,
  price,
  id,
  wished,
  name,
  isWishList,
  handleRemoveFromWishList,
}: ProductProps) {
  const { handleAddToCart } = useContext(ProductsContext)
  const [wishClicked, setWishClicked] = useState(false)
  const { data: reviews }: SWRResponse<Review[]> = useSWR(
    `/api/reviews?skip=0&limit=10&productId=${id}`,
    fetcher,
  )
  const { totalNumberOfEvaluations, evaluationsAverage } = useMemo(() => {
    if (!reviews) {
      return {
        totalNumberOfEvaluations: 0,
        evaluationsAverage: 0,
      }
    }

    const evaluations = getEvaluationsHash(
      reviews.map((r) => r.evaluation.toString()),
    )

    const totalNumberOfEvaluations = Object.values(evaluations).reduce(
      (acc, curr) => acc + curr,
      0,
    )

    const evaluationsAverage = (
      Object.entries(evaluations).reduce(
        (acc, [key, val]) => acc + Number(key) * val,
        0,
      ) / totalNumberOfEvaluations
    ).toFixed(2)

    return {
      totalNumberOfEvaluations,
      evaluationsAverage: Number(evaluationsAverage),
    }
  }, [reviews])

  useEffect(() => {
    setWishClicked(wished)
  }, [wished])

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

  return (
    <Link
      href={`/products/${id}`}
      className="w-full max-w-[16.875rem] justify-self-center"
    >
      <div className="group flex flex-1 cursor-pointer flex-col gap-4 transition-all hover:scale-105 hover:shadow-lg">
        <div className="relative flex h-[15.625rem] w-full flex-col items-center justify-end gap-[14px]">
          {discount > 0 && (
            <div className="absolute left-3 top-3 w-fit rounded bg-green-700 px-3 py-1 text-xs text-white">
              -{discount}%
            </div>
          )}
          {!isWishList ? (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => {
                handleToggleWishList(e, id)
              }}
              className="group/wishlist absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white"
            >
              <Heart
                data-wished={wishClicked}
                className="h-[1.125rem] w-[1.125rem] fill-transparent transition group-hover/wishlist:fill-red-400 data-[wished=true]:fill-red-400"
              />
            </motion.div>
          ) : (
            <div
              onClick={(e) => {
                if (typeof handleRemoveFromWishList !== 'undefined') {
                  handleRemoveFromWishList(e, id)
                }
              }}
              className="group/wishlist absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white"
            >
              <Trash className="h-[1.125rem] w-[1.125rem] fill-transparent transition group-hover/wishlist:stroke-red-400" />
            </div>
          )}

          {/* <div className="absolute right-3 top-11 mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-white">
            <Eye className="h-[1.125rem] w-[1.125rem]" />
          </div> */}
          <div className="relative h-[70%] w-[60%] p-8">
            <NextImage
              alt="product-image"
              src={imagePath}
              sizes="100vw"
              fill
              style={{
                objectFit: 'contain',
                width: '100%',
              }}
            ></NextImage>
          </div>
          {hasButton && (
            <Button
              variant="dark"
              className="flex w-full justify-center rounded-t-none"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()

                handleAddToCart(id)
              }}
            >
              Add To Cart
            </Button>
          )}
        </div>
        <div className="flex flex-col gap-2 transition-all group-hover:px-1">
          <p className="font-medium">{name}</p>
          <div className="flex items-center gap-3">
            {discount ? (
              <>
                <p className="font-medium text-green-700">
                  ${price - (discount * price) / 100}
                </p>
                <p className="font-medium text-gray-500 line-through">
                  ${price}
                </p>
              </>
            ) : (
              <p className="font-medium text-green-700">${price}</p>
            )}
          </div>
          <Stars
            numberOfEvaluations={totalNumberOfEvaluations}
            numberOfStars={evaluationsAverage}
          />
        </div>
      </div>
    </Link>
  )
}
