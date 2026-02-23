// lib/fetchLocations.ts
import type { Location } from '@prisma/client'

import prisma from '@/db'

export interface LocationResponse {
  locations: Location[]
  totalRecords: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export async function fetchLocations(page: number, pageSize: number): Promise<LocationResponse> {
  const totalRecords = await prisma.location.count()
  const totalPages = Math.ceil(totalRecords / pageSize)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const locations = await prisma.location.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: 'desc' }
  })

  return {
    locations,
    totalRecords,
    totalPages,
    hasNextPage,
    hasPrevPage
  }
}
