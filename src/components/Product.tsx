import Link from 'next/link'
import { Eye, Heart } from 'react-feather'

import Button from '@/components/buttons/Button'
import NextImage from '@/components/NextImage'
import Stars from '@/components/Stars'

type ProductProps = {
  hasButton?: boolean
  imagePath: string
  discount: number
  price: number
  numberOfStars: number
  numberOfEvaluations: number
  name: string
  id: string
}

export default function Product({
  imagePath,
  hasButton = false,
  discount,
  price,
  id,
  numberOfStars,
  numberOfEvaluations,
  name,
}: ProductProps) {
  return (
    <Link href={`/products/${id}`} scroll={false}>
      <div className="flex min-w-[16.875rem] flex-1 cursor-pointer flex-col gap-4 transition-all hover:scale-105 hover:shadow-lg">
        <div className="relative flex h-[15.625rem] w-full flex-col items-center justify-end gap-[14px]">
          {discount > 0 && (
            <div className="absolute left-3 top-3 w-fit rounded bg-green-700 px-3 py-1 text-xs text-white">
              -{discount}%
            </div>
          )}
          <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white">
            <Heart className="h-[1.125rem] w-[1.125rem]" />
          </div>
          <div className="absolute right-3 top-11 mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-white">
            <Eye className="h-[1.125rem] w-[1.125rem]" />
          </div>
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
              }}
            >
              Add To Cart
            </Button>
          )}
        </div>
        <div className="flex flex-col gap-2">
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
            numberOfEvaluations={numberOfEvaluations}
            numberOfStars={numberOfStars}
          />
        </div>
      </div>
    </Link>
  )
}
