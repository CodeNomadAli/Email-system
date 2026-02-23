import type { NextRequest } from 'next/server'

import { ZodError } from 'zod'

import prisma from '@/db'
import { apiResponse, catchErrors, getAuthUser } from '@/utils/backend-helper'
import locationSchema from '@/app/validations/locationSchema'
import { paginateModel } from '@/utils/paginateModel'

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams
    const user = await getAuthUser()

    const locationWhere: { id?: { in: string[] } } = {}

    if (params.get('authUser') && user) {
      const locationIds = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
          locations: {
            select: {
              id: true,
              locationId: true
            }
          }
        }
      })

      locationWhere['id'] = {
        in: locationIds?.locations.map(location => location.locationId) || []
      }
    }

    const result = await paginateModel(prisma, 'location', 'locations', req, {
      orderBy: { createdAt: 'desc' },
      where: locationWhere
    })

    return apiResponse(result, 'Locations fetched successfully')
  } catch (error) {
    console.error(error)

    return catchErrors(error as Error, 'Failed to fetch locations')
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    locationSchema.parse(body)

    const location = await prisma.location.create({
      data: {
        ...body
      }
    })

    return apiResponse({ location }, 'Location Submit Successfully')
  } catch (error) {
    console.error(error)

    if (error instanceof ZodError) {
      return catchErrors(error, 'Invalid data', 400)
    }

    return catchErrors(error as Error, 'Failed to create location')
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()

    locationSchema.parse(body)
    const locationUrl = req.nextUrl.searchParams
    const locationId = locationUrl.get('locationId')

    if (!locationId) throw new Error('Location id is required')

    const location = await prisma.location.update({
      where: { id: locationId },
      data: {
        ...body
      }
    })

    return apiResponse({ location }, 'Location Update Successfully')
  } catch (error) {
    console.error(error)

    if (error instanceof ZodError) {
      return catchErrors(error, 'Invalid data', 400)
    }

    return catchErrors(error as Error, 'Failed to create location')
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams
    const locationId = params.get('locationId')

    if (!locationId) throw new Error('Location id is required')

    const [userLocation] = await Promise.all([prisma.userLocation.count({ where: { locationId: locationId } })])

    if (userLocation) throw new Error('Location is linked to user table and cannot be deleted')

    const deletedLocation = await prisma.location.delete({
      where: { id: locationId }
    })

    return apiResponse({ deletedLocation }, 'Location deleted successfully')
  } catch (error) {
    console.error(error)

    return catchErrors(error as Error, (error as Error).message || 'Failed to delete location')
  }
}
