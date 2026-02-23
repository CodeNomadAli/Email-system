import prisma from '@/db'

export async function fetchCompaniesTypesById(id: string) {
    try {
        const companiesTypes = await prisma.companiesTypes.findUnique({
            where: { id }
        })

        return companiesTypes
    } catch (error) {
        console.error('Failed to fetch companiesTypes:', error)

        return null
    }
}
