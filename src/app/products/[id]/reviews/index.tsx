'use client'

import { useSession } from 'next-auth/react'
import {
  ComponentProps,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

import { Review } from '@/lib/db/mongodb/reviews'
import { getEvaluationsHash } from '@/lib/helpers/getEvaluationsHash'

import Button from '@/components/buttons/Button'
import Divider from '@/components/Divider'
import NextImage from '@/components/NextImage'
import { ManageReview } from '@/components/Review'

import { Progress } from '@/app/products/[id]/reviews/components/Progress'
import { CreateReview } from '@/app/products/[id]/reviews/components/write-review/CreateReview'

type ReviewProps = ComponentProps<'div'> & {
  reviews: Review[]
  productId: string
}

export const reviewFormSchema = z.object({
  score: z
    .number({
      required_error: 'Please rate the product',
    })
    .min(1),
  title: z.string().nonempty('The title is required').min(4).max(40),
  comment: z.string().nonempty('Please give a comment').min(30).max(500),
  recommend: z.boolean({
    required_error:
      "Please choose if you recommend or don't recommend the product",
  }),
})

export type ReviewFormInputs = z.infer<typeof reviewFormSchema>

export function Reviews({
  className,
  reviews: initialReviews,
  productId,
  ...props
}: ReviewProps) {
  const { data: session } = useSession()

  const [reviews, setReviews] = useState<Review[]>([])
  const userId = session?.user.id

  const [isLoadingMoreReviews, setIsLoadingMoreReviews] = useState(false)

  const {
    evaluations,
    evaluationsAverage,
    recommended,
    totalNumberOfEvaluations,
  } = useMemo(() => {
    const evaluations = getEvaluationsHash(
      reviews.map((r) => r.evaluation.toString()),
    )

    const numberOfRecommended = reviews.reduce(
      (acc, curr) => (curr.recommended ? acc + 1 : acc),
      0,
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

    const recommended = Math.round(
      (numberOfRecommended / totalNumberOfEvaluations) * 100,
    )

    return {
      evaluations,
      evaluationsAverage,
      recommended,
      totalNumberOfEvaluations,
    }
  }, [reviews])

  const sortLoggedUserCommentsFirst = useCallback(
    (reviewsToSort: Review[]) => {
      return reviewsToSort.sort((a, b) => {
        if (a.userId === userId && b.userId !== userId) {
          return -1 // Comment 'a' comes before Comment 'b'
        } else if (a.userId !== userId && b.userId === userId) {
          return 1 // Comment 'b' comes before Comment 'a'
        } else {
          return 0 // Comments have the same userId or neither of them is put first
        }
      })
    },
    [userId],
  )

  useEffect(() => {
    if (initialReviews) {
      setReviews(sortLoggedUserCommentsFirst(initialReviews))
    }
  }, [sortLoggedUserCommentsFirst, initialReviews])

  async function handleLoadMoreReviews() {
    setIsLoadingMoreReviews(true)

    const res: Review[] = await fetch(
      `/api/reviews?skip=${reviews.length}&limit=10&productId=${productId}`,
    ).then((res) => res.json())

    if (res.length > 0) {
      setReviews(sortLoggedUserCommentsFirst([...reviews, ...res]))
      setIsLoadingMoreReviews(false)
    } else {
      alert("There aren't more reviews!")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      {reviews && reviews.length > 0 ? (
        <>
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
          </div>
          <CreateReview
            setReviews={setReviews}
            userId={session?.user.id}
            userName={session?.user.name}
            productId={productId}
          />
          <Divider />
          {reviews.length > 0 && (
            <div className="flex-1 space-y-4">
              {reviews.map((r) => (
                <ManageReview
                  key={r.id}
                  review={r}
                  userId={userId}
                  userName={session?.user.name}
                  setReviews={setReviews}
                />
              ))}

              <Button
                onClick={handleLoadMoreReviews}
                variant="light"
                disabled={isLoadingMoreReviews}
                className="mx-auto block px-12 py-3 disabled:cursor-not-allowed"
              >
                Load More
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="mt-3 flex flex-col items-center justify-center">
          <h4>There aren't any reviews, be the first to write one!</h4>
          <CreateReview
            setReviews={setReviews}
            userId={session?.user.id}
            userName={session?.user.name}
            productId={productId}
          />
        </div>
      )}
    </div>
  )
}
