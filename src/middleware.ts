import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { getRequiredPermission } from './utils/route-permissions'

export function middleware(request: NextRequest) {
  const requiredPermission = getRequiredPermission(request.nextUrl.pathname)

  if (requiredPermission) {
    // Example: Get token from cookies and decode permissions
    const token = request.cookies.get('token')?.value
    const permissions: string[] = []

    if (token) {
      // Decode your token here and extract permissions
      // permissions = ...
    }

    if (!permissions.includes(requiredPermission)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/en/:path*'] // Adjust as needed
}
