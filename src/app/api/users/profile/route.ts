import type { NextRequest } from 'next/server'

import bcrypt from 'bcryptjs'

import { ZodError } from 'zod'

import prisma from '@/db'
import { apiResponse, catchErrors } from '@/utils/backend-helper'
import profileChangePasSchema from '@/app/validations/profileChangePasSchema'

export async function PUT(req: NextRequest) {
  try {
    const user = await req.json()
    const params = req.nextUrl.searchParams
    const userId = params.get('userId')
    const profileChangePass = params.get('profileChangePass')

    if (!userId) throw new Error('Invalid data')

    if (profileChangePass) {
      profileChangePasSchema.parse(user)

      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          password: true
        }
      })

      if (!currentUser) {
        throw new Error('User not found')
      }

      const { oldPassword, password } = user
      const isOldPasswordValid = await bcrypt.compare(oldPassword, currentUser.password)

      if (!isOldPasswordValid) {
        throw new Error('Old password is incorrect')
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword
        }
      })

      return apiResponse({ updatedUser }, 'Password updated successfully')
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        first_name: user.first_name,
        last_name: user.last_name
      }
    })

    return apiResponse({ updatedUser }, 'User updated successfully')
  } catch (error) {
    console.error('Error updating user:', error)

    if (error instanceof ZodError) {
      return catchErrors(error, 'Invalid data', 400)
    }

    return catchErrors(error as Error, (error as Error).message || 'Error updating user')
  }
}
