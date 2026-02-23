// lib/fetchCompanies.ts
import type { Companies } from '@prisma/client'

import prisma from '@/db'

export interface CompaniesResponse {
    companies: Companies[]
    totalRecords: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
}

export async function fetchCompanies(page: number, pageSize: number): Promise<CompaniesResponse> {
    const totalRecords = await prisma.companies.count()
    const totalPages = Math.ceil(totalRecords / pageSize)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    const companies = await prisma.companies.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
            companiesTypes: {
                select: {
                    name: true,
                },
            }
        }
    })

    return {
        companies,
        totalRecords,
        totalPages,
        hasNextPage,
        hasPrevPage
    }
}
