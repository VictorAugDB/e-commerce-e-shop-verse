// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next'

import { getCouponsData } from '@/lib/data'

export default async function getProducts(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const coupons = await getCouponsData()
  res.status(200).json(coupons)
}
