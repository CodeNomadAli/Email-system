import { z } from 'zod'

const resetPasswordSchema = z
  .object({
    otp: z
      .string()
      .length(4, { message: 'OTP must be exactly 4 digits' })
      .regex(/^\d{4}$/, { message: 'OTP must be numeric' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
    confirmPassword: z.string().min(6, { message: 'Confirm Password must be at least 6 characters long' })
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

export default resetPasswordSchema
