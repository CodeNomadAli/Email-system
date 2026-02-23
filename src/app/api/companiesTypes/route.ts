import type { NextRequest } from 'next/server'

import { ZodError } from 'zod'

import prisma from '@/db'
import { apiResponse, catchErrors } from '@/utils/backend-helper'

import companiesTypesSchema from '@/app/validations/companiesTypesSchema'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    companiesTypesSchema.parse(body)

    const companiesTypes = await prisma.companiesTypes.create({
      data: {
        ...body
      }
    })

    return apiResponse({ companiesTypes }, 'Company Type Add Successfully')
  } catch (error) {
    console.error(error)

    if (error instanceof ZodError) {
      return catchErrors(error, 'Invalid data', 400)
    }

    return catchErrors(error as Error, 'Failed to add Company Type')
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()

    companiesTypesSchema.parse(body)
    const companiesTypesUrl = req.nextUrl.searchParams
    const companiesTypesId = companiesTypesUrl.get('companiesTypesId')

    if (!companiesTypesId) throw new Error('Company Type id is required')

    const companiesTypes = await prisma.companiesTypes.update({
      where: { id: companiesTypesId },
      data: {
        ...body
      }
    })

    return apiResponse({ companiesTypes }, 'Company Type Update Successfully')
  } catch (error) {
    console.error(error)

    if (error instanceof ZodError) {
      return catchErrors(error, 'Invalid data', 400)
    }

    return catchErrors(error as Error, 'Failed to update company type')
  }
}
