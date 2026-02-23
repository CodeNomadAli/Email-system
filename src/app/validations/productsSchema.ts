import { z } from 'zod'

const productsSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  category: z.string().nullable().optional(),
  product_img: z.any().nullable().optional()
})

export default productsSchema
