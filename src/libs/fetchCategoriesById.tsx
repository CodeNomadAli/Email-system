import prisma from '@/db'

export async function fetchCategoriesById(id: string) {
    try {
        const categories = await prisma.categories.findUnique({
            where: { id }
        })

        return categories
    } catch (error) {
        console.error('Failed to fetch categories:', error)

        return null
    }
}
