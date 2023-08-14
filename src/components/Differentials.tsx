import { LuShieldCheck } from 'react-icons/lu'
import { TbHeadphones, TbTruckDelivery } from 'react-icons/tb'

import RoundedBackgroundIcon from '@/components/RoundedBackgroundIcon'

export default function Differentials() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-[5.5rem]">
      <div className="flex flex-col items-center gap-6">
        <RoundedBackgroundIcon icon={TbTruckDelivery} />
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg font-semibold">FREE AND FAST DELIVERY</p>
          <p className="text-sm">Free delivery for all orders over $140</p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-6">
        <RoundedBackgroundIcon icon={TbHeadphones} />
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg font-semibold">24/7 CUSTOMER SERVICE</p>
          <p className="text-sm">Friendly 24/7 customer supporth</p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-6">
        <RoundedBackgroundIcon icon={LuShieldCheck} />
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg font-semibold">MONEY BACK GUARANTEE</p>
          <p className="text-sm">We reurn money within 30 days</p>
        </div>
      </div>
    </div>
  )
}
