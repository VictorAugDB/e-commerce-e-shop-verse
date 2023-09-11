'use client'

import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import NextImage from '@/components/NextImage'

import { ImageType } from '@/app/products/[id]/Product'

type ImagesSwitchProps = {
  productImages: ImageType[]
}

export default function ImagesSwitch({ productImages }: ImagesSwitchProps) {
  const [images, setImages] = useState(productImages)
  const ref = useRef<HTMLDivElement | null>(null)

  function handleChangeImage(idx: number) {
    const imgs = [...images]
    const img = images[idx]
    imgs[idx] = imgs[imgs.length - 1]
    imgs[imgs.length - 1] = img

    setImages([...imgs])
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:max-h-[37.5rem] md:max-w-[43.875rem] md:grid-cols-[minmax(0,10.625rem)_minmax(0,31.25rem)]">
      <div className="order-2 flex flex-wrap justify-center gap-4 md:order-1 md:flex-col md:flex-nowrap">
        {images.slice(0, images.length - 1).map((i, idx) => (
          <motion.div
            onClick={() => handleChangeImage(idx)}
            key={i.id}
            className="relative flex w-[10.625rem] max-w-full cursor-pointer touch-none items-center justify-center rounded bg-gray-200 p-4 md:h-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <NextImage
              alt="product-image"
              src={i.image}
              width={134}
              height={114}
            ></NextImage>
          </motion.div>
        ))}
      </div>
      <div className="relative order-1 flex h-[22.5rem] w-full items-center justify-center rounded bg-gray-200 p-4 md:order-2 md:h-[37.5rem] md:max-w-[31.25rem]">
        <SwitchTransition>
          <CSSTransition
            key={images[images.length - 1].id}
            timeout={200}
            classNames="fade"
            nodeRef={ref}
            addEndListener={(done) => {
              const aux = ref.current as HTMLDivElement
              aux.addEventListener('transitionend', done, false)
            }}
          >
            <div ref={ref}>
              <NextImage
                alt="product-image"
                src={images[images.length - 1].image}
                fill
                sizes="100vw"
                style={{
                  objectFit: 'contain',
                }}
              ></NextImage>
            </div>
          </CSSTransition>
        </SwitchTransition>
      </div>
    </div>
  )
}
