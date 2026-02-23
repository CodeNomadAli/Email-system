// lib/fetchCategories.ts
import type { Categories } from '@prisma/client'

import prisma from '@/db'

export interface CategoriesResponse {
    categories: Categories[]
    totalRecords: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
}

export async function fetchCategories(page: number, pageSize: number): Promise<CategoriesResponse> {
    const totalRecords = await prisma.categories.count()
    const totalPages = Math.ceil(totalRecords / pageSize)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    const categories = await prisma.categories.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
    })

    return {
        categories,
        totalRecords,
        totalPages,
        hasNextPage,
        hasPrevPage
    }
}
