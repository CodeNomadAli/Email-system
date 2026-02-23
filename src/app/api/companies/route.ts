import type { NextRequest } from 'next/server'

import { ZodError } from 'zod'

import prisma from '@/db'
import { apiResponse, catchErrors, generateSlug } from '@/utils/backend-helper'
import companiesSchema from '@/app/validations/companiesSchema'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    companiesSchema.parse(body)

    // Generate slug from company name
    const companySlug = generateSlug(body.name)

    // Check if a company with this slug already exists
    const existingCompany = await prisma.companies.findUnique({
      where: { slug: companySlug }
    })

    if (existingCompany) {
      throw new Error('A company with this name already exists')
    }

    // Create new company with slug
    const companies = await prisma.companies.create({
      data: {
        name: body.name,
        slug: companySlug,
        email: body.email,
        address: body.address,
        companiesTypesId: body.companiesTypesId
      }
    })

    return apiResponse({ companies }, 'Company Added Successfully', 201)
  } catch (error) {
    console.error(error)

    if (error instanceof ZodError) {
      return catchErrors(error, 'Invalid data', 400)
    }

    return catchErrors(error as Error, (error as Error).message || 'Failed to add Company')
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()

    companiesSchema.parse(body)
    const companiesUrl = req.nextUrl.searchParams
    const companiesId = companiesUrl.get('companiesId')

    if (!companiesId) throw new Error('Company id is required')

    // Check if company exists
    const existingCompany = await prisma.companies.findUnique({
      where: { id: companiesId }
    })

    if (!existingCompany) {
      throw new Error('Company not found')
    }

    // Generate new slug from updated company name
    const companySlug = generateSlug(body.name)

    // Check if another company with this slug already exists (excluding the current company)
    const duplicateCompany = await prisma.companies.findFirst({
      where: {
        slug: companySlug,
        id: { not: companiesId } // Exclude the current company
      }
    })

    if (duplicateCompany) {
      throw new Error('Another company with this name already exists')
    }

    // Update company with new slug
    const companies = await prisma.companies.update({
      where: { id: companiesId },
      data: {
        name: body.name,
        slug: companySlug,
        email: body.email,
        address: body.address,
        companiesTypesId: body.companiesTypesId
      }
    })

    return apiResponse({ companies }, 'Company Updated Successfully')
  } catch (error) {
    console.error(error)

    if (error instanceof ZodError) {
      return catchErrors(error, 'Invalid data', 400)
    }

    return catchErrors(error as Error, (error as Error).message || 'Failed to update company')
  }
}
