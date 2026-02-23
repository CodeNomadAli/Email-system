// lib/fetchLocations.ts
import type { Roles } from '@prisma/client'

import prisma from '@/db' // adjust to your actual prisma import

export interface RolesResponse {
  roles: Roles[]
}

export async function fetchRoles(): Promise<RolesResponse> {
  const roles = await prisma.roles.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return {
    roles
  }
}
