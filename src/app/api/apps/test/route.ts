import { NextResponse } from 'next/server'

import prisma from '@/db'

export async function GET() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'superadmin@gmail.com' },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    })

    // await prisma.userRole.create({
    //   data: {
    //     userId: user?.id || '',
    //     roleId: 'cm6c4sdix0005vo7cbahy37e1'
    //   }
    // })

    console.log(user)

    return new NextResponse(JSON.stringify(user), { headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}
