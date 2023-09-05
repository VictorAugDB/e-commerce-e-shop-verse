import { cloneElement, ReactElement } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'

import Button from '@/components/buttons/Button'
import Stars from '@/components/Stars'

import { ReviewFormInputs } from '@/app/products/[id]/reviews'

type WriteReviewProps = {
  toogleWriteReview: () => void
  modalClose?: ReactElement
  handleSubmitChild: (data: ReviewFormInputs) => void
  formReturn: Pick<
    UseFormReturn<ReviewFormInputs>,
    'control' | 'formState' | 'handleSubmit' | 'register'
  >
}

export function WriteReview({
  toogleWriteReview,
  modalClose,
  handleSubmitChild,
  formReturn,
}: WriteReviewProps) {
  const {
    control,
    formState: { isSubmitting, errors },
    register,
    handleSubmit,
  } = formReturn

  return (
    <form
      data-is-modal={modalClose !== undefined}
      className="space-y-2 rounded border border-gray-400 p-4 data-[is-modal=true]:border-0 data-[is-modal=true]:p-0"
      onSubmit={handleSubmit(handleSubmitChild)}
    >
      <h4 className="text-center">
        Please fill the information below and send your review.
      </h4>
      <Controller
        control={control}
        name="score"
        render={(props) => {
          const {
            fieldState: { error },
            field,
          } = props

          return (
            <>
              <div className="flex items-center gap-2">
                <p>Score:</p>
                <Stars
                  onStarClick={field.onChange}
                  numberOfStars={field.value}
                  setNumberOfStars={() => ''}
                />
                {error && (
                  <span className="block text-red-700">{error.message}</span>
                )}
              </div>
            </>
          )
        }}
      />

      <div>
        <label htmlFor="title" className="block font-medium text-gray-600">
          Title
        </label>

        <input
          className="rounded p-2  text-sm outline-none ring-green-600 transition-all placeholder:text-gray-400 hover:ring-2 focus:ring-2"
          placeholder="Best product ever!"
          {...register('title')}
        />
        {errors.title && (
          <span className="block text-red-700">{errors.title.message}</span>
        )}
      </div>
      <div>
        <label htmlFor="comment" className="block font-medium text-gray-600">
          Your comment
        </label>

        <textarea
          id="comment"
          placeholder="Please share your thoughts about the product..."
          className="h-[12.9375rem] w-full max-w-[33.75rem] resize-none rounded border-0 bg-white p-2 text-sm outline-none ring-green-600 transition-all placeholder:text-gray-400 hover:ring-2 focus:ring-2 focus:ring-green-600"
          {...register('comment')}
        />
        {errors.comment && (
          <span className="block text-red-700">{errors.comment.message}</span>
        )}
      </div>
      <Controller
        control={control}
        name="recommend"
        render={(props) => {
          const {
            fieldState: { error },
            field,
          } = props
          return (
            <>
              <div className="flex items-center">
                <p className="text-gray-600">Do you recommend this product?</p>
                <p
                  data-recommended={field.value}
                  onClick={() => field.onChange(true)}
                  className="cursor-pointer border-r border-gray-600 px-2 py-1 text-green-500 transition-all hover:font-bold data-[recommended=true]:font-bold"
                >
                  Yes
                </p>
                <p
                  data-recommended={field.value}
                  onClick={() => field.onChange(false)}
                  className="cursor-pointer px-2 py-1 text-red-600 transition-all hover:font-bold data-[recommended=false]:font-bold"
                >
                  No
                </p>
              </div>
              {error && (
                <span className="block text-red-700">{error.message}</span>
              )}
            </>
          )
        }}
      />

      <div className="flex gap-2">
        {!modalClose ? (
          <Button
            type="button"
            variant="light"
            onClick={toogleWriteReview}
            disabled={isSubmitting}
            className="mx-auto block w-full py-3"
          >
            Cancel
          </Button>
        ) : (
          <>{cloneElement(modalClose, { disabled: isSubmitting })}</>
        )}
        <Button
          type="submit"
          variant="green"
          disabled={isSubmitting}
          className="mx-auto block w-full py-3"
        >
          Send
        </Button>
      </div>
    </form>
  )
}
