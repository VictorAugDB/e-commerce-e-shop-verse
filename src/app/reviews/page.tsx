import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { MongoDBReviews } from '@/lib/db/mongodb/reviews'

import { authOptions } from '@/app/api/auth/authOptions'

export default async function Reviews() {
  const session = await getServerSession(authOptions)

  if (!(session && session.user && session.user.id)) {
    alert('Please login to see your reviews!')
    redirect('/')
  }

  const mongoDbReviewsClient = new MongoDBReviews()

  const reviews = await mongoDbReviewsClient.getReviewsByUserId(session.user.id)

  return (
    <div className="px-global">
      <div className="h-5 w-full bg-red-500"></div>
    </div>
  )
}
