import { Card, CardHeader, Button } from '@mui/material'

import type { ExtendedUser } from '@/utils/types'

import UserListClient from './UserListTable'

// Props interface
interface UserListProps {
  users: ExtendedUser[]
  totalRecords: number
  totalPages: number
  page: number
  pageSize: number
}

// Server Component
const UserList: React.FC<UserListProps> = ({ users, totalRecords, totalPages, page, pageSize }) => {

  return (
    <Card sx={{ padding: 2, marginTop: 2 }}>
      <CardHeader
        title='User List'
        action={
          <>
            <Button
              variant='contained'
              color='primary'
              size='small'
              startIcon={<i className='tabler-plus' />}
              href='/user/form'
            >
              Add User
            </Button>
          </>
        }
      />
      <UserListClient
        users={users as ExtendedUser[]}
        totalRecords={totalRecords}
        totalPages={totalPages}
        page={page}
        pageSize={pageSize}
      />
    </Card>
  )
}

export default UserList
