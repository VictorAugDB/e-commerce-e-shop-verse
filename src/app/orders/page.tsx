'use client'

export type Order = {
  products: string[]
  createdAt: string
  status: 'Packing' | 'Shipping' | 'Arriving' | 'Delivered'
  price: number
  id: string
  address: string
  shippingDate?: string
  shippingType?: string
  trackingNumber?: string
}

export default async function Orders() {
  const orders: Order[] = await new Promise((resolve) =>
    resolve([
      {
        products: ['1', '2', '3'],
        createdAt: '2023-08-24T14:09:04.258Z',
        status: 'Shipping',
        price: 299.3,
        id: '1',
        address: '2727 Lakeshore Rd undefined Nampa, Tennessee 78410',
        trackingNumber: 'LQNSU346JK',
      },
      {
        products: ['1', '2', '3'],
        createdAt: '2023-08-24T14:09:04.258Z',
        status: 'Shipping',
        price: 299.3,
        id: '2',
        address: '2727 Lakeshore Rd undefined Nampa, Tennessee 78410',
        trackingNumber: 'MPQSU346JK',
      },
      {
        products: ['1', '2', '3'],
        createdAt: '2023-08-24T14:09:04.258Z',
        status: 'Shipping',
        price: 299.3,
        id: '3',
        address: '2727 Lakeshore Rd undefined Nampa, Tennessee 78410',
        trackingNumber: 'MPQSU346JG',
      },
      {
        products: ['1', '2', '3'],
        createdAt: '2023-08-24T14:09:04.258Z',
        status: 'Shipping',
        price: 299.3,
        id: '4',
        address: '2727 Lakeshore Rd undefined Nampa, Tennessee 78410',
        trackingNumber: 'MPQSU346JC',
      },
    ]),
  )

  return (
    <div className="mt-20 space-y-4 px-2 md:px-8 lg:mt-6 2xl:px-[8.4375rem]">
      <h3 className="text-center">Orders</h3>
      <div className="space-y-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:space-y-0">
        {orders.map((o) => (
          <div
            className="cursor-pointer space-y-3 rounded border border-gray-400 bg-white p-4 transition-all hover:scale-105 hover:shadow-lg"
            key={o.id}
          >
            <div className="space-y-4">
              <h4>{o.trackingNumber}</h4>
              <p className="text-gray-600">
                Made in:{' '}
                {Intl.DateTimeFormat('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                }).format(new Date(o.createdAt))}
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
                <p>{o.products.length}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-600">Price</p>
                <p className="font-bold text-green-700">
                  {Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(o.price)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
