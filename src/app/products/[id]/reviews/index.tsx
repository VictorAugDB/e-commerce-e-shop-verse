'use client'

import { ComponentProps, useState } from 'react'
import { Check, X } from 'react-feather'
import { twMerge } from 'tailwind-merge'

import { IntlHelper } from '@/lib/helpers/Intl'

import Button from '@/components/buttons/Button'
import Divider from '@/components/Divider'
import NextImage from '@/components/NextImage'
import Stars from '@/components/Stars'

type ReviewProps = ComponentProps<'div'>

type Review = {
  title: string
  description: string
  evaluation: number
  userName: string
  recommended: boolean
  helpfulQuantity: number
  unhelpfulQuantity: number
  createdAt: string
}

export function Reviews({ className, ...props }: ReviewProps) {
  const [isWritingReview, setIsWritingReview] = useState(false)
  const [reviewNumberOfStars, setReviewNumberOfStars] = useState(0)

  const evaluations = {
    5: 2000,
    4: 800,
    3: 100,
    2: 50,
    1: 300,
  }

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

  const recommended = Math.round((3000 / totalNumberOfEvaluations) * 100)

  const reviews: Review[] = [
    {
      description: "That's the best product I've ever bought",
      title: 'As Good as Pancakes',
      evaluation: 5,
      userName: 'Jitusi Amada',
      recommended: true,
      createdAt: IntlHelper.formatDateMonthLong(
        '2023-09-03T18:08:34.728Z',
        'en-US',
      ),
      helpfulQuantity: 5,
      unhelpfulQuantity: 2,
    },
    {
      description:
        "That's the worst product I've ever bought, I want the refund!!!!!!!!!!!!!!!",
      title: 'As Bad as Shout',
      evaluation: 1,
      userName: 'Holy Mouli',
      recommended: false,
      createdAt: IntlHelper.formatDateMonthLong(
        '2023-09-03T18:08:34.728Z',
        'en-US',
      ),
      helpfulQuantity: 999,
      unhelpfulQuantity: 2,
    },
    {
      description:
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      title:
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      evaluation: 4,
      userName: 'Holy Graao',
      recommended: true,
      createdAt: IntlHelper.formatDateMonthLong(
        '2023-09-03T18:08:34.728Z',
        'en-US',
      ),
      helpfulQuantity: 5,
      unhelpfulQuantity: 2,
    },
  ]

  function toogleWriteReview() {
    setIsWritingReview(!isWritingReview)
  }

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <div className="w-full max-w-[23.75rem] space-y-5">
        <div className={twMerge('flex h-full gap-6', className)} {...props}>
          <div className="flex flex-1 flex-col-reverse justify-between gap-2">
            {Object.entries(evaluations).map(([key, val]) => (
              <Progress
                key={key}
                currentEvaluation={Number(key)}
                numberOfCurrentEvaluations={val}
                totalNumberOfEvaluations={totalNumberOfEvaluations}
              />
            ))}
          </div>
          <div className="space-y-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3>{evaluationsAverage}</h3>
                <NextImage
                  alt="star"
                  src="/images/star.png"
                  width={16}
                  height={16}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <p className="text-xs text-gray-600">
                {totalNumberOfEvaluations} Reviews
              </p>
            </div>
            <div className="space-y-1">
              <h3>{recommended}%</h3>

              <p className="text-xs text-gray-600">Recommended</p>
            </div>
          </div>
        </div>
        <Button
          onClick={toogleWriteReview}
          variant="light"
          className="block w-full py-2"
        >
          <p className="text-center">Write a review</p>
        </Button>
      </div>
      {isWritingReview && (
        <div className="space-y-2 rounded border border-gray-400 p-4">
          <h4 className="text-center">
            Please fill the required fields and send your review.
          </h4>
          <div className="flex items-center gap-2">
            <p>Score:</p>
            <Stars
              numberOfStars={reviewNumberOfStars}
              setNumberOfStars={setReviewNumberOfStars}
            />
          </div>
          <div>
            <label htmlFor="title" className="block font-medium text-gray-600">
              Title
            </label>

            <input
              className="rounded p-2 text-sm placeholder:text-gray-400"
              placeholder="Best product ever!"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block font-medium text-gray-600"
            >
              Your comment
            </label>

            <textarea
              id="description"
              placeholder="Please share your thoughts about the product..."
              className="h-[12.9375rem] w-[33.75rem] resize-none rounded border-0 bg-white p-2 text-sm outline-none placeholder:text-gray-400 focus:ring-0"
            />
          </div>
          <div className="flex items-center">
            <p className="text-gray-600">Do you recommend this product?</p>
            <p className="cursor-pointer border-r border-gray-600 px-2 py-1 text-green-500 transition-all hover:font-bold">
              Yes
            </p>
            <p className="cursor-pointer px-2 py-1 text-red-600 transition-all hover:font-bold">
              No
            </p>
          </div>
          <Button variant="green" className="mx-auto block w-full py-3">
            Send
          </Button>
        </div>
      )}
      <Divider />
      <div className="flex-1 space-y-4">
        {reviews.map((r) => (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs">{r.userName}</p>
                <Stars numberOfStars={r.evaluation} starSize={12} />
              </div>
              <p className="max-w-content-screen break-words">{r.title}</p>
              <p className="max-w-content-screen break-words text-xs line-clamp-5">
                {r.description}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600 sm:gap-8 md:text-sm lg:justify-start">
                <div className="flex items-center gap-4">
                  <p>Helpful?</p>
                  <div className="flex items-center">
                    <p className="cursor-pointer border-r border-gray-400 px-2 py-1 transition-all hover:font-bold hover:tracking-tight">
                      Yes ({r.helpfulQuantity})
                    </p>
                    <p className="cursor-pointer px-2 py-1 transition-all hover:font-bold">
                      No ({r.unhelpfulQuantity})
                    </p>
                  </div>
                </div>
                <p>{r.createdAt}</p>
              </div>
              {r.recommended ? (
                <div className="flex items-center gap-2 text-sm text-green-500">
                  <Check className="h-3 w-3" />
                  Recommended
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <X className="h-3 w-3" />
                  Not recommended
                </div>
              )}
            </div>
            <Divider />
          </>
        ))}
      </div>
    </div>
  )
}

type ProgressProps = {
  currentEvaluation: number
  numberOfCurrentEvaluations: number
  totalNumberOfEvaluations: number
}

function Progress({
  currentEvaluation,
  numberOfCurrentEvaluations,
  totalNumberOfEvaluations,
}: ProgressProps) {
  return (
    <div className="flex h-fit w-full items-center gap-2">
      <p className="text-xs text-gray-600">{currentEvaluation}</p>
      <div className="h-2 flex-1 overflow-hidden rounded bg-gray-400">
        <span
          className="block h-full bg-yellow-500"
          style={{
            width: `${
              (numberOfCurrentEvaluations / totalNumberOfEvaluations) * 100
            }%`,
          }}
        ></span>
      </div>
    </div>
  )
}
