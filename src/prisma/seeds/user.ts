import { hash } from 'bcryptjs'

import prisma from '@/db'

const userSeed = async () => {
  try {
    const roles = await prisma.roles.findMany()

    const users = [
      {
        first_name: 'Super',
        last_name: 'Admin',
        email: 'superadmin@gmail.com',
        password: await hash('superadmin', 10),
        roleIds: roles.map(role => role.id)
      }
    ]

    for (const user of users) {
      const { roleIds, ...userData } = user

      // Create the user
      const newUser = await prisma.user.create({
        data: userData
      })

      // Create user-role associations
      for (const roleId of roleIds) {
        await prisma.userRole.create({
          data: {
            userId: newUser.id,
            roleId
          }
        })
      }
    }

    console.info('Users seeded')
  } catch (error) {
    console.error('Error seeding users:', error)
    throw error
  }
}

export default userSeed
