import { motion } from 'framer-motion'

import NextImage from '@/components/NextImage'

type StarsProps = {
  numberOfEvaluations?: number
  numberOfStars: number
  starSize?: number
  setNumberOfStars?: (stars: number) => void
  onStarClick?: (numberOfStars: number) => void
}

export default function Stars({
  numberOfEvaluations,
  numberOfStars,
  starSize = 20,
  setNumberOfStars,
  onStarClick,
}: StarsProps) {
  const stars = new Array(5)
    .fill(0)
    .map((star, i) =>
      i < numberOfStars && (numberOfStars - i >= 1 || numberOfStars % 1 === 0)
        ? 2
        : i < numberOfStars && numberOfStars % 1 !== 0
        ? 1
        : 0,
    )

  function handleUpdateNumberOfStars(idx: number) {
    if (setNumberOfStars) {
      setNumberOfStars(idx + 1)
    }
  }

  return (
    <div>
      <div className="flex items-center">
        {stars.map((star, i) => (
          <motion.div
            key={i} // Using index because the order will not be changed by state
            data-clickable={setNumberOfStars !== undefined}
            onClick={() => {
              onStarClick && onStarClick(i + 1)
              handleUpdateNumberOfStars(i)
            }}
            className="data-[clickable=true]:cursor-pointer"
            whileTap={setNumberOfStars ? { scale: 0.9 } : {}}
            whileHover={setNumberOfStars ? { scale: 1.2 } : {}}
            initial={setNumberOfStars ? { scale: 1.25 } : {}}
            animate={setNumberOfStars ? { scale: 1 } : {}}
          >
            <NextImage
              alt="star"
              src={
                star === 0
                  ? '/images/unfilled-star.png'
                  : star === 1
                  ? '/images/half-filled-star.png'
                  : '/images/star.png'
              }
              width={starSize}
              height={starSize}
            ></NextImage>
          </motion.div>
        ))}
        {numberOfEvaluations !== undefined && (
          <p className="ml-2 font-semibold text-gray-500">
            ({numberOfEvaluations})
          </p>
        )}
      </div>
    </div>
  )
}
