import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { MongoDBReviews } from '@/lib/db/mongodb/reviews'

import { authOptions } from '@/app/api/auth/authOptions'
import { Reviews as ListReviews } from '@/app/reviews/Reviews'

export default async function Reviews() {
  const session = await getServerSession(authOptions)

  if (!(session && session.user && session.user.id && session.user.name)) {
    redirect('/')
  }

  const mongoDbReviewsClient = new MongoDBReviews()

  // TODO declare a variable to get this value
  const reviews = await mongoDbReviewsClient.getReviewsByUserId(session.user.id)

  return (
    <div className="mt-8 space-y-8 px-global">
      <h4 className="text-center">Your Reviews</h4>
      <ListReviews
        reviews={reviews}
        userId={session.user.id}
        userName={session.user.email}
      />
    </div>
  )
}
