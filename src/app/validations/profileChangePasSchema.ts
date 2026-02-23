import { z } from 'zod'

const profileChangePasSchema = z
  .object({
    oldPassword: z.string().min(1, { message: 'Old password is required' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
    confirmPassword: z.string().min(6, { message: 'Confirm Password must be at least 6 characters long' })
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })
  .refine(data => data.oldPassword !== data.password, {
    message: 'New password must be different from old password',
    path: ['password']
  })

export default profileChangePasSchema
