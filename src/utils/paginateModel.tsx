import type { NextRequest } from 'next/server'

import type { PrismaClient } from '@prisma/client'

// Interface for pagination result
interface PaginationResult<T> {
  [key: string]: T[] | number | boolean // Allow dynamic key for model name
}

// Generic pagination function
export async function paginateModel<T>(
  prisma: PrismaClient,
  model: keyof PrismaClient,
  modelName: string, // New parameter for dynamic model name
  req: NextRequest,
  options: {
    orderBy?: Record<string, any>
    where?: Record<string, any>
    include?: Record<string, any>
  } = {}
): Promise<PaginationResult<T>> {
  // Extract and validate query parameters
  const params = req.nextUrl.searchParams
  const page = parseInt(params.get('page') || '1', 10)
  const pageSize = parseInt(params.get('pageSize') || '20', 10)

  // Sanitize inputs
  const validatedPage = Math.max(1, isNaN(page) ? 1 : page)

  const validatedPageSize = Math.min(
    Math.max(1, isNaN(pageSize) ? 20 : pageSize),
    100 // Maximum page size
  )

  try {
    // Fetch total records and paginated data in parallel
    const [totalRecords, items] = await Promise.all([
      // @ts-ignore: Prisma model dynamic access
      prisma[model].count({ where: options.where }),

      // @ts-ignore: Prisma model dynamic access
      prisma[model].findMany({
        skip: (validatedPage - 1) * validatedPageSize,
        take: validatedPageSize,
        orderBy: options.orderBy || { createdAt: { sort: 'desc', nulls: 'last' } },
        where: options.where
      })
    ])

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalRecords / validatedPageSize)
    const hasNextPage = validatedPage < totalPages
    const hasPrevPage = validatedPage > 1

    // Handle empty results
    if (items.length === 0 && validatedPage === 1) {
      return {
        [modelName]: [], // Dynamic model name
        totalRecords: 0,
        page: validatedPage,
        pageSize: validatedPageSize,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
      }
    }

    return {
      [modelName]: items, // Dynamic model name
      totalRecords,
      page: validatedPage,
      pageSize: validatedPageSize,
      totalPages,
      hasNextPage,
      hasPrevPage
    }
  } catch (error) {
    console.error(`Error paginating ${modelName}:`, error)
    throw error
  }
}
