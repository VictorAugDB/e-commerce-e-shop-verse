'use server'

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { MongoDBUncanceledOrders } from '@/lib/db/mongodb/orders'
import { MongoDBProducts } from '@/lib/db/mongodb/products'
import { IntlHelper } from '@/lib/helpers/Intl'

import Divider from '@/components/Divider'
import NextImage from '@/components/NextImage'

import { authOptions } from '@/app/api/auth/authOptions'
import { CancelOrder } from '@/app/orders/[id]/CancelOrder'
import { DeliveryInfo } from '@/app/orders/[id]/DeliveryInfo'
import { Detail } from '@/app/orders/[id]/Detail'
import PaymentButton from '@/app/orders/[id]/PaymentButton'
import { Order } from '@/app/orders/page'

export async function generateStaticParams() {
  const mongoDbOrdersClient = new MongoDBUncanceledOrders()

  const orders: Order[] = await mongoDbOrdersClient.getOrders()

  return orders.map((p) => ({ id: p.id }))
}
export default async function Order({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!(session && session.user && session.user.email)) {
    redirect('/sign-in')
  }

  if (!session.user.ordersIds.find((o: string) => o === params.id)) {
    redirect('/')
  }

  const statuses = {
    'Order Placed': 0,
    'Payment Confirmed': 1,
    'Order Processed': 2,
    Shipping: 3,
    Delivered: 4,
  }

  const mongoDbOrdersClient = new MongoDBUncanceledOrders()
  const order = await mongoDbOrdersClient.getOrderById(params.id)

  if (!order) {
    redirect('/orders')
  }

  const mongoDbProductsClient = new MongoDBProducts()
  const products = await mongoDbProductsClient.getProductsByIds(
    order.products.map((p) => p.id),
  )
  const productsQuantity = new Map(
    order.products.map((p) => [p.id, p.quantity]),
  )

  return (
    <div className="mt-20 space-y-6 px-2 md:px-8 lg:mt-6 2xl:px-[8.4375rem]">
      <h3 className="text-center">Order Details</h3>
      <div className="flex flex-col items-center">
        <DeliveryInfo
          title="Order Placed"
          description="We have received your order"
          isChecked={statuses[order.status] >= statuses['Order Placed']}
        />
        <DeliveryInfo
          title="Payment Confirmed"
          description={
            statuses[order.status] > 1
              ? 'We have received your payment'
              : 'Awaiting payment...'
          }
          hasDivider
          isChecked={statuses[order.status] >= statuses['Payment Confirmed']}
        />
        <DeliveryInfo
          title="Order Processed"
          description="we are preparing your order"
          hasDivider
          isChecked={statuses[order.status] >= statuses['Order Processed']}
        />
        <DeliveryInfo
          title="Shipping"
          description={`Order #${order.trackingNumber} from E-shopverse`}
          hasDivider
          isChecked={statuses[order.status] >= statuses['Shipping']}
        />
        <DeliveryInfo
          title="Delivered"
          description="The products arrived at your address"
          hasDivider
          isChecked={statuses[order.status] >= statuses['Delivered']}
        />
      </div>
      <div className="space-y-3">
        <h4>Products</h4>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex gap-3 rounded border border-gray-400 p-4"
            >
              <div className="h-[4.5rem] w-[4.5rem] overflow-hidden rounded bg-gray-400 p-3">
                <div className="relative h-full w-full">
                  <NextImage
                    src={p.images[0]}
                    fill
                    alt="product-image"
                    className="object-contain"
                  ></NextImage>
                </div>
              </div>
              <div className="flex flex-col justify-between">
                <p className="font-bold">{p.name}</p>
                <p className="font-bold text-green-700">
                  {IntlHelper.formatNumberCurrency(p.price, 'en-US', 'USD')} X{' '}
                  {productsQuantity.get(p.id) ?? 1}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {order.shippingDate && order.shippingType && order.trackingNumber && (
        <div className="mx-auto space-y-3 lg:w-1/2">
          <h4>Shipping Details</h4>
          <div className="space-y-3 rounded border border-gray-400 p-4">
            <Detail
              title="Date Shipping"
              value={IntlHelper.formatDateMonthLong(
                order.shippingDate,
                'en-US',
              )}
            />
            <Detail title="Shipping Type" value={order.shippingType} />
            <Detail title="Tracking Number" value={order.trackingNumber} />
            <Detail title="Address" value={order.address} />
          </div>
        </div>
      )}
      <div className="mx-auto space-y-3 lg:w-1/2">
        <h4>Payment Details</h4>
        <div className="space-y-3 rounded border border-gray-400 p-4">
          <Detail
            title={`Items (${products.length})`}
            value={IntlHelper.formatNumberCurrency(
              order.subtotal,
              'en-US',
              'USD',
            )}
          />
          <Detail
            title="Discounts"
            value={
              '-' +
              IntlHelper.formatNumberCurrency(order.discounts, 'en-US', 'USD')
            }
          />
          <Detail
            title="Shipping"
            value={IntlHelper.formatNumberCurrency(
              order.shipping,
              'en-US',
              'USD',
            )}
          />
          <Divider />
          <Detail
            title="Total Price"
            value={IntlHelper.formatNumberCurrency(
              order.subtotal + order.shipping - order.discounts,
              'en-US',
              'USD',
            )}
            valueClassName="font-bold text-green-700"
            titleClassName="font-bold text-black"
          />
        </div>
      </div>
      {['Order Processed', 'Payment Confirmed'].includes(order.status) && (
        <CancelOrder order={order} />
      )}
      {order.status === 'Order Placed' && (
        <PaymentButton
          className="mx-auto block"
          checkoutData={{
            checkoutProducts: products.map((p) => ({
              boughtQuantity: productsQuantity.get(p.id) ?? 1,
              category: p.category,
              description: p.description,
              images: p.images,
              price: p.price,
              productId: p.id,
              productName: p.name,
            })),
            orderId: order?.id as string,
          }}
        />
      )}
    </div>
  )
}
