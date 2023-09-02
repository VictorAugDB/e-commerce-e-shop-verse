// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextRequest, NextResponse } from 'next/server'

import { Address, MongoDbAddresses } from '@/lib/db/mongodb/addresses'
import { MongoDBUsers } from '@/lib/db/mongodb/users'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const ids = searchParams.getAll('ids[]')

  if (!ids.length) {
    return NextResponse.json({ addresses: [] })
  }

  const mongoDbAddressesClient = new MongoDbAddresses()
  const addresses = await mongoDbAddressesClient.getAddressesByIds(ids)

  return NextResponse.json(addresses ?? [])
}

export async function POST(req: Request) {
  const body: Address & { userId: string } = await req.json()
  const { city, number, street, zipCode, apartmentName, complement, userId } =
    body

  const mongoDbAddressesClient = new MongoDbAddresses()
  const addressId = await mongoDbAddressesClient.insertAddress({
    city,
    street,
    zipCode,
    number,
    apartmentName,
    complement,
  })

  const mongoDbUsersClient = new MongoDBUsers()
  await mongoDbUsersClient.linkAddress(userId, addressId)

  return NextResponse.json({ id: addressId.toString() })
}

export async function PUT(req: Request) {
  const body: Address = await req.json()
  const { city, number, street, zipCode, apartmentName, complement, id } = body

  const mongoDbAddressesClient = new MongoDbAddresses()
  await mongoDbAddressesClient.updateAddress({
    id,
    city,
    street,
    zipCode,
    number,
    apartmentName,
    complement,
  })

  return NextResponse.json(null)
}

export async function DELETE(req: Request) {
  const body: {
    userId: string
    addressId: string
    newDefault?: string
  } = await req.json()
  const { userId, addressId, newDefault } = body

  const mongoDbUsersClient = new MongoDBUsers()
  const mongoDbAddressesClient = new MongoDbAddresses()

  if (newDefault) {
    mongoDbUsersClient.setDefaultAddress(userId, newDefault)
  }

  await mongoDbAddressesClient.deleteAddress(addressId)
  await mongoDbUsersClient.deleteAddress(userId, addressId)

  return NextResponse.json(null)
}
