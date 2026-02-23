// app/[lang]/(dashboard)/(private)/users/list/page.tsx
import { fetchUsers } from '@/libs/fetchUsers'

import UserList from '@/views/apps/user/list'
import type { ExtendedUser } from '@/utils/types'

export const dynamic = 'force-dynamic'
import { getAuthUser } from '@/utils/backend-helper'

interface Props {
  searchParams: {
    page?: string
    pageSize?: string
  }
}

const UsersPage = async ({ searchParams }: Props) => {
  const page = parseInt(searchParams.page || '1', 10)
  const pageSize = parseInt(searchParams.pageSize || '10', 10)

  const session = await getAuthUser()
  const managerId = session?.id

  if (!managerId) {
    return <div>User not authenticated</div>
  }

  const data = await fetchUsers(page, pageSize, managerId)

  return (
    <div>
      <UserList
        users={data.users as ExtendedUser[]}
        totalRecords={data.totalRecords}
        totalPages={data.totalPages}
        page={page}
        pageSize={pageSize}
      />
    </div>
  )
}

export default UsersPage
