import type { NextRequest } from 'next/server'

import prisma from '@/db'
import { apiResponse, catchErrors, getAuthUser } from '@/utils/backend-helper'

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams
    let userId = params.get('userId') as string | null | undefined
    const authUser = params.get('authUser')
    const userSession = await getAuthUser()

    if (authUser) {
      userId = userSession?.id
    }

    if (userId) {
      const userLocations = await prisma.user.findFirst({
        where: { id: userId },
        select: {
          id: true,
          locations: {
            select: {
              location: true
            }
          }
        }
      })

      if (!userLocations) throw new Error('No such user')

      return apiResponse(userLocations)
    }

    const userLocations = await prisma.user.findMany({
      select: {
        id: true,
        locations: {
          include: {
            location: true
          }
        }
      }
    })

    return apiResponse(userLocations)

    // return apiResponse({ userSession.data.users })
  } catch (error) {
    console.error(error)

    return catchErrors(error as Error, 'Failed to fetch locations')
  }
}
