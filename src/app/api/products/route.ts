import fs from 'fs/promises'
import path from 'path'

import type { NextRequest } from 'next/server'

import { ZodError } from 'zod'

import prisma from '@/db'
import { generateSlug, apiResponse, catchErrors } from '@/utils/backend-helper'
import productsSchema from '@/app/validations/productsSchema'

// Define the directory for storing images
const uploadDir = path.join(process.cwd(), 'public', 'products_images')

// Ensure the upload directory exists
async function ensureUploadDir() {
  try {
    await fs.mkdir(uploadDir, { recursive: true })
  } catch (error) {
    console.error('Failed to create upload directory:', error)
    throw new Error('Failed to initialize upload directory')
  }
}

// Handle POST request to create a new product
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const body = Object.fromEntries(formData)

    // Validate form data
    productsSchema.parse(body)

    const productImg = formData.get('product_img') as File | null
    const category = formData.get('category') as string

    if (!category) {
      throw new Error('Category is required')
    }

    const categorySlug = generateSlug(category)

    // Fetch category ID
    const categoryRecord = await prisma.categories.findUnique({
      where: { slug: categorySlug },
      select: { id: true }
    })

    if (!categoryRecord) {
      throw new Error('Category not found')
    }

    const productName = body.name as string
    const productSlug = generateSlug(productName)

    // Check if product already exists by slug
    const existingProduct = await prisma.products.findUnique({
      where: { slug: productSlug }
    })

    if (existingProduct) {
      throw new Error('Product with this name already exists')
    }

    let publicUrl: string | null = null

    if (productImg instanceof File && productImg.size > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']

      if (!allowedTypes.includes(productImg.type)) {
        throw new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.')
      }

      const maxSize = 5 * 1024 * 1024

      if (productImg.size > maxSize) {
        throw new Error('File size exceeds 5MB limit.')
      }

      await ensureUploadDir()

      const fileName = `${Date.now()}_${productImg.name}`
      const filePath = path.join(uploadDir, fileName)
      const fileBuffer = await productImg.arrayBuffer()

      await fs.writeFile(filePath, Buffer.from(fileBuffer))

      publicUrl = `/products_images/${fileName}`
    }

    const product = await prisma.products.create({
      data: {
        name: productName,
        slug: productSlug,
        categoriesId: categoryRecord.id,
        product_img: publicUrl
      }
    })

    return apiResponse({ product }, 'Product added successfully', 201)
  } catch (error) {
    console.error(error)

    if (error instanceof ZodError) {
      return catchErrors(error, 'Invalid data', 400)
    }

    return catchErrors(error as Error, (error as Error).message || 'Failed to create product')
  }
}

// Handle PUT request to update an existing product
export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData()
    const body = Object.fromEntries(formData)
    const productId = body.id as string

    if (!productId) {
      throw new Error('Product ID is required')
    }

    // Validate form data
    productsSchema.parse(body)

    const currentProduct = await prisma.products.findUnique({
      where: { id: productId },
      select: { product_img: true }
    })

    if (!currentProduct) {
      throw new Error('Product not found')
    }

    const productName = body.name as string
    const productSlug = generateSlug(productName)

    // Check if another product with the same slug exists (excluding the current product)
    const existingProduct = await prisma.products.findUnique({
      where: { slug: productSlug }
    })

    if (existingProduct && existingProduct.id !== productId) {
      throw new Error('Another product with this name already exists')
    }

    const category = formData.get('category') as string
    let categoryId: string | null = null

    if (category) {
      const categorySlug = generateSlug(category)

      const categoryRecord = await prisma.categories.findUnique({
        where: { slug: categorySlug },
        select: { id: true }
      })

      if (!categoryRecord) {
        throw new Error('Category not found')
      }

      categoryId = categoryRecord.id
    }

    let publicUrl: string | null = null
    const productImg = formData.get('product_img') as File | null

    if (productImg instanceof File && productImg.size > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']

      if (!allowedTypes.includes(productImg.type)) {
        throw new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.')
      }

      const maxSize = 5 * 1024 * 1024 // 5MB

      if (productImg.size > maxSize) {
        throw new Error('File size exceeds 5MB limit.')
      }

      await ensureUploadDir()

      const fileName = `${Date.now()}_${productImg.name}`
      const filePath = path.join(uploadDir, fileName)
      const fileBuffer = await productImg.arrayBuffer()

      await fs.writeFile(filePath, Buffer.from(fileBuffer))

      publicUrl = `/products_images/${fileName}`
    }

    const productData: {
      name: string
      slug: string
      categoriesId?: string | null
      product_img?: string | null
    } = {
      name: productName,
      slug: productSlug
    }

    if (categoryId) {
      productData.categoriesId = categoryId
    }

    if (publicUrl !== null) {
      productData.product_img = publicUrl
    } else if (formData.has('product_img') && !productImg) {
      productData.product_img = null
    }

    const product = await prisma.products.update({
      where: { id: productId },
      data: productData
    })

    // Delete old image if a new one was uploaded or image was removed
    if ((publicUrl || productData.product_img === null) && currentProduct.product_img) {
      const oldFilename = currentProduct.product_img.split('/').pop()

      if (oldFilename) {
        const oldFilePath = path.join(uploadDir, oldFilename)

        await fs.unlink(oldFilePath).catch(err => console.error('Failed to delete old image:', err))
      }
    }

    return apiResponse({ product }, 'Product updated successfully')
  } catch (error) {
    console.error(error)

    if (error instanceof ZodError) {
      return catchErrors(error, 'Invalid data', 400)
    }

    return catchErrors(error as Error, (error as Error).message || 'Failed to update product')
  }
}

// Handle DELETE request to delete a product
export async function DELETE(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams
    const productsId = params.get('productsId')

    if (!productsId) throw new Error('Product ID is required')

    // Check if product is linked in CustomerProducts bridge table
    const linkedCount = await prisma.customerProducts.count({
      where: { productsId }
    })

    if (linkedCount > 0) {
      throw new Error('Product is linked to customer table and cannot be deleted')
    }

    const products = await prisma.products.findUnique({
      where: { id: productsId }
    })

    if (!products) {
      throw new Error('Product not found')
    }

    if (products.product_img) {
      const fileName = products.product_img.split('/').pop()

      if (fileName) {
        const filePath = path.join(uploadDir, fileName)

        try {
          await fs.unlink(filePath)
        } catch (error) {
          console.warn(`Failed to delete image file ${filePath}:`, error)
        }
      }
    }

    const deletedProduct = await prisma.products.delete({
      where: { id: productsId }
    })

    return apiResponse({ deletedProduct }, 'Product deleted successfully')
  } catch (error) {
    console.error(error)

    return catchErrors(error as Error, (error as Error).message || 'Failed to delete product')
  }
}
