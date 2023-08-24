import { Check } from 'react-feather'

import { getProductsDataByIds } from '@/lib/data'

import NextImage from '@/components/NextImage'

import { Order } from '@/app/orders/page'

export async function generateStaticParams() {
  const orders: Order[] = await new Promise((resolve) =>
    resolve([
      {
        products: ['1', '2', '3'],
        createdAt: '2023-08-24T14:09:04.258Z',
        status: 'Shipping',
        price: 299.3,
        id: '1',
        address: '2727 Lakeshore Rd undefined Nampa, Tennessee 78410',
      },
      {
        products: ['1', '2', '3'],
        createdAt: '2023-08-24T14:09:04.258Z',
        status: 'Shipping',
        price: 299.3,
        id: '2',
        address: '2727 Lakeshore Rd undefined Nampa, Tennessee 78410',
      },
      {
        products: ['1', '2', '3'],
        createdAt: '2023-08-24T14:09:04.258Z',
        status: 'Shipping',
        price: 299.3,
        id: '3',
        address: '2727 Lakeshore Rd undefined Nampa, Tennessee 78410',
      },
      {
        products: ['1', '2', '3'],
        createdAt: '2023-08-24T14:09:04.258Z',
        status: 'Shipping',
        price: 299.3,
        id: '4',
        address: '2727 Lakeshore Rd undefined Nampa, Tennessee 78410',
      },
    ]),
  )

  return orders.map((p) => ({ id: p.id }))
}
export default async function Order({ params }: { params: { id: string } }) {
  const order: Order = await new Promise((resolve) =>
    resolve({
      products: ['1', '2', '3'],
      id: params.id,
      createdAt: '2023-08-24T14:09:04.258Z',
      status: 'Shipping',
      price: 299.3,
      trackingNumber: 'LQNSU346JK',
      shippingDate: '2023-08-24T14:09:04.258Z',
      shippingType: 'POS Reggular',
      address: '2727 Lakeshore Rd undefined Nampa, Tennessee 78410',
    }),
  )
  const products = await getProductsDataByIds(order.products)

  return (
    <div className="mt-20 space-y-6 px-2 md:px-8 lg:mt-6 2xl:px-[8.4375rem]">
      <h3 className="text-center">Order Details</h3>
      <div className="flex items-center lg:flex-col">
        <div className="relative z-10 w-full lg:w-fit">
          <div className="flex w-fit flex-col items-center justify-center gap-3 lg:flex-row lg:items-start">
            <div className="flex flex-col items-center">
              <Status />
              <div className="hidden bg-green-700 lg:block lg:h-16 lg:w-0.5"></div>
            </div>
            <p>Packing</p>
          </div>
          <div className="absolute left-5 top-3 -z-10 h-px w-full bg-green-700 lg:hidden"></div>
        </div>
        <div className="relative z-10 w-full lg:w-fit">
          <div className="flex w-fit flex-col items-center justify-center gap-3 lg:flex-row lg:items-start">
            <div className="flex flex-col items-center">
              <Status />
              <div className="hidden bg-green-700 lg:block lg:h-16 lg:w-0.5"></div>
            </div>
            <p>Packing</p>
          </div>
          <div className="absolute left-5 top-3 -z-10 h-px w-full bg-green-700 lg:hidden"></div>
        </div>
        <div className="relative z-10 w-full lg:w-fit">
          <div className="flex w-fit flex-col items-center justify-center gap-3 lg:flex-row lg:items-start">
            <div className="flex flex-col items-center">
              <Status />
              <div className="hidden bg-green-700 lg:block lg:h-16 lg:w-0.5"></div>
            </div>
            <p>Packing</p>
          </div>
          <div className="absolute left-5 top-3 -z-10 h-px w-full bg-green-700 lg:hidden"></div>
        </div>
        <div>
          <div className="flex w-fit flex-col items-center justify-center gap-3 lg:flex-row">
            <Status />
            <p>Packing</p>
          </div>
        </div>
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
                  {Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(order.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {order.shippingDate && (
        <div className="space-y-3">
          <h4>Shipping Details</h4>
          <div className="space-y-3 rounded border border-gray-400 p-4">
            <div className="flex justify-between gap-2">
              <p className="text-gray-600">Data Shipping</p>
              <p className="text-end">
                {Intl.DateTimeFormat('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                }).format(new Date(order.createdAt))}
              </p>
            </div>
            <div className="flex justify-between gap-2">
              <p className="text-gray-600">Shipping Type</p>
              <p className="text-end">{order.shippingType}</p>
            </div>
            <div className="flex justify-between gap-2">
              <p className="text-gray-600">Tracking Number</p>
              <p className="text-end">{order.trackingNumber}</p>
            </div>
            <div className="flex justify-between gap-2">
              <p className="text-gray-600">Address</p>
              <p className="text-end">{order.address}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Status() {
  return (
    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white">
      <Check className="w-4" />
    </div>
  )
}
