/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import type { Customers } from '@prisma/client'
import {
  Card,
  CardHeader,
  Button,
  Stack
} from '@mui/material'

import * as XLSX from 'xlsx'

import {
  useCanDoAction,
  showLoading,
  hideLoading,
  showSuccess,
  showError
} from '@/utils/frontend-helper'
import EmailsListClient from './CustomersListTable'

interface EmailsListProps {
  emails: Customers[]
  totalRecords: number
  totalPages: number
  page: number
  pageSize: number
}

const EmailsList: React.FC<EmailsListProps> = ({
  emails,
  totalRecords,
  totalPages,
  page,
  pageSize
}) => {
  const [excelHeaders, setExcelHeaders] = useState<string[]>([])
  const [excelData, setExcelData] = useState<any[]>([])

  const router = useRouter()
  const candoAction = useCanDoAction()

  const headers = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Phone Number' },
    { key: 'address', label: 'Address' },

  ];


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    showLoading()
    const file = e.target.files?.[0]

    if (!file) {
      hideLoading()

      return
    }

    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const binaryStr = event.target?.result

        if (!binaryStr) throw new Error('Failed to read file')

        const workbook = XLSX.read(binaryStr, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 })

        if (jsonData.length > 0) {
          const headers = jsonData[0] as string[]
          const rows = XLSX.utils.sheet_to_json(sheet)

          setExcelHeaders(headers)
          setExcelData(rows)

          sessionStorage.setItem('excelHeaders', JSON.stringify(headers))
          sessionStorage.setItem('excelData', JSON.stringify(rows))

          showSuccess('File uploaded successfully!')
          router.push('/customers/importData')
        } else {
          showError('Excel file is empty')
        }
      } catch (error) {
        console.error('File upload error:', error)
        showError('Failed to process the file')
      } finally {
        hideLoading()
      }
    }

    reader.readAsBinaryString(file)
  }



  const headerMap = Object.fromEntries(headers.map(({ key, label }) => [key, label]));

  const handleExport = async () => {
    try {
      showLoading();

      const chunkSize = 500;
      let skip = 0;
      let chunkIndex = 1;

      while (true) {
        const res = await fetch(`/api/customers/export-data?skip=${skip}`);
        const data = await res.json();

        if (!res.ok || data.length === 0) {
          if (chunkIndex === 1) showError('No data to export');
          break;
        }

        const cleaned = data.map((item: { id: string; createdAt: string; updatedAt: string;[key: string]: any }) => {
          const { id, createdAt, updatedAt, ...rest } = item;

          const mappedRow: Record<string, any> = {};

          for (const { key, label } of headers) {
            mappedRow[label] = rest[key];
          }

          return mappedRow;
        });

        const worksheet = XLSX.utils.json_to_sheet(cleaned);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
        XLSX.writeFile(workbook, `customers_export_${chunkIndex}.xlsx`);

        skip += chunkSize;
        chunkIndex++;
      }

      showSuccess('Exported Data successfully!');
    } catch (error) {
      console.error('Export error:', error);
      showError('Failed to export data');
    } finally {
      hideLoading();
    }
  };


 

  return (
    <Card sx={{ padding: 2, marginTop: 2 }}>
      <CardHeader
        title='Your Emails List'
        action={
          <Stack direction="row" spacing={2}>
            {candoAction(`create:email`) && (
              <Button
                variant='contained'
                color='primary'
                size='small'
                startIcon={<i className='tabler-plus' />}
                href='/email/form'
              >
                Add Email
              </Button >
            )}
            {/* <Button
            onClick={handleExport}
              variant='contained'
              color='primary'
              size='small'
              startIcon={<i className='tabler-download' />}
              component="label"
            >
              Import Emails
             
            </Button> */}


          </Stack>
        }
      />
      <EmailsListClient
        customers={emails}
        totalRecords={totalRecords}
        totalPages={totalPages}
        page={page}
        pageSize={pageSize}
      />
    </Card>
  )
}

export default EmailsList
