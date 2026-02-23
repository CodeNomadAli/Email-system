import { z } from 'zod'

const CategoriesSchema = z.object({
  name: z.string().min(1).max(255) // Assuming a reasonable string length constraint
})

export default CategoriesSchema
