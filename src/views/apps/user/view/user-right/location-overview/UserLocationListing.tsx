'use client'
import { useEffect, useState, useCallback } from 'react'

import type { Location, UserLocation } from '@prisma/client'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

import { showLoading, hideLoading } from '@/utils/frontend-helper'
import styles from '@core/styles/table.module.css'

interface ExtendedUserLocation extends UserLocation {
  location: Location
}

const columnHelper = createColumnHelper<ExtendedUserLocation>()

interface LocationListPropType {
  userId: string
}

const UserLocationListing = ({ userId }: LocationListPropType) => {
  const [data, setData] = useState<ExtendedUserLocation[]>([])

  const fetchLocations = useCallback(async () => {
    showLoading()

    try {
      const req = await fetch(`/api/users/locations?userId=${userId}`)
      const { data } = await req.json()

      if (req.ok) {
        setData(data.locations)

        return
      }

      throw new Error('Error while fetching data')
    } catch (error) {
      console.error(error)
    } finally {
      hideLoading()
    }
  }, [userId])

  useEffect(() => {
    fetchLocations()
  }, [fetchLocations])

  const columns = [
    columnHelper.accessor((_, index) => index + 1, {
      id: 'index',
      cell: info => info.getValue(),
      header: 'Nos'
    }),
    columnHelper.accessor(row => row.location.name, {
      id: 'name',
      cell: info => info.getValue(),
      header: 'Name'
    }),
    columnHelper.accessor(row => row.location.city, {
      id: 'city',
      cell: info => info.getValue(),
      header: 'City Name'
    }),
    columnHelper.accessor(row => row.location.state, {
      id: 'state',
      cell: info => info.getValue(),
      header: 'State Name'
    })
  ]

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {
      fuzzy: () => false
    }
  })

  return (
    <>
      <Card>
        <CardHeader title='Location List' />
        <div className='overflow-x-auto'>
          <table className={styles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}

export default UserLocationListing
