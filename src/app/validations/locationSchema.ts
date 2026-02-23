import { z } from 'zod'

const locationSchema = z.object({
  name: z.string().min(3, { message: 'Full Name must be at least 3 characters long' }),
  state: z.string().min(5, { message: 'State Name must be at least 3 characters long' }),
  city: z.string().min(5, { message: 'City Name must be at least 3 characters long' })
})

export default locationSchema
