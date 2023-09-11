import { IntlHelper } from '@/lib/helpers/Intl'

type ProductDetailsProps = {
  imagePath: string
  name: string
  price: number
  quantity: number
}

export function ProductDetails({
  imagePath,
  name,
  price,
  quantity,
}: ProductDetailsProps) {
  return (
    <div className="flex items-center justify-between text-center">
      <div className="flex items-center gap-6 truncate text-center">
        <img
          alt="product-image"
          src={imagePath}
          className="inline-block h-[2.8125rem] w-[3.125rem]"
        ></img>
        {name}
      </div>
      <div className="text-center">
        {IntlHelper.formatNumberCurrency(price, 'en-US', 'USD')} X {quantity}
      </div>
    </div>
  )
}
