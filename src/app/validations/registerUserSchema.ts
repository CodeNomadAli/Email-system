import { z } from 'zod'

const registerUserSchema = z
  .object({
    first_name: z.string().min(2, { message: 'First Name must be at least 2 characters long' }),
    last_name: z.string().min(2, { message: 'Last Name must be at least 2 characters long' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
    confirmPassword: z.string().min(6, { message: 'Confirm Password must be at least 6 characters long' })
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Password do not match',
    path: ['confirmPassword']
  })

export default registerUserSchema
