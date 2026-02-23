import prisma from '@/db'

const permissionsSeed = async () => {
  try {
    const permissions = [
      { name: 'view:dashboard', description: 'View the dashboard' },
     
      { name: 'read:user', description: 'View User' },
      { name: 'create:user', description: 'Create User' },
      { name: 'delete:user', description: 'Delete a user' },
      { name: 'update:user', description: 'Update User' },
      
      { name: 'read:role', description: 'Read Role' }, 
    
      { name: 'create:customer', description: 'Create Customer' },
      { name: 'read:customer', description: 'Read Customer' },
      { name: 'update:customer', description: 'Update Customer' },
      { name: 'delete:customer', description: 'Delete Customer' },
    
      { name: 'read:email', description: 'View User' },
      { name: 'create:email', description: 'Create User' },
      { name: 'delete:email', description: 'Delete a user' },
      { name: 'update:email', description: 'Update User' },
    ]

    for (const permission of permissions) {
      await prisma.permission.upsert({
        where: { name: permission.name },
        update: { description: permission.description },
        create: permission
      })
    }

    console.info('Permissions seeded')
  } catch (error) {
    console.error('Error seeding permissions:', error)
    throw error
  }
}

export default permissionsSeed
