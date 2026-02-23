import prisma from '@/db'

export async function fetchProductsById(id: string) {
    try {
        const products = await prisma.products.findUnique({
            where: { id },
            include: {
                categories: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return products
    } catch (error) {
        console.error('Failed to fetch product:', error)

        return null
    }
}
