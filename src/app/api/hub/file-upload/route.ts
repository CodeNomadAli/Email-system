import type { NextRequest } from 'next/server'

import { PrismaClient } from '@prisma/client'

import type { Bucket } from '@google-cloud/storage'

import { formValidation, apiResponse, catchErrors } from '@/helper'

import { initBucket } from '@plugins/google-cloud-storage'

import { fileStatusSchema } from '@/schema/fileSchema'

// Data Imports

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const formParams = req.nextUrl.searchParams

  const fileName = formParams.get('file') ?? 'defaultFileName'
  const fileUniqueName = `${Date.now()}-${fileName}`
  const bucket = (await initBucket('web-file-bucket')) as Bucket

  const destination = 'unprocessed_files/'
  const file = bucket.file((destination + fileUniqueName) as string)
  const IP = (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0]

  const options = {
    expires: Date.now() + 5 * 60 * 1000, // 5 minutes
    fields: { 'x-goog-meta-source': 'vspdf-file' },
    destination: destination
  }

  const [response] = await file.generateSignedPostPolicyV4(options)

  const uploadedFile = await prisma.uploadedFile.create({
    data: {
      fileName: fileName as string,
      fileUniqueName: destination + fileUniqueName,
      ipAddress: IP
    }
  })

  return apiResponse({ gcs: response, uploadedFile })
}

export async function PUT(req: NextRequest) {
  const formData = await req.formData()

  const fileId = formData.get('fileId') as string
  const fileStatus = formData.get('status') as string

  try {
    const file = await prisma.file.findUnique({ where: { id: fileId } })

    if (!file) throw new Error('File not found')

    if (fileStatus) {
      formValidation({ status: fileStatus }, fileStatusSchema)
      await prisma.file.update({ where: { id: fileId }, data: { status: fileStatus } })

      return apiResponse(null, 'File status updated successfully')
    }
  } catch (error) {
    return catchErrors(error as Error)
  }
}

export async function DELETE(req: NextRequest) {
  const formParams = req.nextUrl.searchParams

  const fileId = formParams.get('fileId') as string

  const uploadedFile = await prisma.uploadedFile.findUnique({ where: { id: fileId } })

  if (!uploadedFile) {
    return apiResponse(null, 'File not found', 404)
  }

  const bucket = (await initBucket('web-file-bucket')) as Bucket
  const file = bucket.file(uploadedFile.fileUniqueName)

  await file.delete()

  await prisma.uploadedFile.delete({ where: { id: fileId } })

  return apiResponse(null, 'File deleted successfully')
}
