import prisma from '@/db'

export async function fetchAllCompanies() {
    const companies = await prisma.companies.findMany()

    return companies
}
