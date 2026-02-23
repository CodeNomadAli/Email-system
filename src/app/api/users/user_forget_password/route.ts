import { ZodError } from 'zod'

import bcrypt from 'bcryptjs'

import prisma from '@/db'
import { apiResponse, catchErrors, sendEmail } from '@/utils/backend-helper'
import forgetPasswordSchema from '@/app/validations/forgetPasswordSchema'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const otp = Math.floor(1000 + Math.random() * 9000)

    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email
      }
    })

    if (!existingUser) {
      return catchErrors(
        new Error('No account found with this email'),
        'No account found with this email. Please sign up or try a different email',
        404
      )
    }

    const userOtp = await prisma.userOtp.create({
      data: {
        email: body.email,
        otp: otp.toString()
      }
    })

    await sendEmail(body.email, 'Your OTP Code', `Your OTP code is ${otp.toString()}`)

    return apiResponse({ userOtp }, 'OTP Submitted and Email Sent Successfully')
  } catch (error) {
    console.error(error)

    if (error instanceof ZodError) {
      return catchErrors(error, 'Invalid data', 400)
    }

    return catchErrors(error as Error, 'Failed to submit OTP')
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()

    forgetPasswordSchema.parse(body)

    const { email, otp, password } = body

    const otpRecord = await prisma.userOtp.findFirst({
      where: { otp: otp.toString() }
    })

    if (!otpRecord) {
      return catchErrors(new Error('Invalid OTP'), 'Invalid OTP', 400)
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    })

    await prisma.userOtp.delete({
      where: { id: otpRecord.id }
    })

    return apiResponse({ updatedUser }, 'Password updated successfully', 200)
  } catch (error) {
    console.error('Error in PUT request:', error)

    if (error instanceof ZodError) {
      return catchErrors(error, 'Invalid data', 400)
    }

    return catchErrors(error as Error, 'Failed to update password', 500)
  }
}
