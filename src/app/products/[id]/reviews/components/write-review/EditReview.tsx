import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { Dispatch, SetStateAction, useState } from 'react'
import { Edit } from 'react-feather'
import { useForm } from 'react-hook-form'

import { Review } from '@/lib/db/mongodb/reviews'

import Button from '@/components/buttons/Button'

import { ReviewFormInputs, reviewFormSchema } from '@/app/products/[id]/reviews'
import { WriteReview } from '@/app/products/[id]/reviews/components/write-review'

type EditReviewProps = {
  setReviews: Dispatch<SetStateAction<Review[]>>
  userId: string | undefined
  userName: string | null | undefined
  review: ReviewFormInputs & { id: string }
}

export function EditReview({
  setReviews,
  userId,
  userName,
  review,
}: EditReviewProps) {
  const [isWritingReview, setIsWritingReview] = useState(false)
  const { comment, recommend, score, title } = review

  const { handleSubmit, register, formState, control, reset } =
    useForm<ReviewFormInputs>({
      resolver: zodResolver(reviewFormSchema),
      defaultValues: {
        comment,
        recommend,
        score,
        title,
      },
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

    await fetch('/api/reviews', {
      method: 'PATCH',
      body: JSON.stringify({
        comment,
        recommended: recommend,
        evaluation: score,
        title,
        id: review.id,
      }),
    }).then((res) => res.json())

    setReviews((reviews) =>
      reviews.map((r) =>
        r.id !== review.id
          ? r
          : { ...r, comment, recommended: recommend, evaluation: score, title },
      ),
    )
    toogleWriteReview()
  }

  return (
    <Dialog.Root open={isWritingReview} onOpenChange={setIsWritingReview}>
      <Dialog.Trigger asChild>
        <div className="group flex cursor-pointer items-center gap-2 border-b border-transparent pb-px text-sm text-gray-600 transition-all hover:border-gray-600 hover:font-medium">
          <Edit className="h-4 w-4 group-hover:scale-105" />
          Edit
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[95vw] translate-x-[-50%] translate-y-[-50%] overflow-auto rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow sm:w-[90vw]">
          <div className="flex justify-center">
            <WriteReview
              toogleWriteReview={toogleWriteReview}
              modalClose={
                <Dialog.Close asChild>
                  <Button
                    type="button"
                    variant="light"
                    className="mx-auto block w-full py-3"
                  >
                    Cancel
                  </Button>
                </Dialog.Close>
              }
              handleSubmitChild={handleSubmitReview}
              formReturn={{
                control,
                formState,
                register,
                handleSubmit,
              }}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
