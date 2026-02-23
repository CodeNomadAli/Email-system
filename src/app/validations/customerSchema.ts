import { z } from 'zod'

const phoneNumberSchema = z.string().min(1, { message: 'Phone number must be at least 5 characters long' }) // adjust minimum if needed

const customerSchema = z.object({
  firstName: z.string().min(1, { message: 'First name must be at least 1 character long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters long' }),
  phoneNumber: phoneNumberSchema,
  countriesId: z.string().min(1, { message: 'Country ID is required' }),
  companies: z.string().min(1, { message: 'At least one company is required' }),
  companiesTypesId: z.string().min(1, { message: 'At least one company type is required' }),
  products: z.array(z.string()).min(1, { message: 'At least one product is required' })
})

export default customerSchema
