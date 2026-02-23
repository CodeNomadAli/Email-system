// lib/fetchCompaniesTypes.ts
import type { CompaniesTypes } from '@prisma/client'

import prisma from '@/db'

export interface CompaniesTypesResponse {
    companiesTypes: CompaniesTypes[]
    totalRecords: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
}

export async function fetchCompaniesTypes(page: number, pageSize: number): Promise<CompaniesTypesResponse> {
    const totalRecords = await prisma.companiesTypes.count()
    const totalPages = Math.ceil(totalRecords / pageSize)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    const companiesTypes = await prisma.companiesTypes.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
    })

    return {
        companiesTypes,
        totalRecords,
        totalPages,
        hasNextPage,
        hasPrevPage
    }
}
