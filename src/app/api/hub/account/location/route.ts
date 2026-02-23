import type { NextResponse } from 'next/server'

import { apiResponse, catchErrors, getAuthSession } from '@/helper'
import prisma from '@/db'

export async function GET(): Promise<NextResponse> {
  try {
    const user = await getAuthSession()

    const userLocation = await prisma.userLocation.findUnique({
      where: { userId: user.id },
      select: {
        address_line_1: true,
        address_line_2: true,
        city_id: true,
        state_id: true,
        country_id: true,
        zipcode: true,
        timezone: true
      }
    })

    return apiResponse({ location: userLocation }, 'User data fetched successfully', 200)
  } catch (error) {
    return catchErrors(error as Error)
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const location = await req.json()
    const user = await getAuthSession()

    const userLocation = await prisma.userLocation.upsert({
      where: { userId: user.id },
      create: {
        ...location,
        user: { connect: { id: user.id } }
      },
      update: location
    })

    return apiResponse({ location: userLocation }, 'User data updated successfully', 200)
  } catch (error) {
    console.log(error)

    return catchErrors(error as Error)
  }
}
