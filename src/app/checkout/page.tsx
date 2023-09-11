import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { MongoDbAddresses } from '@/lib/db/mongodb/addresses'
import { MongoDBProducts } from '@/lib/db/mongodb/products'

import { authOptions } from '@/app/api/auth/authOptions'
import { ClientSideCheckout } from '@/app/checkout'

type SearchParams = {
  productId?: string
  size?: string
  quantity?: number
}

export default async function BaseCheckout({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const session = await getServerSession(authOptions)
  const addressesIds = session?.user.addresses ?? []
  const mongoDbAddressesClient = new MongoDbAddresses()
  const addresses = await mongoDbAddressesClient.getAddressesByIds(addressesIds)

  const mongDbProductsClient = new MongoDBProducts()
  const product = searchParams.productId
    ? await mongDbProductsClient.getProductById(searchParams.productId)
    : undefined

  if (product === null) {
    notFound()
  }

  return (
    <ClientSideCheckout
      addresses={addresses}
      defaultAddressId={session?.user.defaultAddressId}
      product={product}
      productSize={searchParams.size}
      productQuantity={searchParams.quantity}
    />
  )
}
