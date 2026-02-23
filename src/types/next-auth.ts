import type { DefaultSession } from 'next-auth'

import type { ExtendedRole } from '@/utils/types'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      first_name: string
      last_name: string
      email: string
      image: string
      roles?: ExtendedRole[]
    } & DefaultSession['user']
  }
}
