import type { NextRequest } from 'next/server'

import { ZodError } from 'zod'

import prisma from '@/db'
import { generateSlug, apiResponse, catchErrors } from '@/utils/backend-helper'
import categoriesSchema from '@/app/validations/categoriesSchema'

// Function to generate slug from name

// POST route to create a new category
export async function POST(req: Request) {
  try {
    const body = await req.json()

    categoriesSchema.parse(body) // Validates that body has a valid name
    const { name } = body

    const slug = generateSlug(name)

    // Check if a category with this slug already exists
    const existingCategory = await prisma.categories.findUnique({
      where: { slug }
    })

    if (existingCategory) {
      // If slug exists, return success with the existing category
      return apiResponse({ categories: existingCategory }, 'Category already exists')
    } else {
      // If slug doesn’t exist, create a new category
      const newCategory = await prisma.categories.create({
        data: { name, slug }
      })

      return apiResponse({ categories: newCategory }, 'Category added successfully')
    }
  } catch (error) {
    console.error(error)

    if (error instanceof ZodError) {
      return catchErrors(error, 'Invalid data', 400)
    }

    return catchErrors(error as Error, 'Failed to add category')
  }
}

// PUT route to update an existing category
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()

    categoriesSchema.parse(body)
    const { name } = body
    const categoriesUrl = req.nextUrl.searchParams
    const categoriesId = categoriesUrl.get('categoriesId')

    if (!categoriesId) throw new Error('Category id is required')

    const newSlug = generateSlug(name)

    // Check if another category has the same name
    const existingName = await prisma.categories.findFirst({
      where: { name, id: { not: categoriesId } }
    })

    if (existingName) {
      return apiResponse({ existingName }, 'Name already exists', 409)
    }

    // Check if another category has the same slug
    const existingSlug = await prisma.categories.findUnique({
      where: { slug: newSlug }
    })

    if (existingSlug) {
      return apiResponse({ existingSlug }, 'slug already exists for another category', 409)
    }

    // Update the category with new name and slug
    const updatedCategory = await prisma.categories.update({
      where: { id: categoriesId },
      data: { name, slug: newSlug }
    })

    return apiResponse({ categories: updatedCategory }, 'Category updated successfully')
  } catch (error) {
    console.error(error)

    if (error instanceof ZodError) {
      return catchErrors(error, 'Invalid data', 400)
    }

    return catchErrors(error as Error, 'Failed to update category')
  }
}
