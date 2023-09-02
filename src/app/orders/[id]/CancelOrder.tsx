'use client'

import { useRouter } from 'next/navigation'
import { Trash2 } from 'react-feather'

import Button from '@/components/buttons/Button'

import { Order } from '@/app/orders/page'

type CancelOrderProps = {
  order: Order
}

export function CancelOrder({ order }: CancelOrderProps) {
  const router = useRouter()

  async function handleCancelOrder() {
    await fetch('/api/orders', {
      method: 'DELETE',
      body: JSON.stringify(order),
    })

    router.push('/orders/cancellations')
  }

  return (
    <Button variant="red" className="mx-auto flex gap-2">
      <Trash2 />
      <p onClick={handleCancelOrder} className="leading-none">
        Cancel Order
      </p>
    </Button>
  )
}
