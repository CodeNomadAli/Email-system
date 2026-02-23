import { z } from 'zod'

const companiesSchema = z.object({
  name: z.string().min(1, { message: 'Name must be at least 1 character long' }).optional().nullable(),
  email: z.string().email({ message: 'Invalid email address' }).optional().nullable(),
  address: z.string().min(5, { message: 'Address must be at least 5 characters long' }).optional().nullable()
})

export default companiesSchema
