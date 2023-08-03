import NextImage from '@/components/NextImage'
import ShopNowButton from '@/components/ShopNowButton'

type BackgroundProductProps = {
  imagePath: string
  name: string
  description: string
  href: string
  className?: string
}

export default function BackgroundProduct({
  imagePath,
  name,
  description,
  href,
  className,
}: BackgroundProductProps) {
  return (
    <div
      className={
        className +
        ' relative flex flex-1 flex-col justify-end gap-4 bg-black p-6 rounded'
      }
    >
      <div className="absolute bottom-6 z-10 flex flex-col gap-4 text-white">
        <h3>{name}</h3>
        <p className="text-sm">{description}</p>
        <ShopNowButton href={href} />
      </div>
      <NextImage
        alt="product-image"
        src={imagePath}
        sizes="100vw"
        fill
        style={{
          objectFit: 'contain',
          width: '100%',
        }}
      ></NextImage>
    </div>
  )
}
