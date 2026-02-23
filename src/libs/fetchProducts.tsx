// lib/fetchProducts.ts
import type { Products } from '@prisma/client'

import prisma from '@/db'

export interface ProductsResponse {
  products: Products[]
  totalRecords: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export async function fetchProducts(page: number, pageSize: number): Promise<ProductsResponse> {
  const totalRecords = await prisma.products.count()
  const totalPages = Math.ceil(totalRecords / pageSize)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const products = await prisma.products.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: 'desc' },
    include: {
      categories: {
        select: {
          name: true,
        },
      },
    },
  })

  return {
    products,
    totalRecords,
    totalPages,
    hasNextPage,
    hasPrevPage
  }
}
