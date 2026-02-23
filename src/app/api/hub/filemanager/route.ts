import type { NextRequest } from 'next/server'

import { FileStatus } from '@prisma/client'

import { apiResponse, catchErrors, getAuthSession } from '@/helper'

import prisma from '@/db'

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const folderId = await req.nextUrl.searchParams.get('folderId')

    const user = await getAuthSession()

    if (!user) {
      throw new Error('Unauthorized')
    }

    const folders = await prisma.folder.findMany({
      where: {
        userId: user.id,
        parentId: folderId ? folderId : null,
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    const files = (
      await prisma.file.findMany({
        where: {
          userId: user.id,
          folderId: folderId ? folderId : null,
          status: FileStatus.COMPLETED
        }
      })
    ).map(file => ({ ...file, size: file.size.toString() }))

    return apiResponse(
      {
        folders,
        files
      },
      'Successfully fetched Data'
    )
  } catch (error) {
    return catchErrors(error as Error)
  }
}


