import { z } from 'zod'

const companiesSchema = z.object({
  name: z.string().min(1, { message: 'Name must be at least 1 character long' }).optional().nullable()
})

export default companiesSchema
