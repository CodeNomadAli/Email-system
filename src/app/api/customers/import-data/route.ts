import type { NextRequest } from 'next/server'

import { ZodError } from 'zod'

import prisma from '@/db'
import { apiResponse, catchErrors, generateSlug } from '@/utils/backend-helper'
import customerSchema from '@/app/validations/customerSchema'

interface BulkImportBody {
  data: any[]
}

export async function POST(req: NextRequest) {
  try {
    const body: BulkImportBody = await req.json()

    if (!Array.isArray(body.data) || body.data.length === 0) {
      throw new Error('Data must be a non-empty array of customers')
    }

    const createdCustomers = []
    const failed = []

    for (const item of body.data) {
      try {
        if (!item.email || !item.phoneNumber) {
          failed.push({
            row: item,
            error: 'Missing required fields: firstName, email, or phoneNumber'
          })
          continue
        }

        customerSchema.parse(item)

        let countriesId: string | null = null

        if (item.countriesName) {
          const country = await prisma.countries.findFirst({ where: { name: item.countriesName.trim() } })

          if (!country) throw new Error(`Country "${item.countriesName}" not found`)
          countriesId = country.id
        }

        let companiesId: string | null = null

        if (item.companies) {
          let companiesTypesId: string | null = null

          if (item.companiesTypesName) {
            const companyType = await prisma.companiesTypes.findFirst({
              where: { name: item.companiesTypesName.trim() }
            })

            if (!companyType) throw new Error(`Company type "${item.companiesTypesName}" not found`)
            companiesTypesId = companyType.id
          }

          const slug = generateSlug(String(item.companies).trim())
          const existingCompany = await prisma.companies.findUnique({ where: { slug } })

          if (existingCompany) {
            companiesId = existingCompany.id

            if (companiesTypesId && existingCompany.companiesTypesId !== companiesTypesId) {
              await prisma.companies.update({
                where: { id: companiesId },
                data: { companiesTypesId }
              })
            }
          } else {
            const newCompany = await prisma.companies.create({
              data: { name: String(item.companies).trim(), slug, companiesTypesId }
            })

            companiesId = newCompany.id
          }
        }

        const isExist = await prisma.customers.findFirst({
          where: {
            OR: [{ email: item.email }, { phoneNumber: item.phoneNumber }]
          }
        })

        if (isExist) {
          failed.push({
            row: item,
            error: ` Some Customer already exists`
          })
          continue
        }

        const customer = await prisma.customers.create({
          data: {
            firstName: item.firstName,
            lastName: item.lastName,
            email: item.email,
            address: item.address ?? null,
            phoneNumber: item.phoneNumber ?? null,
            countriesId,
            companiesId,

            createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
            updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined
          }
        })

        const customerWithRelations = await prisma.customers.findUnique({
          where: { id: customer.id },
          include: {
            countries: true,
            companies: true,
            customerProducts: { include: { products: true } }
          }
        })

        createdCustomers.push(customerWithRelations)
      } catch (error) {
        console.log(`Error processing row:`, item, error)
        failed.push({
          row: item,
          error: error instanceof ZodError ? JSON.stringify(error.flatten()) : (error as Error).message
        })
      }
    }

    return apiResponse({ customers: createdCustomers, failed }, 'Import processed', 207)
  } catch (error) {
    console.error('Bulk import error:', error)

    return catchErrors(error as Error, 'Failed to import customers')
  }
}
