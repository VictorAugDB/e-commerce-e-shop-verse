'use client'

import { useEffect } from 'react'
import useSWR, { SWRResponse } from 'swr'

import { IntlHelper } from '@/lib/helpers/Intl'

import CopyToClipboard from '@/components/CopyToClipboard'

import { useLoading } from '@/contexts/LoadingProvider'

export type CanceledOrder = {
  id: string
  products: string[]
  createdAt: string
  repayStatus: 'uncompleted' | 'completed'
  subtotal: number
  discounts: number
  shipping: number
}

const fetcher = (args: string) =>
  fetch(args).then((res) => {
    if (res.status !== 200) {
      return undefined
    }
    return res.json()
  })

export function Cancellations() {
  const {
    data: orders,
    error: _ordersError,
    isLoading: isOrdersLoading,
  }: SWRResponse<CanceledOrder[]> = useSWR('/api/orders/canceled', fetcher)
  const { setLoading } = useLoading()

  useEffect(() => {
    if (!orders) {
      setLoading(true)
    }

    if ((!orders && !isOrdersLoading) || orders) {
      setLoading(false)
    }
  }, [orders, isOrdersLoading, setLoading])

  return (
    <div className="mt-8 h-content-screen px-2 sm:px-8 xl:px-[8.4375rem]">
      {orders && orders.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {orders.map((o) => (
            <div
              key={o.id}
              className="space-y-3 rounded border border-gray-400 bg-white p-2 sm:p-4"
            >
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h4>{o.id}</h4>
                  <CopyToClipboard text={o.id} />
                </div>
                <p className="text-gray-600">
                  Canceled in:{' '}
                  {IntlHelper.formatDateMonthLong(o.createdAt, 'en-US')}
                </p>
              </div>
              <div className="h-px bg-gray-400"></div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Repay Status</p>
                  <p
                    data-repayd={o.repayStatus === 'completed'}
                    className="text-red-600 data-[repayd=true]:text-green-600"
                  >
                    {o.repayStatus}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Items</p>
                  <p>{o.products.length}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">subtotal</p>
                  <p className="font-bold text-green-700">
                    {IntlHelper.formatNumberCurrency(
                      o.subtotal + o.shipping - o.discounts,
                      'en-US',
                      'USD',
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h4 className="text-center">You don't have any canceled order!</h4>
      )}
    </div>
  )
}
