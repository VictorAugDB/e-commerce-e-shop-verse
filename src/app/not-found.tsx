import * as React from 'react'
import { RiAlarmWarningFill } from 'react-icons/ri'

import ArrowLink from '@/components/links/ArrowLink'

export default function NotFoundPage() {
  return (
    <>
      <div>
        <section>
          <div className="layout flex h-error-screen flex-col items-center justify-center text-center text-black">
            <RiAlarmWarningFill
              size={60}
              className="animate-flicker text-red-500"
            />
            <h1 className="mt-8 text-4xl md:text-6xl">Page Not Found</h1>
            <ArrowLink className="mt-4 md:text-lg" href="/">
              Back to Home
            </ArrowLink>
          </div>
        </section>
      </div>
    </>
  )
}
