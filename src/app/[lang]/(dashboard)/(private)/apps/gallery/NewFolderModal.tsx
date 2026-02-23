import { useState } from 'react'

import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import { useForm } from 'react-hook-form'

import { Backdrop, CircularProgress } from '@mui/material'

import { showError } from '@/front-helper'

import CustomTextField from '@core/components/mui/TextField'
import type { Folder } from '@/types'

interface FormData {
  folderName: string
}

interface NewFolderModalProps {
  setDialogOpen: (open: boolean) => void
  setFolders: (folders: any) => void
  activeDir: Folder | undefined
}

export default function NewFolderModal({ setDialogOpen, setFolders, activeDir }: NewFolderModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>()

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (formBody: { folderName: string }) => {
    try {
      setIsLoading(true)

      const res = await fetch('/api/hub/filemanager/folder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...formBody, parentFolderId: activeDir?.id, name: activeDir?.name })
      })

      const { data, status, message } = await res.json()

      if (status === 200) {
        setDialogOpen(false)
        setFolders((prevFolders: any) => [...prevFolders, data.folder])

        setIsLoading(false)

        return
      }

      throw new Error(message)

      // Handle success (e.g., close modal, show success message, etc.)
    } catch (error) {
      // Handle error (e.g., show error message)
      if (error instanceof Error) {
        showError(error.message)
      } else {
        showError('An unknown error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <DialogTitle>Create New Folder</DialogTitle>
      <DialogContent>
        <Box component='form' onSubmit={handleSubmit(onSubmit)} display='flex' flexDirection='column' gap={2}>
          <CustomTextField
            label='Folder Name'
            autoFocus
            fullWidth
            {...register('folderName', {
              required: 'Folder name is required',
              maxLength: { value: 50, message: 'Folder name is too long' }
            })}
            error={!!errors.folderName}
            helperText={errors.folderName ? errors.folderName.message : ''}
          />
          <Box display='flex' justifyContent='flex-end' gap={2}>
            <Button type='submit' variant='contained' color='primary'>
              Create
            </Button>
            <Button variant='contained' color='secondary' onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
        <Backdrop open={isLoading} className='absolute inset-0 flex justify-center items-center z-[1000]'>
          <CircularProgress color='inherit' />
        </Backdrop>
      </DialogContent>
    </>
  )
}
