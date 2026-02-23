import prisma from '@/db'
import { apiResponse, catchErrors } from '@/utils/backend-helper'

interface Context {
  params: {
    id: string
  }
}

export async function DELETE(req: Request, context: Context) {
  try {
    const id = context.params.id

    const customers = await prisma.customers.delete({
      where: { id }
    })

    return apiResponse(customers, 'Customer deleted successfully')
  } catch (error) {
    console.error(error)

    return catchErrors(error as Error, (error as Error).message || 'Failed to delete customer')
  }
}
