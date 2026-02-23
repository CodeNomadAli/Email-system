import type { NextRequest } from 'next/server'

import type { Bucket } from '@google-cloud/storage'

import { v4 as uuidv4 } from 'uuid'

import { FileStatus } from '@prisma/client'

import { formValidation, apiResponse, getAuthSession, catchErrors } from '@/helper'

import prisma from '@/db'
import { initBucket } from '@/plugins/google-cloud-storage'

import { fileStatusSchema } from '@/schema/fileSchema'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const userDestination = formData.get('destination')
  const fileSize = formData.get('fileSize') as string
  const folderId = formData.get('folderId')
  const fileName = formData.get('fileName') as string

  // const allowedFileType = formData.get('allowedFileType')

  const user = await getAuthSession()

  if (!user) {
    return apiResponse(null, 'Unauthorized', 401)
  }

  const fileType = typeof fileName === 'string' ? (fileName.split('.').pop() ?? 'unknown') : 'unknown'
  const bucket = (await initBucket('web-file-bucket')) as Bucket
  const fileUniqueName = uuidv4() + '.' + fileType

  const destination = user.id + '/' + userDestination + '/'
  const file = bucket.file((destination + fileUniqueName) as string)

  // const IP = (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0]

  const options = {
    expires: Date.now() + 5 * 60 * 1000, // 5 minutes
    fields: { 'x-goog-meta-source': 'vspdf-file' },
    destination: destination
  }

  const [response] = await file.generateSignedPostPolicyV4(options)

  const uploadedFile = await prisma.file.create({
    data: {
      name: fileName ?? 'vspdf-file.pdf',
      fileUniqueName: fileUniqueName,
      path: destination as string,
      size: parseInt(fileSize ?? '0', 10),
      
      mimeType: fileType as string,
      status: FileStatus.PROCESSING,
      folder: folderId ? { connect: { id: folderId as string } } : undefined,
      user: { connect: { id: user.id } }
    }
  })

  return apiResponse(
    {
      gcs: response,
      uploadedFile: {
        ...uploadedFile,
        size: uploadedFile.size.toString(), 
       
      }
    },
    'Success',
    200
  )
}

export async function PUT(req: NextRequest) {
  const formData = await req.json()

  const fileId = formData.fileId as string
  const fileStatus = formData.status as FileStatus
  const fileName = formData.fileName as string
  const user = await getAuthSession()

  try {
    if (!user) {
      return apiResponse(null, 'Unauthorized', 401)
    }

    if (fileStatus) {
      formValidation({ status: fileStatus }, fileStatusSchema)
      await prisma.file.update({ where: { id: fileId }, data: { status: fileStatus } })

      return apiResponse(null, 'File status updated successfully')
    }

    if (fileName) {
      const file = await prisma.file.findUnique({ where: { id: fileId, userId: user.id } })

      if (!file) throw new Error('File not found')

      if (file.name === fileName) {
        return apiResponse(null, 'File name is the same', 400)
      }

      const existingName = await prisma.file.findFirst({
        where: {
          userId: user.id,
          folderId: file.folderId,
          name: fileName
        }
      })

      if (existingName) {
        return apiResponse(null, 'File already exists in the current folder', 400)
      }

      await prisma.file.update({ where: { id: fileId }, data: { name: fileName } })

      return apiResponse(null, 'File name updated successfully')
    }
  } catch (error) {
    return catchErrors(error as Error)
  }
}
