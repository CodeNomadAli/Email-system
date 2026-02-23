import prisma from '@/db'

export async function fetchAllCategories() {
    const categories = await prisma.categories.findMany()

    return categories
}
