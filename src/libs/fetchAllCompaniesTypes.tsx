import prisma from '@/db'

export async function fetchAllCompaniesTypes() {
    const companiesTypes = await prisma.companiesTypes.findMany()

    return companiesTypes
}
