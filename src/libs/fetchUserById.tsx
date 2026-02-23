// lib/fetchUserById.ts
import prisma from '@/db'

export async function fetchUserById(id: string) {
  try {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        locations: {
          include: {
            location: true
          }
        },
        roles: {
          include: {
            role: true
          }
        }
      },
    })

  } catch (error) {
    console.error('Failed to fetch user:', error)

    return null
  }
}
