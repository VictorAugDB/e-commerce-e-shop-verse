import { Dispatch, Fragment, SetStateAction, useState } from 'react'
import { Check, Trash2, X } from 'react-feather'

import { Review } from '@/lib/db/mongodb/reviews'

import Button from '@/components/buttons/Button'
import { ConfirmationDialog } from '@/components/dialogs/ConfirmationDialog'
import Divider from '@/components/Divider'
import Stars from '@/components/Stars'

import { EvaluateRelevance } from '@/app/products/[id]/reviews/components/EvaluateRelevance'
import { EditReview } from '@/app/products/[id]/reviews/components/write-review/EditReview'

type ManageReviewProps = {
  review: Review
  setReviews: Dispatch<SetStateAction<Review[]>>
  userId: string | undefined
  userName: string | null | undefined
}

export function ManageReview({
  review,
  setReviews,
  userId,
  userName,
}: ManageReviewProps) {
  const [isRelevanceEvaluationLoading, setIsRelevanceEvaluationLoading] =
    useState(false)

  async function handleDeleteReview(id: string) {
    await fetch('/api/reviews', {
      method: 'DELETE',
      body: JSON.stringify({
        id,
      }),
    })

    setReviews((reviews) => reviews.filter((r) => r.id !== id))
  }

  async function toogleHelfulUsersIds(reviewId: string) {
    if (!userId) {
      alert('Please login before evaluate if this review is helpful!')
      return
    }

    await fetch('/api/reviews/helpful', {
      method: 'PATCH',
      body: JSON.stringify({ id: reviewId, userId }),
    }).then((res) => res.json())

    setReviews((reviews) => {
      return reviews.map((r) => {
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
    })
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

    setReviews((reviews) => {
      return reviews.map((r) => {
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
      })
    })
  }

  return (
    <>
      <Fragment key={review.id}>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs">{review.userName}</p>
            <Stars numberOfStars={review.evaluation} starSize={12} />
          </div>
          <p className="max-w-content-screen break-words">{review.title}</p>
          <p className="max-w-content-screen break-words text-xs">
            {review.comment}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600 sm:gap-8 md:text-sm lg:justify-start">
            <div className="flex items-center gap-4">
              <p>Helpful?</p>
              <div className="flex items-center">
                <EvaluateRelevance
                  handleEvaluate={toogleHelfulUsersIds}
                  isEvaluated={
                    !!review.helpfulEvaluationsUsersIds.find(
                      (heuid) => heuid === userId,
                    )
                  }
                  isLoading={isRelevanceEvaluationLoading}
                  reviewId={review.id}
                  setIsLoading={setIsRelevanceEvaluationLoading}
                >
                  Yes ({review.helpfulEvaluationsUsersIds.length})
                </EvaluateRelevance>
                <EvaluateRelevance
                  handleEvaluate={toogleUnhelfulUsersIds}
                  isEvaluated={
                    !!review.unhelpfulEvaluationsUsersIds.find(
                      (heuid) => heuid === userId,
                    )
                  }
                  isLoading={isRelevanceEvaluationLoading}
                  reviewId={review.id}
                  setIsLoading={setIsRelevanceEvaluationLoading}
                >
                  No ({review.unhelpfulEvaluationsUsersIds.length})
                </EvaluateRelevance>
              </div>
            </div>
            <p>{review.createdAt}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {review.recommended ? (
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
            {userId === review.userId && (
              <div className="flex items-center gap-4">
                <EditReview
                  setReviews={setReviews}
                  userId={userId}
                  userName={userName}
                  review={{
                    comment: review.comment,
                    recommend: review.recommended,
                    score: review.evaluation,
                    title: review.title,
                    id: review.id,
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
                      onClick={() => handleDeleteReview(review.id)}
                      className="block text-center"
                    >
                      Yes, Remove this review
                    </Button>
                  }
                  description="Confirm that you really want to delete this review."
                />
              </div>
            )}
          </div>
        </div>
        <Divider />
      </Fragment>
    </>
  )
}
