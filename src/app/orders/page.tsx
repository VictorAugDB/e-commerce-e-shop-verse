import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { MongoDBUncanceledOrders } from '@/lib/db/mongodb/orders'
import { IntlHelper } from '@/lib/helpers/Intl'

import CopyToClipboard from '@/components/CopyToClipboard'

import { authOptions } from '@/app/api/auth/authOptions'

export type Order = {
  productsIds: string[]
  createdAt: string
  status:
    | 'Order Placed'
    | 'Payment Confirmed'
    | 'Order Processed'
    | 'Shipping'
    | 'Delivered'
  subtotal: number
  shipping: number
  discounts: number
  id: string
  address: string
  shippingDate?: string
  shippingType?: string
  trackingNumber?: string
}

export default async function Orders() {
  const session = await getServerSession(authOptions)
  if (!(session && session.user && session.user.email)) {
    redirect('/')
  }

  const mongoDbOrdersClient = new MongoDBUncanceledOrders()

  const orders: Order[] = await mongoDbOrdersClient.getOrdersByIds(
    session.user.ordersIds,
  )

  return (
    <div className="mt-20 space-y-4 px-2 md:px-8 lg:mt-6 2xl:px-[8.4375rem]">
      <h3 className="text-center">Orders</h3>
      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
        {orders.map((o) => (
          <Link key={o.id} href={`/orders/${o.id}`}>
            <div className="cursor-pointer space-y-3 rounded border border-gray-400 bg-white p-2 transition-all hover:scale-105 hover:shadow-lg sm:p-4">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h4>{o.id}</h4>
                  <CopyToClipboard text={o.id} />
                </div>
                <p className="text-gray-600">
                  Made in:{' '}
                  {IntlHelper.formatDateMonthLong(o.createdAt, 'en-US')}
                </p>
              </div>
              <div className="h-px bg-gray-400"></div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Order Status</p>
                  <p>{o.status}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Items</p>
                  <p>{o.productsIds.length}</p>
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
          </Link>
        ))}
      </div>
    </div>
  )
}
