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
import { Check, Trash2, X } from 'react-feather'
import useSWR, { SWRResponse } from 'swr'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

import { Review } from '@/lib/db/mongodb/reviews'
import { getEvaluationsHash } from '@/lib/helpers/getEvaluationsHash'

import Button from '@/components/buttons/Button'
import { ConfirmationDialog } from '@/components/dialogs/ConfirmationDialog'
import Divider from '@/components/Divider'
import NextImage from '@/components/NextImage'
import Stars from '@/components/Stars'

import { EvaluateRelevance } from '@/app/products/[id]/reviews/components/EvaluateRelevance'
import { Progress } from '@/app/products/[id]/reviews/components/Progress'
import { CreateReview } from '@/app/products/[id]/reviews/components/write-review/CreateReview'
import { EditReview } from '@/app/products/[id]/reviews/components/write-review/EditReview'

type ReviewProps = ComponentProps<'div'> & {
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

const fetcher = (args: string) =>
  fetch(args).then((res) => {
    if (res.status !== 200) {
      return undefined
    }
    return res.json()
  })

export function Reviews({ className, productId, ...props }: ReviewProps) {
  const { data: session } = useSession()
  const { data: reviewRes }: SWRResponse<Review[]> = useSWR(
    `/api/reviews?skip=0&limit=10&productId=${productId}`,
    fetcher,
  )
  const [reviews, setReviews] = useState<Review[]>([])
  const userId = session?.user.id
  const [isRelevanceEvaluationLoading, setIsRelevanceEvaluationLoading] =
    useState(false)
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
    if (reviewRes) {
      setReviews(sortLoggedUserCommentsFirst(reviewRes))
    }
  }, [sortLoggedUserCommentsFirst, reviewRes])

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

  async function handleDeleteReview(id: string) {
    await fetch('/api/reviews', {
      method: 'DELETE',
      body: JSON.stringify({
        id,
      }),
    })

    setReviews(reviews.filter((r) => r.id !== id))
  }

  async function toogleHelfulUsersIds(reviewId: string) {
    const userId = session?.user.id

    if (!userId) {
      alert('Please login before evaluate if this review is helpful!')
      return
    }

    await fetch('/api/reviews/helpful', {
      method: 'PATCH',
      body: JSON.stringify({ id: reviewId, userId }),
    }).then((res) => res.json())

    const updatedReview = reviews.map((r) => {
      if (r.id === reviewId) {
        const idx = r.helpfulEvaluationsUsersIds.findIndex(
          (id) => id === userId,
        )

        return idx !== -1
          ? {
              ...r,
              helpfulEvaluationsUsersIds: [
                ...r.helpfulEvaluationsUsersIds.slice(0, idx),
                ...r.helpfulEvaluationsUsersIds.slice(idx + 1),
              ],
            }
          : {
              ...r,
              helpfulEvaluationsUsersIds: [
                ...r.helpfulEvaluationsUsersIds,
                userId,
              ],
              unhelpfulEvaluationsUsersIds:
                r.unhelpfulEvaluationsUsersIds.filter(
                  (heuid) => heuid !== userId,
                ),
            }
      } else {
        return r
      }
    })

    setReviews(updatedReview)
  }

  async function toogleUnhelfulUsersIds(reviewId: string) {
    if (!userId) {
      alert('Please login before evaluate if this review is helpful!')
      return
    }

    await fetch('/api/reviews/unhelpful', {
      method: 'PATCH',
      body: JSON.stringify({ id: reviewId, userId }),
    }).then((res) => res.json())

    setReviews(
      reviews.map((r) => {
        if (r.id === reviewId) {
          const idx = r.unhelpfulEvaluationsUsersIds.findIndex(
            (id) => id === userId,
          )

          return idx !== -1
            ? {
                ...r,
                unhelpfulEvaluationsUsersIds: [
                  ...r.unhelpfulEvaluationsUsersIds.slice(0, idx),
                  ...r.unhelpfulEvaluationsUsersIds.slice(idx + 1),
                ],
              }
            : {
                ...r,
                unhelpfulEvaluationsUsersIds: [
                  ...r.unhelpfulEvaluationsUsersIds,
                  userId,
                ],
                helpfulEvaluationsUsersIds: r.helpfulEvaluationsUsersIds.filter(
                  (heuid) => heuid !== userId,
                ),
              }
        } else {
          return r
        }
      }),
    )
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
                <Fragment key={r.id}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs">{r.userName}</p>
                      <Stars numberOfStars={r.evaluation} starSize={12} />
                    </div>
                    <p className="max-w-content-screen break-words">
                      {r.title}
                    </p>
                    <p className="max-w-content-screen break-words text-xs">
                      {r.comment}
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600 sm:gap-8 md:text-sm lg:justify-start">
                      <div className="flex items-center gap-4">
                        <p>Helpful?</p>
                        <div className="flex items-center">
                          <EvaluateRelevance
                            handleEvaluate={toogleHelfulUsersIds}
                            isEvaluated={
                              !!r.helpfulEvaluationsUsersIds.find(
                                (heuid) => heuid === userId,
                              )
                            }
                            isLoading={isRelevanceEvaluationLoading}
                            reviewId={r.id}
                            setIsLoading={setIsRelevanceEvaluationLoading}
                          >
                            Yes ({r.helpfulEvaluationsUsersIds.length})
                          </EvaluateRelevance>
                          <EvaluateRelevance
                            handleEvaluate={toogleUnhelfulUsersIds}
                            isEvaluated={
                              !!r.unhelpfulEvaluationsUsersIds.find(
                                (heuid) => heuid === userId,
                              )
                            }
                            isLoading={isRelevanceEvaluationLoading}
                            reviewId={r.id}
                            setIsLoading={setIsRelevanceEvaluationLoading}
                          >
                            No ({r.unhelpfulEvaluationsUsersIds.length})
                          </EvaluateRelevance>
                        </div>
                      </div>
                      <p>{r.createdAt}</p>
                    </div>
                    <div className="flex items-center gap-4">
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
                      {userId === r.userId && (
                        <>
                          <EditReview
                            setReviews={setReviews}
                            userId={session?.user.id}
                            userName={session?.user.name}
                            review={{
                              comment: r.comment,
                              recommend: r.recommended,
                              score: r.evaluation,
                              title: r.title,
                              id: r.id,
                            }}
                          />

                          <ConfirmationDialog
                            openButton={
                              <div className="group flex cursor-pointer items-center gap-2 border-b border-transparent pb-px text-sm text-red-600 transition-all hover:border-red-600 hover:font-medium">
                                <Trash2 className="h-4 w-4 group-hover:scale-105" />
                                Delete
                              </div>
                            }
                            actionButton={
                              <Button
                                variant="green"
                                onClick={() => handleDeleteReview(r.id)}
                              >
                                Yes, Remove this review
                              </Button>
                            }
                            description="Confirm that you really want to delete this review."
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <Divider />
                </Fragment>
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
