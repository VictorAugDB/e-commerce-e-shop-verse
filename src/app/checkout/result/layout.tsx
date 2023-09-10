import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout Session Result',
}

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <div className="flex h-content-screen flex-col items-center justify-center">
      {children}
    </div>
  )
}
