// lib/getUserHierarchy.ts
import prisma from '@/db'

export async function getUserHierarchy(userId: string) {
  const directReports = await prisma.userManager.findMany({
    where: { managerId: userId },
    include: {
      user: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true
        }
      }
    }
  })

  return Promise.all(
    directReports.map(async ({ user }) => ({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      children: await getUserHierarchy(user.id) // Recursive call
    }))
  )
}
