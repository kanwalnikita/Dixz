import { getAuth } from '@clerk/nextjs/server'

import { db } from '@/lib/db'
import { NextApiRequest } from 'next'
// creating a helper function to use inside server-side code (like inside pages/api or getServerSideProps).
export const currentProfilePages = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return null
  }

  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
  })

  return profile;
}
