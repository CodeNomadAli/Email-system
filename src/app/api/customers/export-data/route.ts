import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import prisma from '@/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const skip = parseInt(searchParams.get('skip') || '0')
    const take = 500

    const customers = await prisma.customers.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(customers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}
