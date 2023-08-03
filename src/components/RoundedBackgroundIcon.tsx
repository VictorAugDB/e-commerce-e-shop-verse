import { IconType } from 'react-icons'

import { DynamicIcon } from '@/components/DynamicIcon'

type RoundedBackgroundIconTypes = {
  icon: IconType
}

export default function RoundedBackgroundIcon({
  icon,
}: RoundedBackgroundIconTypes) {
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-600">
      <div className="flex h-[3.625rem] w-[3.625rem] items-center justify-center rounded-full bg-black">
        <DynamicIcon icon={icon} color="white" width={40} height={40} />
      </div>
    </div>
  )
}
