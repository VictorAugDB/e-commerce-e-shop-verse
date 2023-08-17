// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next'

import { getProductsData } from '@/lib/data'

export default async function getProduct(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query

  const products = await getProductsData()
  const product = products.find((p) => p.id === id)
  if (product) {
    res.status(200).json(product)
  } else {
    res.status(204).send(undefined)
  }
}
