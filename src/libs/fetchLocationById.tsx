// lib/fetchLocationById.ts
import prisma from '@/db'

export async function fetchLocationById(id: string) {
  try {
    const location = await prisma.location.findUnique({
      where: { id }
    })

    return location
  } catch (error) {
    console.error('Failed to fetch location:', error)

    return null
  }
}
