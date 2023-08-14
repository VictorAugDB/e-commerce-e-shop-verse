'use client'

import { motion } from 'framer-motion'
import { Fragment, useEffect, useState } from 'react'
import { Instagram, Linkedin, Twitter } from 'react-feather'

import NextImage from '@/components/NextImage'

export type Executive = {
  id: string
  photo: string
  name: string
  role: string
  twitterUrl: string
  instagramUrl: string
  linkedinUrl: string
}

type ExecutivesProps = {
  executives: Executive[]
}

export function Executives({ executives }: ExecutivesProps) {
  const [currentExecutivesContainerIndex, setCurrentExecutivesContainerIndex] =
    useState(0)
  const currentExecutiveContainer = {
    id: executives[currentExecutivesContainerIndex].id,
    executives: executives.slice(
      currentExecutivesContainerIndex,
      currentExecutivesContainerIndex + 3,
    ),
  }

  useEffect(() => {
    const id = setInterval(() => {
      const idx =
        currentExecutivesContainerIndex >= executives.length - 3
          ? 0
          : currentExecutivesContainerIndex + 1

      setCurrentExecutivesContainerIndex(idx)
    }, 5000)

    return () => {
      clearInterval(id)
    }
  }, [executives.length, currentExecutivesContainerIndex])

  return (
    <section className="w-full space-y-[2.125rem] bg-transparent">
      <div className="flex w-full flex-col items-center gap-[1.875rem] xl:flex-row">
        {currentExecutiveContainer.executives.map((executive) => (
          <motion.div
            layoutId={executive.id}
            key={executive.id}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="mx-auto w-full max-w-[23.125rem] space-y-8"
          >
            <div className="relative flex h-[24.4375rem] w-full justify-center">
              <NextImage
                src={executive.photo}
                fill
                style={{
                  objectFit: 'contain',
                }}
                alt="executive-photo"
              ></NextImage>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <h2>{executive.name}</h2>
                <p>{executive.role}</p>
              </div>
              <div className="flex items-center gap-4">
                <Twitter />
                <Instagram />
                <Linkedin />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mx-auto flex w-fit items-center gap-3">
        {executives.slice(0, executives.length - 2).map((e) => (
          <Fragment key={e.id}>
            <div className="flex h-3 w-3 items-center justify-center rounded-full bg-gray-600">
              {currentExecutiveContainer.id === e.id ? (
                <motion.div
                  layoutId="currentExecutive"
                  className="h-2 w-2 rounded-full border border-white bg-green-700"
                />
              ) : null}
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  )
}
