// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'

import { getProductsData } from '@/lib/data'

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const products = await getProductsData()
  const product = products.find((p) => p.id === params.id)
  if (product) {
    return NextResponse.json(product)
  } else {
    return redirect('/')
  }
}
