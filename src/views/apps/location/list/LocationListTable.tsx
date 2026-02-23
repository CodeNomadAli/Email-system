'use client'

// views/apps/location/LocationListTable.tsx
import { useMemo, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import type { Location } from '@prisma/client'
import type { ColumnDef } from '@tanstack/react-table'
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Box, Typography } from '@mui/material'

import { useCanDoAction, showLoading, hideLoading, showSuccess, showError } from '@/utils/frontend-helper'

// Removed the top-level useRouter call

// Props interface (same as passed from LocationList)
interface LocationListClientProps {
    locations: Location[]
    totalRecords: number
    totalPages: number
    page: number
    pageSize: number
}

const LocationListClient: React.FC<LocationListClientProps> = ({
    locations,
    totalRecords,
    totalPages,
    page,
    pageSize,

}) => {
    const router = useRouter() // Moved useRouter inside the component
    const candoAction = useCanDoAction()

    // Handle edit action (implement according to your needs)
    const handleEdit = useCallback(
        (id: string) => {
            router.push(`/locations/form/${id}`)
        },
        [router]
    )

    // Handle edit action (implement according to your needs)
    const handleDelete = useCallback(
        async (id: string) => {
            if (window.confirm('Are you sure you want to delete this location?')) {
                try {
                    showLoading();

                    const res = await fetch(`/api/locations/${id}`, {
                        method: 'DELETE',
                    });

                    const req = await res.json();

                    if (res.ok) {
                        showSuccess(req.message || 'Location deleted successfully');
                        router.refresh();
                    } else {
                        showError(req.message);
                    }
                } catch (error) {
                    console.error('Error deleting location:', error);
                    showError('Failed to delete location');
                } finally {
                    hideLoading();
                }
            }
        },
        [router]
    );

    // Define columns for the table
    const columns = useMemo<ColumnDef<Location>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'No',
                cell: ({ row }) => (page - 1) * pageSize + row.index + 1,
                size: 100
            },
            {
                accessorKey: 'name',
                header: 'Name',
                size: 200
            },
            {
                accessorKey: 'city',
                header: 'City',
                size: 300
            },
            {
                accessorKey: 'state',
                header: 'State',
                size: 300
            },
            {
                accessorKey: 'createdAt',
                header: 'Created At',
                cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString('en-GB'),
                size: 150
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {candoAction('update:location') && (
                            <Button size='small' variant='outlined' onClick={() => handleEdit(row.original.id)}>
                                Edit
                            </Button>
                        )}
                        {candoAction('delete:location') && (
                            <Button
                                size='small'
                                variant='outlined'
                                onClick={() => handleDelete(row.original.id)}
                                color='error'
                                startIcon={<i className='tabler-trash' />}
                            >
                                Delete
                            </Button>
                        )}
                    </Box>
                ),
                size: 120
            }
        ],
        [handleEdit, handleDelete, candoAction, page, pageSize]
    )

    // Table instance
    const table = useReactTable({
        data: locations,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        pageCount: totalPages,
        filterFns: {
            fuzzy: () => false // Add a placeholder filter function or your custom logic
        },
        state: {
            pagination: {
                pageIndex: page - 1, // TanStack uses 0-based indexing
                pageSize
            }
        }
    })

    // Handle page change
    const handlePageChange = (newPage: number) => {
        // Implement server-side page change logic
        // You might want to update the URL or trigger a new data fetch
        console.log('Change to page:', newPage + 1)
    }

    return (
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
            {/* Table */}
            <Table sx={{ minWidth: 800 }}>
                <TableHead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <TableCell key={header.id} sx={{ width: header.getSize() }}>
                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody>
                    {table.getRowModel().rows.map(row => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <TableCell key={cell.id} sx={{ width: cell.column.getSize() }}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination Controls */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Typography>
                    Showing {table.getRowModel().rows.length} of {totalRecords} records
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant='outlined'
                        disabled={!table.getCanPreviousPage()}
                        onClick={() => handlePageChange(table.getState().pagination.pageIndex - 1)}
                    >
                        Previous
                    </Button>
                    <Typography sx={{ alignSelf: 'center' }}>
                        Page {table.getState().pagination.pageIndex + 1} of {totalPages}
                    </Typography>
                    <Button
                        variant='outlined'
                        disabled={!table.getCanNextPage()}
                        onClick={() => handlePageChange(table.getState().pagination.pageIndex + 1)}
                    >
                        Next
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default LocationListClient
