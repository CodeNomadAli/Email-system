// lib/fetchCustomersById.ts
import prisma from '@/db'

export async function fetchCustomersById(id: string) {
    try {
        const customers = await prisma.customers.findUnique({
            where: { id },
            include: {
                countries: true,
                companies: {
                    include: {
                        companiesTypes: true
                    }
                },
                customerProducts: {
                    include: {
                        products: true
                    }
                }
            }
        })

        return customers
    } catch (error) {
        console.error('Failed to fetch customers:', error)

        return null
    }
}
