import type { NextRequest } from 'next/server'

import { apiResponse, catchErrors } from '@/utils/backend-helper'
import { initBucket } from '@/utils/google-cloud'

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams
    const filePath = params.get('filePath')

    if (!filePath) {
      throw new Error('File path is required')
    }

    const storage = await initBucket()
    const file = storage.file(filePath)

    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000
    })

    return apiResponse({ url })
  } catch (error) {
    console.error(error)

    return catchErrors(error as Error, 'Failed to fetch products')
  }
}
