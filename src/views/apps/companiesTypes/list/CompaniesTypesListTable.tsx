'use client'

import type { CompaniesTypes } from '@prisma/client'
import type { ColumnDef } from '@tanstack/react-table'

import DynamicTable from '@/components/DynamicTable'

interface CompaniesTypesListClientProps {
    companiesTypes: CompaniesTypes[]
    totalRecords: number
    totalPages: number
    page: number
    pageSize: number
}

const CompaniesTypesListClient: React.FC<CompaniesTypesListClientProps> = ({
    companiesTypes,
    totalRecords,
    totalPages,
    page,
    pageSize,
}) => {
    const columns: ColumnDef<CompaniesTypes>[] = [
        {
            accessorKey: 'id',
            header: 'No',
            cell: ({ row }) => (page - 1) * pageSize + row.index + 1,
        },
        {
            accessorKey: 'name',
            header: 'Name',
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
            resource="companiesTypes"
            permissionKey="companyType"
            data={companiesTypes}
            columns={columns}
            pagination={{ totalRecords, totalPages, page, pageSize }}
        />
    )
}

export default CompaniesTypesListClient
