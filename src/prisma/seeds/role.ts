import prisma from '@/db'


const roleSeed = async () => {
  try {

    const permissions = await prisma.permission.findMany()
    const permissionMap = new Map(permissions.map(permission => [permission.name, permission.id]))

    const roles = [
      {
        name: 'super-admin',
        permissions: ['view:dashboard', 'read:user', 'create:user', 'delete:user', 'read:role','read:email','create:email','delete:email','update:email',]
      }
    ]

    for (const role of roles) {
      // Create the role
    const newRole = await prisma.roles.upsert({
  where: { name: role.name },
  update: {}, // nothing to update for now
  create: { name: role.name }
})


      // Create role-permission associations
      const permissionIds = role.permissions
        .map(permissionName => permissionMap.get(permissionName))
        .filter((id): id is string => !!id)

      for (const permissionId of permissionIds) {
       await prisma.rolesOnPermissions.upsert({
  where: {
    roleId_permissionId: {
      roleId:newRole.id,
      permissionId,
    },
  },
  update: {},
  create: {
    roleId :newRole.id,
    permissionId,
  },
})

      }
    }

    console.info('Roles seeded')
  } catch (error) {
    console.error('Error seeding roles:', error)
    throw error
  }
}

export default roleSeed
