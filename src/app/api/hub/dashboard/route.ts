import { apiResponse, getAuthSession } from '@/helper'

export async function GET(req: Request): Promise<Response> {
  const user = await getAuthSession()

  if (user) {
    return apiResponse({ message: 'Dashboard API', user: user })
  }

  return apiResponse({ message: 'Dashboard API' })
}
