import type { NextResponse } from 'next/server'

import prisma from '@/db'
import { apiResponse, catchErrors, getAuthSession } from '@/helper'

export async function GET(): Promise<NextResponse> {
  try {
    const user = await getAuthSession()

    const userLocation = await prisma.userLocation.findUnique({
      where: { userId: user.id },
      select: {
        address_line_1: true,
        address_line_2: true,
        city: true,
        state: true,
        country: true
      }
    })

    return apiResponse({ user: userLocation }, 'User data fetched successfully', 200)
  } catch (error) {
    console.error('Error fetching user data:', error)

    return catchErrors(error as Error)
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { userData, userLocation } = await req.json()
    const user = await getAuthSession()

    const userUpdate = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...userData,
        userLocation: {
          upsert: {
            create: userLocation,
            update: userLocation,
            where: { userId: user.id }
          }
        }
      },
      include: {
        userLocation: true
      }
    })

    return apiResponse({ user: userUpdate }, 'User data updated successfully', 200)
  } catch (error) {
    console.error('Error updating user data:', error)

    return catchErrors(error as Error)
  }
}
