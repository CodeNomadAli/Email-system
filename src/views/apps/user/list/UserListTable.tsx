'use client'

import type { ColumnDef } from '@tanstack/react-table'

import DynamicTable from '@/components/DynamicTable'
import type { ExtendedUser } from '@/utils/types'

interface UserListTableProps {
  users: ExtendedUser[]
  totalRecords: number
  totalPages: number
  page: number
  pageSize: number
}

const UserListTable: React.FC<UserListTableProps> = ({
  users,
  totalRecords,
  totalPages,
  page,
  pageSize,
}) => {
  const columns: ColumnDef<ExtendedUser>[] = [
    {
      accessorKey: 'id',
      header: 'No',
      cell: ({ row }) => (page - 1) * pageSize + row.index + 1,
      size: 100,
    },
    {
      id: 'fullName',
      header: 'Full Name',
      cell: ({ row }) => `${row.original.first_name || ''} ${row.original.last_name || ''}`.trim(),
      size: 200,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      size: 250,
    },
    {
      id: 'roles',
      header: 'Roles',
      cell: ({ row }) =>
        row.original.roles?.map((userRole: { role: { name: string } }) => userRole.role.name).join(', ') || '',
      size: 200,
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString('en-GB'),
      size: 150,
    },
  ]

  return (
    <DynamicTable
      resource="users"
      permissionKey="user"
      data={users}
      columns={columns}
      pagination={{ totalRecords, totalPages, page, pageSize }}
    />
  )
}

export default UserListTable
