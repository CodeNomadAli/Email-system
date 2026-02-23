'use client'

import { useMemo, useCallback, useContext, useState } from 'react'

import { useRouter } from 'next/navigation'

import type { ColumnDef } from '@tanstack/react-table'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  InputAdornment
} from '@mui/material'

import { useCanDoAction, showLoading, hideLoading, showSuccess, showError } from '@/utils/frontend-helper'
import { SettingsContext } from '@core/contexts/settingsContext'

interface DynamicTableProps<T> {
  resource: string
  permissionKey: string
  data: T[]
  columns: ColumnDef<T>[]
  pagination: {
    totalRecords: number
    totalPages: number
    page: number
    pageSize: number
  }
}

const DynamicTable = <T extends { id: string }>({
  
  permissionKey,
  data,
  columns,
  pagination,
}: DynamicTableProps<T>) => {
  const router = useRouter()
  const candoAction = useCanDoAction()
  // const { permissions = [] } = useContext(SettingsContext)!.settings

  const [globalFilter, setGlobalFilter] = useState('')

  const handleView = useCallback(() => {
    router.push(`/apps/email`)
  }, [router])

  const handleDelete = useCallback(async (rowData: { email: string; userId: string }) => {
    if (!window.confirm(`Are you sure you want to remove this assignment?`)) return

    try {
      showLoading()

      const res = await fetch('/api/apps/assign/unassign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: rowData.email, userId: rowData.userId })
      })

      const result = await res.json()

      if (res.ok) {
        showSuccess(result.success ? `Assignment removed successfully` : 'No assignment removed')
        router.refresh()
      } else {
        showError(result.error || 'Failed to remove assignment')
      }
    } catch (error) {
      console.error('Error removing assignment:', error)
      showError('Failed to remove assignment')
    } finally {
      hideLoading()
    }
  }, [router])

  const actionsColumn = useMemo<ColumnDef<T>>(() => ({
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <Box sx={{ display: 'flex', gap: 1 }}>
        {candoAction(`read:${permissionKey}`) && (
          <Button
            size='small'
            variant='outlined'
            color='secondary'
            onClick={() => handleView(row.original.id)}
            startIcon={<i className='tabler-eye' />}
          >
            View
          </Button>
        )}
        {candoAction(`delete:${permissionKey}`) && (
          <Button
            size='small'
            variant='outlined'
            onClick={() => handleDelete({ email: (row.original as any).email, userId: (row.original as any).assignedUserIds })}
            color='error'
            startIcon={<i className='tabler-trash' />}
          >
            Delete
          </Button>
        )}
      </Box>
    ),
    size: 120,
  }), [handleView, handleDelete, candoAction, permissionKey])

  const allColumns = useMemo(() => [...columns, actionsColumn], [columns, actionsColumn])

  const table = useReactTable({
    data,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount: pagination.totalPages,
    state: {
      pagination: {
        pageIndex: pagination.page - 1,
        pageSize: pagination.pageSize,
      },
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    filterFns: undefined
  })

  const handlePageChange = (newPageIndex: number) => {
    router.push(`?page=${newPageIndex + 1}&pageSize=${pagination.pageSize}`)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    router.push(`?page=1&pageSize=${newPageSize}`)
  }

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Box sx={{ mb: 2, maxWidth: 400 }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Search..."
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <i className="tabler-search" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Table sx={{ minWidth: 800 }}>
        <TableHead>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableCell key={header.id} sx={{ width: header.getSize() }}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
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

      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mt: 2,
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
        border: '1px solid',
        borderColor: 'divider'
      }}>
        <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', fontWeight: 'medium' }}>
          Showing {table.getRowModel().rows.length} of {pagination.totalRecords} records
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            variant='outlined'
            disabled={!table.getCanPreviousPage()}
            onClick={() => handlePageChange(table.getState().pagination.pageIndex - 1)}
            sx={{ minWidth: 80, borderColor: 'primary.main', color: 'primary.main' }}
          >
            Previous
          </Button>
          <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', px: 1 }}>
            Page {table.getState().pagination.pageIndex + 1} of {pagination.totalPages}
          </Typography>
          <Button
            variant='outlined'
            disabled={!table.getCanNextPage()}
            onClick={() => handlePageChange(table.getState().pagination.pageIndex + 1)}
            sx={{ minWidth: 80, borderColor: 'primary.main', color: 'primary.main' }}
          >
            Next
          </Button>
          <Select
            value={pagination.pageSize}
            onChange={e => handlePageSizeChange(Number(e.target.value))}
            sx={{ height: 36, minWidth: 80, '.MuiSelect-select': { py: 0.75, fontSize: '0.875rem' } }}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </Box>
      </Box>
    </Box>
  )
}

export default DynamicTable
