
'use client'

import type { Customers } from '@prisma/client'
import type { ColumnDef } from '@tanstack/react-table'



import DynamicTable from '@/components/DynamicTable'

interface CustomersListTableProps {
  customers: Customers[]
  totalRecords: number
  totalPages: number
  page: number
  pageSize: number
}

const CustomersListTable: React.FC<CustomersListTableProps> = ({
  customers,
  totalRecords,
  totalPages,
  page,
  pageSize,
}) => {


  const columns: ColumnDef<Customers>[] = [
    {
      accessorKey: 'id',
      header: 'No',
      cell: ({ row }) => (page - 1) * pageSize + row.index + 1, size: 100,
    },
    {
      accessorKey: 'firstName',
      header: 'First Name',
      size: 200,
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name',
      size: 200,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      size: 200,
    },
    {
      accessorKey: 'address',
      header: 'Address',
      size: 200,
    },
    {
      accessorKey: 'phoneNumber',
      header: 'Phone Number',
      cell: ({ row }) => {
        const phoneNumber = row.getValue('phoneNumber');


        return phoneNumber ? `+92${phoneNumber}` : '';
      },
      size: 150,
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
      resource="customers"
      permissionKey="customer"
      data={customers}
      columns={columns}
      pagination={{ totalRecords, totalPages, page, pageSize }}
    />
  )
}

export default CustomersListTable
