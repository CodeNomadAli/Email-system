import { useState } from 'react'

import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import { useForm } from 'react-hook-form'

import { Backdrop, CircularProgress } from '@mui/material'

import CustomTextField from '@core/components/mui/TextField'
import type { Folder, File } from '@/types'
import { showError } from '@/front-helper'

interface FormData {
  name: string
}

interface NewFolderModalProps {
  setDialogOpen: (open: boolean) => void
  title: string
  folderFile: Folder | File
  updateState: (fileFoldername: string, type: string) => void
}

export default function RenameFileFolder({ setDialogOpen, title, folderFile, updateState }: NewFolderModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>()

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (formBody: { name: string }) => {
    if (!folderFile) return

    if ('mimeType' in folderFile) {
      renameFile(folderFile.id, formBody.name)

      return
    }

    renameFolder(folderFile.id, formBody.name)
  }

  const renameFolder = async (folderId: string, folderName: string) => {
    try {
      setIsLoading(true)

      const res = await fetch('/api/hub/filemanager/folder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ folderId, folderName })
      })

      const { status, message } = await res.json()

      if (status === 200) {
        updateState(folderName, 'folder')
        setDialogOpen(false)

        return
      }

      showError(message)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const renameFile = async (fileId: string, fileName: string) => {
    try {
      setIsLoading(true)

      const res = await fetch('/api/hub/filemanager/file-upload', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileId, fileName })
      })

      const { status, message } = await res.json()

      if (status === 200) {
        updateState(fileName, 'file')
        setDialogOpen(false)

        return
      }

      showError(message)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box component='form' onSubmit={handleSubmit(onSubmit)} display='flex' flexDirection='column' gap={2}>
          <CustomTextField
            label='Name'
            autoFocus
            fullWidth
            {...register('name', {
              required: `Name is required`,
              maxLength: { value: 50, message: `Name is too long` }
            })}
            error={!!errors.name}
            helperText={errors.name ? errors.name.message : ''}
          />
          <Box display='flex' justifyContent='flex-end' gap={2}>
            <Button type='submit' variant='contained' color='primary'>
              Rename
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
