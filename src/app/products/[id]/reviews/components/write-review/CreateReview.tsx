import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { Dispatch, SetStateAction, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Review } from '@/lib/db/mongodb/reviews'
import { IntlHelper } from '@/lib/helpers/Intl'

import Button from '@/components/buttons/Button'

import { ReviewFormInputs, reviewFormSchema } from '@/app/products/[id]/reviews'
import { WriteReview } from '@/app/products/[id]/reviews/components/write-review'

type CreateReviewProps = {
  setReviews: Dispatch<SetStateAction<Review[]>>
  userId: string | undefined
  userName: string | null | undefined
  productId: string
}

export function CreateReview({
  setReviews,
  userId,
  userName,
  productId,
}: CreateReviewProps) {
  const [isWritingReview, setIsWritingReview] = useState(false)

  const { handleSubmit, register, formState, control, reset } =
    useForm<ReviewFormInputs>({
      resolver: zodResolver(reviewFormSchema),
    })

  function toogleWriteReview() {
    setIsWritingReview(!isWritingReview)
  }

  async function handleSubmitReview(data: ReviewFormInputs) {
    if (!(userName && userId)) {
      alert('Please login before send a review!')
      reset()
      return
    }

    const { comment, recommend, score, title } = data

    const id = await fetch('/api/reviews', {
      method: 'POST',
      body: JSON.stringify({
        comment,
        recommended: recommend,
        evaluation: score,
        title,
        userName: userName,
        userId: userId,
        productId,
      }),
    }).then((res) => res.json())

    setReviews((reviews) => [
      ...reviews,
      {
        id,
        comment,
        createdAt: IntlHelper.formatDateMonthLong(
          new Date().toISOString(),
          'en-US',
        ),
        evaluation: score,
        helpfulEvaluationsUsersIds: [],
        unhelpfulEvaluationsUsersIds: [],
        recommended: recommend,
        title,
        userName: userName,
        userId: userId,
      },
    ])
    reset()
    toogleWriteReview()
  }

  return (
    <>
      <Button
        onClick={toogleWriteReview}
        variant="light"
        className="block w-full max-w-[23.75rem] py-2"
      >
        <p className="text-center">Write a review</p>
      </Button>
      <AnimatePresence>
        {isWritingReview && (
          <motion.div
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex justify-center"
          >
            <WriteReview
              toogleWriteReview={toogleWriteReview}
              handleSubmitChild={handleSubmitReview}
              formReturn={{
                control,
                formState,
                register,
                handleSubmit,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
