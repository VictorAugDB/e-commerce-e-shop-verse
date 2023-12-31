'use client'

import { useEffect, useState } from 'react'

type ListHeaderProps = {
  topic: string
  title?: string
  hasTimer?: boolean
}

const endDate = new Date()
endDate.setDate(endDate.getDate() + 3)

export default function ListHeader({
  title,
  topic,
  hasTimer = false,
}: ListHeaderProps) {
  const [currentDate, setCurrentDate] = useState(
    new Date(endDate.getTime() - new Date().getTime()),
  )
  const [isClient, setIsClient] = useState(false)

  const remainingDays = currentDate.getDate()
  const remainingHours = currentDate.getHours()
  const remainingMinutes = currentDate.getMinutes()
  const remainingSeconds = currentDate.getSeconds()

  useEffect(() => {
    setIsClient(true)
    if (hasTimer) {
      const id = setInterval(
        () =>
          setCurrentDate(new Date(endDate.getTime() - new Date().getTime())),
        1000,
      )

      return () => {
        clearInterval(id)
      }
    }

    return
  }, [hasTimer])

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <span className="h-10 w-5 rounded bg-green-700"></span>
        <p className="font-medium text-green-700">{topic}</p>
      </div>
      <div className="flex flex-wrap gap-6 sm:gap-20">
        <h1>{title}</h1>
        {hasTimer && isClient && (
          <div className="flex items-center gap-4 text-xl sm:text-2xl md:text-3xl">
            <div>
              <span className="block text-xs">Days</span>
              <div className="flex gap-x-4">
                <span>
                  {remainingDays >= 10 ? remainingDays : `0${remainingDays}`}
                </span>
                <span>:</span>
              </div>
            </div>
            <div>
              <span className="block text-xs">Hours</span>
              <div className="flex gap-x-4">
                <span>
                  {remainingHours >= 10 ? remainingHours : `0${remainingHours}`}
                </span>
                <span>:</span>
              </div>
            </div>
            <div>
              <span className="block text-xs">Minutes</span>
              <div className="flex gap-x-4">
                <span>
                  {remainingMinutes >= 10
                    ? remainingMinutes
                    : `0${remainingMinutes}`}
                </span>
                <span>:</span>
              </div>
            </div>
            <div>
              <span className="block text-xs">Seconds</span>
              <span className="block">
                {remainingSeconds >= 10
                  ? remainingSeconds
                  : `0${remainingSeconds}`}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
