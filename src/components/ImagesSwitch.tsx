'use client'

import { useRef, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import NextImage from '@/components/NextImage'

import { ImageType } from '@/pages/products/[id]'

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
    <div className="grid max-h-[37.5rem] w-full max-w-[43.875rem] grid-cols-[10.625rem_31.25rem] gap-8">
      <div className="flex flex-col gap-4">
        {images.slice(0, images.length - 1).map((i, idx) => (
          <div
            onClick={() => handleChangeImage(idx)}
            key={i.id}
            className="relative flex h-full w-[10.625rem] max-w-full touch-none items-center justify-center rounded bg-gray-200 p-4"
          >
            <NextImage
              alt="product-image"
              src={i.image}
              width={134}
              height={114}
            ></NextImage>
          </div>
        ))}
      </div>
      <div className="relative flex h-[37.5rem] w-[31.25rem] items-center justify-center rounded bg-gray-200 p-4">
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
                width={446}
                height={315}
              ></NextImage>
            </div>
          </CSSTransition>
        </SwitchTransition>
      </div>
    </div>
  )
}
