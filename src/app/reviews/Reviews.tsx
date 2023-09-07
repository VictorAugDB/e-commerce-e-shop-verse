'use client'

import { useEffect, useState } from 'react'

import { Review } from '@/lib/db/mongodb/reviews'

import Button from '@/components/buttons/Button'
import ArrowLink from '@/components/links/ArrowLink'
import { ManageReview } from '@/components/Review'

type ReviewsProps = {
  reviews: Review[]
  userId: string | undefined
  userName: string | null | undefined
}

export function Reviews({
  reviews: reviewsServerSide,
  userId,
  userName,
}: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoadingMoreReviews, setIsLoadingMoreReviews] = useState(false)

  useEffect(() => {
    setReviews(reviewsServerSide)
  }, [reviewsServerSide])

  async function handleLoadMoreReviews() {
    setIsLoadingMoreReviews(true)

    const res: Review[] = await fetch(
      `/api/reviews?skip=${reviews.length}&limit=10&userId=${userId}`,
    ).then((res) => res.json())

    if (res.length > 0) {
      setReviews([...reviews, ...res])
      setIsLoadingMoreReviews(false)
    } else {
      alert("There aren't more reviews!")
    }
  }

  return (
    <div className="mx-auto w-fit space-y-4">
      {reviews.map((r) => (
        <div key={r.id} className="space-y-2">
          <div className="ml-auto w-fit">
            <ArrowLink href={`/products/${r.productId}`}>
              Go to the product
            </ArrowLink>
          </div>

          <ManageReview
            review={r}
            setReviews={setReviews}
            userId={userId}
            userName={userName}
          />
        </div>
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
  )
}
