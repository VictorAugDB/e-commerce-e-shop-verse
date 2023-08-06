'use client'

import { motion } from 'framer-motion'
import { Fragment, useEffect, useState } from 'react'
import { ArrowRight } from 'react-feather'

import NextImage from '@/components/NextImage'
import ShopNowButton from '@/components/ShopNowButton'

import { Promotion } from '@/pages'

export type PromotionProps = {
  promotions: Promotion[]
}

export function Promotions({ promotions }: PromotionProps) {
  const [currentPromotionIndex, setCurrentPromotionIndex] = useState(0)
  const currentPromotion = promotions[currentPromotionIndex]

  useEffect(() => {
    const id = setInterval(() => {
      const idx =
        currentPromotionIndex >= promotions.length - 1
          ? 0
          : currentPromotionIndex + 1

      setCurrentPromotionIndex(idx)
    }, 2000)

    return () => {
      clearInterval(id)
    }
  }, [promotions.length, currentPromotionIndex])

  return (
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
              src={currentPromotion.imageLogoPath}
              width={40}
              height={49}
              alt="promotion-logo"
            ></NextImage>
            <p className="text-white">{currentPromotion.name}</p>
          </div>
          <span className="text-5xl leading-[3.75rem] text-white">
            {currentPromotion.description}
          </span>
          <div>
            <ShopNowButton href={`/products/${currentPromotion.id}`}>
              <ArrowRight color="#FFFFFF" />
            </ShopNowButton>
          </div>
        </div>
        <div className="relative flex h-full w-full justify-end">
          <img
            className="h-auto w-auto"
            src={currentPromotion.imagePath}
            alt="product-image"
          ></img>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {promotions.map((p) => (
          <Fragment key={p.id}>
            <div className="h-3 w-3 rounded-full bg-gray-600">
              {currentPromotion.id === p.id ? (
                <motion.div
                  layoutId="currentPromotion"
                  className="h-full rounded-full border-2 border-white bg-green-700"
                />
              ) : null}
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  )
}
