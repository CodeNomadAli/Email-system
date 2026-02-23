import { exec } from 'child_process'
import { promisify } from 'util'

import { NextResponse } from 'next/server'

import { ZodError, type ZodSchema } from 'zod'

import { getServerSession } from 'next-auth'

import prisma from '@/db'

export const apiResponse = <T>(
  data: T | T[] = null as unknown as T | T[],
  message: string | string[] = 'Success',
  status: number = 200,
  errors?: T[]
) => {
  return NextResponse.json({ data, message, errors, status }, { status: status })
}

export const getAuthSession = async () => {
  const session = await getServerSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  if (!session.user || !session.user.email) {
    throw new Error('Session user email not found')
  }

  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user.email
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      username: true,
      emailVerified: true,
      image: true,
      createdAt: true,
      updatedAt: true
    }
  })

  if (!user) {
    throw new Error('User not found')
  }

  return user
}

export const execPromise = promisify(exec)

let ip: string = ''

export const getIP = (): string => ip

export const setIP = (newIP: string): void => {
  ip = newIP
}

export const formValidation = async (formData: FormData | Record<string, unknown>, zodeSchema: ZodSchema) => {
  const formDataObj = formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData

  await zodeSchema.parseAsync(formDataObj)
}

export const mapFormErrors = (error: ZodError) => {
  return error.errors.map(e => e.path.join(' ') + ' ' + e.message)
}

export const catchErrors = (error: Error | ZodError) => {
  let errorMessage = 'An unknown error occurred'
  let status = 500

  let errors: string[] | undefined

  if (error instanceof ZodError) {
    errors = mapFormErrors(error)
    status = 422
  }

  if (error instanceof Error && !(error instanceof ZodError)) {
    errorMessage = error.message
  }

  return apiResponse(null, errorMessage, status, errors)
}
