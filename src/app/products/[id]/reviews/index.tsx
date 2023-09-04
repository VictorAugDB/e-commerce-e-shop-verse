'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import {
  cloneElement,
  ComponentProps,
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { Check, Edit, X } from 'react-feather'
import { Controller, useForm, UseFormReturn } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

import { Review } from '@/lib/db/mongodb/reviews'
import { IntlHelper } from '@/lib/helpers/Intl'

import Button from '@/components/buttons/Button'
import Divider from '@/components/Divider'
import NextImage from '@/components/NextImage'
import Stars from '@/components/Stars'

type ReviewProps = ComponentProps<'div'>

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

export function Reviews({ className, ...props }: ReviewProps) {
  const { data: session } = useSession()
  const [isWritingReview, setIsWritingReview] = useState(false)
  const [reviewNumberOfStars, setReviewNumberOfStars] = useState(0)
  const [reviews, setReviews] = useState<Review[]>([])

  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
    control,
    reset,
  } = useForm<ReviewFormInputs>({
    resolver: zodResolver(reviewFormSchema),
  })

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

  useEffect(() => {
    async function getReviews() {
      const res: Review[] = await fetch('/api/reviews?skip=0&limit=10').then(
        (res) => res.json(),
      )

      setReviews(res)
    }
    getReviews()
  }, [])

  function toogleWriteReview() {
    setIsWritingReview(!isWritingReview)
  }

  async function handleSubmitReview(data: ReviewFormInputs) {
    if (!(session && session.user && session.user.name && session.user.id)) {
      alert('Please login before send a review!')
      reset()
      return
    }

    const { comment, recommend, score, title } = data

    const id = await fetch('/api/reviews', {
      method: 'POST',
      body: JSON.stringify({
        comment,
        recommend,
        evalutaiton: score,
        title,
        userName: session.user.name,
        userId: session.user.id,
      }),
    }).then((res) => res.json())

    setReviews([
      ...reviews,
      {
        id,
        comment,
        createdAt: IntlHelper.formatDateMonthLong(
          new Date().toISOString(),
          'en-US',
        ),
        evaluation: score,
        helpfulQuantity: 0,
        recommended: recommend,
        title,
        unhelpfulQuantity: 0,
        userName: session.user.name,
        userId: session.user.id,
      },
    ])
    reset()
    setIsWritingReview(false)
    setReviewNumberOfStars(0)
  }

  async function handleLoadMoreReviews() {
    // TODO call the API and set the result to the reviews
    const res: Review[] = await fetch('/api/reviews?skip=0&limit=10').then(
      (res) => res.json(),
    )

    setReviews([...reviews, ...res])
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
      </div>
      <CreateReview
        setReviews={setReviews}
        userId={session?.user.id}
        userName={session?.user.name}
      />
      <Divider />
      {reviews.length > 0 && (
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
                  {r.comment}
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
                </div>
              </div>
              <Divider />
            </>
          ))}
          <Button
            onClick={handleLoadMoreReviews}
            variant="light"
            className="mx-auto block px-12 py-3"
          >
            Load More
          </Button>
        </div>
      )}
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

type CreateReviewProps = {
  setReviews: Dispatch<SetStateAction<Review[]>>
  userId: string | undefined
  userName: string | null | undefined
}

function CreateReview({ setReviews, userId, userName }: CreateReviewProps) {
  const [isWritingReview, setIsWritingReview] = useState(false)
  const [reviewNumberOfStars, setReviewNumberOfStars] = useState(0)

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
        helpfulQuantity: 0,
        recommended: recommend,
        title,
        unhelpfulQuantity: 0,
        userName: userName,
        userId: userId,
      },
    ])
    reset()
    toogleWriteReview()
    setReviewNumberOfStars(0)
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

type EditReviewProps = {
  setReviews: Dispatch<SetStateAction<Review[]>>
  userId: string | undefined
  userName: string | null | undefined
  review: ReviewFormInputs & { id: string }
}

function EditReview({ setReviews, userId, userName, review }: EditReviewProps) {
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
    reset()
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

type WriteReviewProps = {
  toogleWriteReview: () => void
  modalClose?: ReactElement
  handleSubmitChild: (data: ReviewFormInputs) => void
  formReturn: Pick<
    UseFormReturn<ReviewFormInputs>,
    'control' | 'formState' | 'handleSubmit' | 'register'
  >
}

function WriteReview({
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
