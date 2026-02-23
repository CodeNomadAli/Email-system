import type { NextRequest } from 'next/server'

import bcrypt from 'bcryptjs'
import { ZodError } from 'zod'

import prisma from '@/db'
import { apiResponse, catchErrors } from '@/utils/backend-helper'
import registerUserSchema from '@/app/validations/registerUserSchema'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    registerUserSchema.parse(data)
    const { first_name, last_name, email, password } = data

    const userExists = await prisma.user.findFirst({
      where: {
        email: email
      }
    })

    if (userExists) {
      throw new Error('User already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: hashedPassword
      }
    })

    return apiResponse({ newUser }, 'Welcome to Email Hub')
  } catch (error) {
    console.error(error)

    if (error instanceof ZodError) {
      return catchErrors(error, 'Invalid data', 400)
    }

    catchErrors(error as Error, (error as Error).message || 'Error creating user')
  }
}
