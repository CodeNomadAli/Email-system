import type { NextRequest } from 'next/server'

import prisma from '@/db'
import { apiResponse, catchErrors } from '@/utils/backend-helper'

interface Context {
  params: {
    id: string
  }
}

export async function GET(req: NextRequest, context: Context) {
  try {
    const id = context.params.id

    const location = await prisma.location.findUnique({
      where: { id }
    })

    if (!location) {
      return new Response(JSON.stringify({ message: 'Location not found' }), { status: 404 })
    }

    return apiResponse(location, 'Location fetched successfully')
  } catch (error) {
    console.error(error)

    return catchErrors(error as Error, 'Failed to fetch location')
  }
}

export async function DELETE(req: Request, context: Context) {
  try {
    const id = context.params.id

    const [userLocation] = await Promise.all([prisma.userLocation.count({ where: { locationId: id } })])

    if (userLocation) throw new Error('Location is linked to user table and cannot be deleted')

    const location = await prisma.location.delete({
      where: { id }
    })

    return apiResponse(location, 'Location deleted successfully')
  } catch (error) {
    console.error(error)

    return catchErrors(error as Error, (error as Error).message || 'Failed to delete location')
  }
}
