'use client'

import { useRouter } from 'next/navigation'

import Button from '@/components/buttons/Button'

type LeaveButtonProps = {
  to: string
  text: string
  variant: 'green' | 'light'
}

export function LeaveButton({ to, text, variant }: LeaveButtonProps) {
  const router = useRouter()

  function handleNavigate() {
    router.push(to)
  }

  return (
    <Button
      onClick={handleNavigate}
      variant={variant}
      className="w-full py-4 text-center"
    >
      <p className="w-full">{text}</p>
    </Button>
  )
}
