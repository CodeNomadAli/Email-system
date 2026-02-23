import prisma from '@/db'

export async function fetchCompaniesById(id: string) {
    try {
        const companies = await prisma.companies.findUnique({
            where: { id },
            include: {
                companiesTypes: {
                    select: {
                        name: true,
                    },
                }
            }
        })

        return companies
    } catch (error) {
        console.error('Failed to fetch companies:', error)

        return null
    }
}
