import { z } from 'zod'

const userSchema = z.object({
  first_name: z.string().min(2, { message: 'First Name must be at least 2 characters long' }),
  last_name: z.string().min(2, { message: 'Last Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  roles: z.array(z.string()).min(1, { message: 'At least one role is required' })
})

export default userSchema
