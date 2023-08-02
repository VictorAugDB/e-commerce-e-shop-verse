import NextImage from '@/components/NextImage';

type StarsProps = {
  numberOfEvaluations: number;
  numberOfStars: number;
};

export default function Stars({
  numberOfEvaluations,
  numberOfStars,
}: StarsProps) {
  const stars = new Array(5)
    .fill(0)
    .map((star, i) =>
      i < numberOfStars && (numberOfStars - i >= 1 || numberOfStars % 1 === 0)
        ? 2
        : i < numberOfStars && numberOfStars % 1 !== 0
        ? 1
        : 0
    );

  return (
    <div>
      <div className='flex items-center'>
        {stars.map(
          (
            star,
            i // Using index because this will not be changed by state
          ) => (
            <NextImage
              key={i}
              alt='star'
              src={
                star === 0
                  ? '/images/unfilled-star.png'
                  : star === 1
                  ? '/images/half-filled-star.png'
                  : '/images/star.png'
              }
              width={20}
              height={20}
            ></NextImage>
          )
        )}
        <p className='ml-2 font-semibold text-gray-500'>
          ({numberOfEvaluations})
        </p>
      </div>
    </div>
  );
}
