import type { NextRequest } from 'next/server'

import { apiResponse, catchErrors, getAuthSession } from '@/helper'
import prisma from '@/db'

export async function POST(req: Request) {
  try {
    const formData = await req.json()
    const user = await getAuthSession()

    if (!user) throw new Error('User not found')

    const existingFolder = await prisma.folder.findFirst({
      where: {
        name: formData.folderName,
        parentId: formData.parentFolderId ?? null,
        userId: user.id
      }
    })

    if (existingFolder) {
      return apiResponse(null, 'Folder already exists', 409)
    }

    const createFolder = await prisma.folder.create({
      data: {
        name: formData.folderName,
        parentId: formData.parentFolderId ?? null,
        userId: user.id
      }
    })

    return apiResponse({ folder: createFolder }, 'Successfully created folder')
  } catch (error) {
    console.log(error)

    return catchErrors(error as Error)
  }
}

export async function PUT(req: Request) {
  try {
    const formData = await req.json()
    const user = await getAuthSession()

    if (!user) throw new Error('User not found')

    const folder = await prisma.folder.findFirst({
      where: {
        id: formData.folderId,
        userId: user.id
      }
    })

    if (!folder) {
      return apiResponse(null, 'Folder not found', 404)
    }

    if (folder.name === formData.folderName) {
      return apiResponse(null, 'Folder name is the same', 400)
    }

    const existingName = await prisma.folder.findMany({
      where: {
        userId: user.id,
        parentId: folder.parentId,
        name: formData.folderName
      }
    })

    if (existingName.length > 0) {
      return apiResponse(null, 'Folder already exists in the current Folder', 400)
    }

    await prisma.folder.update({
      where: {
        id: formData.folderId
      },
      data: {
        name: formData.folderName
      }
    })

    return apiResponse(null, 'Folder name updated successfully')
  } catch (error) {
    console.log(error)

    return catchErrors(error as Error)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const formParams = req.nextUrl.searchParams
    const folderId = formParams.get('folderId')

    const user = await getAuthSession()

    if (!user) throw new Error('User not found')

    if (folderId) {
      const folder = await prisma.folder.findFirst({
        where: {
          id: folderId,
          userId: user.id
        }
      })

      if (!folder) {
        return apiResponse(null, 'Folder not found', 404)
      }

      await prisma.folder.delete({
        where: {
          id: folderId
        }
      })
    }

    if (!folderId) {
      return apiResponse(null, 'No folderId or fileId provided', 400)
    }

    return apiResponse(null, 'Deleted successfully')
  } catch (error) {
    console.error(error)

    return catchErrors(error as Error)
  }
}
