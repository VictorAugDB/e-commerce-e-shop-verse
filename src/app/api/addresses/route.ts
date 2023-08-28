// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextRequest, NextResponse } from 'next/server'

import { MongoDbAddresses } from '@/lib/db/mongodb/addresses'

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
